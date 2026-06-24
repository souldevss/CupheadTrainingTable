// =============================================================================
// DOM ELEMENT REFERENCES
// =============================================================================
const table = document.getElementById("table");
const totals = document.getElementById("totals");
const rankChart = document.getElementById("rank-chart");
const categoryTabs = document.getElementById("category-tabs");

// =============================================================================
// APPLICATION STATE
// =============================================================================
const isPersonalTimesPage = document.body.dataset.page === "personal-times";
const categories = typeof speedrunCategories === "undefined"
    ? [{ id: "version-1-1", label: "1.1", title: "Game Version 1.1", description: "", islands }]
    : speedrunCategories;
let activeCategory = getInitialCategory();
let activeSubOption = getInitialSubOption();

// =============================================================================
// INITIALIZATION
// =============================================================================
renderCategoryControls();
renderActivePage();

// Set up export/import buttons if on personal times page
if (isPersonalTimesPage) {
    const exportBtn = document.getElementById("export-btn");
    const importBtn = document.getElementById("import-btn");
    const importFile = document.getElementById("import-file");

    if (exportBtn) {
        exportBtn.addEventListener("click", exportPersonalTimes);
    }

    if (importBtn && importFile) {
        importBtn.addEventListener("click", () => {
            importFile.click();
        });

        importFile.addEventListener("change", (e) => {
            if (e.target.files.length > 0) {
                importPersonalTimes(e.target.files[0]);
                e.target.value = ""; // Reset file input
            }
        });
    }
}

/**
 * Retrieves the initially selected category from localStorage
 * Handles migration from old category IDs to new structure
 * @returns {Object} The active category object
 */
function getInitialCategory()
{
    const storedCategoryId = localStorage.getItem("cupheadSpeedrunCategory");
    
    // Migrate old DLC category IDs to new unified DLC structure
    if (storedCategoryId === "version-DLC-lobber" || storedCategoryId === "version-DLC-charge") {
        localStorage.setItem("cupheadSpeedrunCategory", "version-DLC");
        const subOptionId = storedCategoryId === "version-DLC-lobber" ? "lobber" : "charge";
        localStorage.setItem("cupheadDlcSubOption", subOptionId);
        return categories.find(category => category.id === "version-DLC") || categories[0];
    }
    
    return categories.find(category => category.id === storedCategoryId) || categories[0];
}

/**
 * Retrieves the initially selected DLC sub-option from localStorage
 * @returns {string|null} The sub-option ID (e.g., 'lobber', 'charge') or null if not DLC
 */
function getInitialSubOption()
{
    if (activeCategory.id !== "version-DLC") return null;
    const storedSubOption = localStorage.getItem("cupheadDlcSubOption");
    return storedSubOption || "lobber";
}

/**
 * Renders category selection tabs
 * For DLC categories with sub-options, displays icon buttons for weapon selection
 */
function renderCategoryControls()
{
    if (!categoryTabs) return;

    // Generate HTML for category tabs
    categoryTabs.innerHTML = categories.map(category => {
        // DLC category with sub-options (Lobber/Charge)
        if (category.subOptions && category.id === activeCategory.id) {
            return `
                <div class="category-tab-group">
                    <button
                        class="category-tab is-active"
                        type="button"
                        data-category-id="${category.id}"
                    >
                        ${category.label}
                    </button>
                    <div class="category-sub-options">
                        ${category.subOptions.map(sub => `
                            <button
                                class="category-sub-option ${sub.id === activeSubOption ? "is-active" : ""}"
                                type="button"
                                data-sub-option-id="${sub.id}"
                                title="${sub.label}"
                            >
                                <img src="${sub.icon}" class="category-icon" alt="${sub.label}">
                            </button>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        // Regular category
        return `
            <button
                class="category-tab ${category.id === activeCategory.id ? "is-active" : ""}"
                type="button"
                data-category-id="${category.id}"
            >
                ${category.label}
            </button>
        `;
    }).join("");

    // Add event listeners for category tab clicks
    categoryTabs.querySelectorAll(".category-tab").forEach(button =>
    {
        button.addEventListener("click", () =>
        {
            const nextCategory = categories.find(category => category.id === button.dataset.categoryId);
            if (!nextCategory || nextCategory.id === activeCategory.id) return;

            activeCategory = nextCategory;
            activeSubOption = getInitialSubOption();
            localStorage.setItem("cupheadSpeedrunCategory", activeCategory.id);
            renderCategoryControls();
            renderActivePage();
        });
    });

    // Add event listeners for DLC sub-option icon clicks
    categoryTabs.querySelectorAll(".category-sub-option").forEach(button =>
    {
        button.addEventListener("click", () =>
        {
            const nextSubOption = button.dataset.subOptionId;
            if (!nextSubOption || nextSubOption === activeSubOption) return;

            activeSubOption = nextSubOption;
            localStorage.setItem("cupheadDlcSubOption", activeSubOption);
            renderCategoryControls();
            renderActivePage();
        });
    });
}

// =============================================================================
// DATA ACCESS FUNCTIONS
// =============================================================================

/**
 * Gets the active islands data based on current category and sub-option
 * @returns {Array} Array of island objects with level data
 */
function getActiveIslands()
{
    if (activeCategory.id === "version-DLC" && activeCategory.subOptions) {
        const subOption = activeCategory.subOptions.find(sub => sub.id === activeSubOption);
        return subOption ? subOption.islands : [];
    }
    return activeCategory.islands || [];
}

/**
 * Gets the active residual times based on current category and sub-option
 * @returns {Array} Array of residual time values for each rank
 */
function getActiveResidual()
{
    if (activeCategory.id === "version-DLC" && activeCategory.subOptions) {
        const subOption = activeCategory.subOptions.find(sub => sub.id === activeSubOption);
        return subOption ? subOption.residual : [];
    }
    return activeCategory.residual || [];
}

/**
 * Gets the active sob (sum of best) times based on current category and sub-option
 * @returns {Array|null} Array of sob time values for each rank, or null if not predefined
 */
function getActiveSob()
{
    if (activeCategory.id === "version-DLC" && activeCategory.subOptions) {
        const subOption = activeCategory.subOptions.find(sub => sub.id === activeSubOption);
        return subOption ? subOption.sob : null;
    }
    return activeCategory.sob || null;
}

// =============================================================================
// PAGE RENDERING FUNCTIONS
// =============================================================================

/**
 * Routes to the appropriate page renderer based on current page type
 */
function renderActivePage()
{
    if (isPersonalTimesPage) {
        renderPersonalTimesPage();
    } else {
        renderTimeTablePage();
    }
}

/**
 * Renders the time table page showing reference times for all levels
 */
function renderTimeTablePage()
{
    if (!activeCategory.islands && !activeCategory.subOptions) {
        renderPlaceholderTable();
        return;
    }

    let html = `
<table>
<thead>
<tr>
    <th class="island sticky-col-1">Islands</th>
    <th class="boss sticky-col-2">Levels</th>
    ${ranks.map(rank => `<th class="rank-col">${rank}</th>`).join("")}
</tr>
</thead>
<tbody>
`;

    // Render each island and its levels
    for (const island of getActiveIslands())
    {
        island.levels.forEach((boss, index) =>
        {
            html += "<tr>";

            // Add island name cell (rowspan for all levels in island)
            if(index === 0)
            {
                html += `
            <td
                rowspan="${island.levels.length}"
                class="island"
                style="background:${island.color}; color:${island.textcolor};"
            >
                ${island.name}
            </td>
            `;
            }

            // Add boss name and icon
            html += `
        <td class="boss" style="background: ${boss.background || '#ffffff'}; color: ${boss.color || '#000000'};">
            <div class="boss-content">
                ${boss.icon ? `<img src="${boss.icon}" class="boss-icon" alt="">` : ''}
                <span>${boss.name}</span>
            </div>
        </td>
        `;

            // Add time values for each rank
            boss.times.forEach((time, rankIndex) =>
            {
                const style = ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" };
                html += `
            <td class="rank-col rank-${rankIndex}" style="background: ${style.background}; color: ${style.color};">
                ${formatTime(time)}
            </td>
            `;
            });

            html += "</tr>";
        });
    }

    html += `
</tbody>
</table>
`;

    table.innerHTML = html;

    renderTimeTableTotals();

    window.addEventListener("load", matchColumnWidths);
    window.addEventListener("resize", matchColumnWidths);
}

/**
 * Renders the personal times page with input fields for user's times
 */
function renderPersonalTimesPage()
{
    if (!activeCategory.islands && !activeCategory.subOptions) {
        renderPlaceholderTable();
        return;
    }

    const storedTimes = getStoredPersonalTimes();
    let levelCounter = 0;
    let html = `
<table class="personal-table">
<thead>
<tr>
    <th class="island sticky-col-1">Islands</th>
    <th class="boss sticky-col-2">Levels</th>
    <th class="personal-time-col">My Time</th>
    <th class="personal-rank-col">Rank</th>
</tr>
</thead>
<tbody>
`;

    // Render each island and its levels with input fields
    for (const island of getActiveIslands())
    {
        island.levels.forEach((boss, index) =>
        {
            const inputId = `personal-time-${levelCounter}`;
            const rowStyle = getPersonalRankStyle(null);

            html += "<tr>";

            // Add island name cell (rowspan for all levels in island)
            if(index === 0)
            {
                html += `
            <td
                rowspan="${island.levels.length}"
                class="island"
                style="background:${island.color}; color:${island.textcolor};"
            >
                ${island.name}
            </td>
            `;
            }

            // Add boss info, time input, and rank display
            html += `
        <td class="boss" style="background: ${boss.background || '#ffffff'}; color: ${boss.color || '#000000'};">
            <div class="boss-content">
                ${boss.icon ? `<img src="${boss.icon}" class="boss-icon" alt="">` : ''}
                <span>${boss.name}</span>
            </div>
        </td>
        <td class="personal-time-col">
            <input
                id="${inputId}"
                class="time-input"
                type="text"
                inputmode="decimal"
                autocomplete="off"
                placeholder="0:00.00"
                value="${escapeAttribute(storedTimes[inputId] || "")}"
                data-level-index="${levelCounter}"
            >
        </td>
        <td
            class="personal-rank-col personal-rank-empty"
            data-rank-output="${levelCounter}"
            style="background: ${rowStyle.background}; color: ${rowStyle.color};"
        >
            -
        </td>
        `;

            html += "</tr>";
            levelCounter++;
        });
    }

    html += `
</tbody>
</table>
`;

    table.innerHTML = html;
    renderPersonalTotals();
    syncAllPersonalRanks();
    renderRankChart();

    // Add input event listeners for real-time rank updates
    table.querySelectorAll(".time-input").forEach(input =>
    {
        input.addEventListener("input", () =>
        {
            storedTimes[input.id] = input.value;
            localStorage.setItem(getPersonalTimesStorageKey(), JSON.stringify(storedTimes));
            syncPersonalRank(input);
            renderPersonalTotals();
            renderRankChart();
        });
    });
}

/**
 * Renders the totals table showing island times, residual, and sob for each rank
 */
function renderTimeTableTotals()
{
    const residual = getActiveResidual();

    let totalsHtml = `
<table>
<thead>
<tr>
    <th class="island sticky-col-1">Isle Times</th>
    ${ranks.map(rank => `<th class="rank-col">${rank}</th>`).join("")}
</tr>
</thead>
<tbody>
`;

    const activeIslands = getActiveIslands();

    // Render island total times for each rank
    for(let i = 0; i < activeIslands.length; i++)
    {
        const rowStyle = totalsRowsStyles.find(r => r.name === activeIslands[i].name) || { background: "#333", color: "#fff" };
        totalsHtml += `
    <tr>
        <td class="island sticky-col-1" style="background: ${rowStyle.background}; color: ${rowStyle.color};">${activeIslands[i].name}</td>
        ${ranks.map((_, rankIndex) =>
        {
            const total = getIslandTotal(i, rankIndex);
            const style = ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" };
            return `
            <td class="rank-${rankIndex}" style="background: ${style.background}; color: ${style.color};">
                ${formatTime(total)}
            </td>
            `;
        }).join("")}
    </tr>
    `;
    }

    // Render residual times for each rank
    const residualStyle = totalsRowsStyles.find(r => r.name === "Residual") || { background: "#333", color: "#fff" };
    totalsHtml += `
<tr>
    <td class="island sticky-col-1" style="background: ${residualStyle.background}; color: ${residualStyle.color};">Residual</td>
    ${residual.map((value, rankIndex) =>
        {
            const style = ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" };
            return `
            <td class="rank-${rankIndex}" style="background: ${style.background}; color: ${style.color};">
                ${formatTime(value)}
            </td>
            `;
        }
    ).join("")}
</tr>
`;

    // Render sob (sum of best) times for each rank
    const sobStyle = totalsRowsStyles.find(r => r.name === "Sob") || { background: "#333", color: "#fff" };
    const activeSob = getActiveSob();
    totalsHtml += `
<tr>
    <td class="island sticky-col-1" style="background: ${sobStyle.background}; color: ${sobStyle.color};">Sob</td>
    ${ranks.map((_, rankIndex) =>
    {
        const total = (activeSob && activeSob[rankIndex] !== undefined) ? activeSob[rankIndex] : getSobTotal(rankIndex);
        const style = ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" };
        return `
        <td class="rank-${rankIndex}" style="background: ${style.background}; color: ${style.color};">
            ${formatTime(total)}
        </td>
        `;
    }).join("")}
</tr>
`;

    totalsHtml += `
</tbody>
</table>
`;

    totals.innerHTML = totalsHtml;
}

function getActiveResidual()
{
    if (activeCategory.id === "version-DLC" && activeCategory.subOptions) {
        const subOption = activeCategory.subOptions.find(sub => sub.id === activeSubOption);
        return subOption ? subOption.residual : [];
    }
    return activeCategory.residual || [];
}

function getActiveSob()
{
    if (activeCategory.id === "version-DLC" && activeCategory.subOptions) {
        const subOption = activeCategory.subOptions.find(sub => sub.id === activeSubOption);
        return subOption ? subOption.sob : null;
    }
    return activeCategory.sob || null;
}

/**
 * Calculates the sob (sum of best) time for a specific rank
 * Sob = sum of all island totals + residual for that rank
 * @param {number} rankIndex - The rank index to calculate for
 * @returns {number} The calculated sob time in seconds
 */
function getSobTotal(rankIndex)
{
    const residual = getActiveResidual();
    const residualValue = residual && residual.length > rankIndex ? residual[rankIndex] : 0;
    const islandsTotal = getActiveIslands().reduce(
        (sum, _, islandIndex) => sum + getIslandTotal(islandIndex, rankIndex),
        0
    );
    return residualValue + islandsTotal;
}

/**
 * Renders a placeholder table for categories without data
 */
function renderPlaceholderTable()
{
    table.innerHTML = `
    <div class="placeholder-table">
        <h2>${activeCategory.title}</h2>
        <p>${activeCategory.description}</p>
        <table>
            <thead>
                <tr>
                    <th>Section</th>
                    <th>Status</th>
                    <th>Times</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${activeCategory.label}</td>
                    <td>Placeholder</td>
                    <td>Coming soon</td>
                </tr>
            </tbody>
        </table>
    </div>
    `;
    totals.innerHTML = "";

    if (rankChart) {
        rankChart.innerHTML = "";
    }
}

/**
 * Renders the personal totals table showing user's times and ranks for each island
 */
function renderPersonalTotals()
{
    const totalsData = getPersonalTotalsData();
    let totalsHtml = `
<table class="personal-totals-table">
<thead>
<tr>
    <th class="island sticky-col-1">Isle Times</th>
    <th class="personal-time-col" >My Time</th>
    <th class="personal-rank-col">Rank</th>
</tr>
</thead>
<tbody>
`;

    totalsData.forEach(row =>
    {
        const rowStyle = totalsRowsStyles.find(r => r.name === row.name) || { background: "#333", color: "#fff" };
        const rankIndex = row.total === null ? null : getRankIndexForTime(row.total, row.thresholds);
        const rankStyle = getPersonalRankStyle(rankIndex);

        totalsHtml += `
    <tr>
        <td class="island sticky-col-1" style="background: ${rowStyle.background}; color: ${rowStyle.color};">${row.name}</td>
        <td class="personal-time-col">${row.total === null ? "-" : formatTime(row.total)}</td>
        <td class="personal-rank-col ${rankIndex === null ? "personal-rank-empty" : ""}" style="background: ${rankStyle.background}; color: ${rankStyle.color};">
            ${rankIndex === null ? "-" : ranks[rankIndex]}
        </td>
    </tr>
    `;
    });

    totalsHtml += `
</tbody>
</table>
`;

    totals.innerHTML = totalsHtml;
}

/**
 * Renders the rank distribution chart showing statistics about user's performance
 */
function renderRankChart()
{
    if (!rankChart) return;

    const distribution = getPersonalRankDistribution();
    const filledCount = distribution.reduce((sum, item) => sum + item.count, 0);
    const totalCount = getTotalLevelCount();
    const visibleRanks = distribution.filter(item => item.count > 0);
    const topRank = visibleRanks[0];
    const mostCommonRank = visibleRanks.reduce((best, item) =>
        !best || item.count > best.count ? item : best,
        null
    );

    // Generate horizontal stack segments for rank distribution
    const segmentsHtml = filledCount === 0
        ? `<div class="rank-chart-empty-segment"></div>`
        : visibleRanks.map(item =>
        {
            const percent = (item.count / filledCount) * 100;
            return `
            <span
                class="rank-chart-segment"
                title="${item.rank}: ${item.count}"
                style="width: ${percent}%; background: ${item.style.background};"
            ></span>
            `;
        }).join("");

    // Generate detailed rank rows with percentages
    const rowsHtml = filledCount === 0
        ? `<div class="rank-chart-empty">No times yet</div>`
        : visibleRanks.map(item =>
        {
            const percent = Math.round((item.count / filledCount) * 100);
            return `
            <div class="rank-chart-row">
                <span class="rank-chart-badge" style="background: ${item.style.background}; color: ${item.style.color};">${item.rank}</span>
                <div class="rank-chart-track">
                    <span style="width: ${percent}%; background: ${item.style.background};"></span>
                </div>
                <span class="rank-chart-count">${item.count}</span>
            </div>
            `;
        }).join("");

    rankChart.innerHTML = `
    <div class="rank-chart-header">
        <div>
            <h2>Rank Distribution</h2>
            <span>${filledCount}/${totalCount} times</span>
        </div>
        <strong>${topRank ? topRank.rank : "-"}</strong>
    </div>
    <div class="rank-chart-stack">${segmentsHtml}</div>
    <div class="rank-chart-stats">
        <div>
            <span>Best</span>
            <strong>${topRank ? topRank.rank : "-"}</strong>
        </div>
        <div>
            <span>Most</span>
            <strong>${mostCommonRank ? mostCommonRank.rank : "-"}</strong>
        </div>
    </div>
    <div class="rank-chart-list">
        ${rowsHtml}
    </div>
    `;
}

// =============================================================================
// CALCULATION HELPER FUNCTIONS
// =============================================================================

/**
 * Calculates the total time for an island at a specific rank
 * @param {number} islandIndex - Index of the island in active islands array
 * @param {number} rankIndex - Index of the rank to calculate for
 * @returns {number} Total time in seconds for all levels in the island at that rank
 */
function getIslandTotal(islandIndex, rankIndex)
{
    return getActiveIslands()[islandIndex].levels.reduce(
        (sum, boss) => sum + boss.times[rankIndex],
        0
    );
}

/**
 * Calculates personal totals data including island times, residual, and sob
 * Residual is based on the user's average rank across all levels
 * @returns {Array} Array of row objects with name, total, and thresholds
 */
function getPersonalTotalsData()
{
    const inputs = [...table.querySelectorAll(".time-input")];
    const islandRows = [];
    let inputIndex = 0;

    // Calculate totals for each island
    getActiveIslands().forEach((island, islandIndex) =>
    {
        const values = island.levels.map(() =>
        {
            const input = inputs[inputIndex++];
            return input ? parseTime(input.value) : null;
        });
        const hasAllTimes = values.every(value => value !== null);

        islandRows.push({
            name: island.name,
            total: hasAllTimes ? values.reduce((sum, value) => sum + value, 0) : null,
            thresholds: ranks.map((_, rankIndex) => getIslandTotal(islandIndex, rankIndex))
        });
    });

    // Calculate residual based on user's average rank
    const residual = getActiveResidual();
    const averageRankIndex = getAverageRankIndex();
    if (residual.length > 0 && averageRankIndex !== null) {
        islandRows.push({
            name: "Residual",
            total: residual[averageRankIndex],
            thresholds: residual
        });
    } else if (residual.length > 0) {
        islandRows.push({
            name: "Residual",
            total: residual[0],
            thresholds: residual
        });
    }

    // Calculate sob (sum of best)
    const levelRows = islandRows.filter(row => row.name !== "Residual");
    const hasAllLevelRows = levelRows.every(row => row.total !== null);
    const residualRow = islandRows.find(row => row.name === "Residual");
    const residualTotal = residualRow ? residualRow.total : 0;
    const activeSob = getActiveSob();
    
    // Calculate sob thresholds dynamically if not predefined
    let sobThresholds;
    if (activeSob && activeSob.length > 0) {
        sobThresholds = activeSob;
    } else {
        // Calculate sob as sum of all island totals + residual for each rank
        sobThresholds = ranks.map((_, rankIndex) => {
            const residualValue = residual && residual.length > rankIndex ? residual[rankIndex] : 0;
            const islandsTotal = getActiveIslands().reduce(
                (sum, _, islandIndex) => sum + getIslandTotal(islandIndex, rankIndex),
                0
            );
            return residualValue + islandsTotal;
        });
    }
    
    islandRows.push({
        name: "Sob",
        total: hasAllLevelRows ? levelRows.reduce((sum, row) => sum + row.total, residualTotal) : null,
        thresholds: sobThresholds
    });

    return islandRows;
}

/**
 * Calculates the average rank index from all user's personal times
 * Used to determine which residual time to use
 * @returns {number|null} Average rank index (0-18) or null if no times entered
 */
function getAverageRankIndex()
{
    const inputs = [...table.querySelectorAll(".time-input")];
    const rankIndices = [];

    inputs.forEach(input =>
    {
        const level = getLevelByFlatIndex(Number(input.dataset.levelIndex));
        const seconds = parseTime(input.value);

        if (seconds === null) return;

        const rankIndex = getRankIndexForTime(seconds, level.times);
        rankIndices.push(rankIndex);
    });

    if (rankIndices.length === 0) return null;

    const sum = rankIndices.reduce((acc, val) => acc + val, 0);
    return Math.round(sum / rankIndices.length);
}

/**
 * Calculates the distribution of ranks across all user's personal times
 * @returns {Array} Array of rank objects with count and style information
 */
function getPersonalRankDistribution()
{
    const counts = ranks.map((rank, rankIndex) => ({
        rank,
        rankIndex,
        count: 0,
        style: ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" }
    }));

    table.querySelectorAll(".time-input").forEach(input =>
    {
        const level = getLevelByFlatIndex(Number(input.dataset.levelIndex));
        const seconds = parseTime(input.value);

        if (seconds === null) return;

        const rankIndex = getRankIndexForTime(seconds, level.times);
        counts[rankIndex].count++;
    });

    return counts;
}

/**
 * Gets the total number of levels across all active islands
 * @returns {number} Total level count
 */
function getTotalLevelCount()
{
    return getActiveIslands().reduce((sum, island) => sum + island.levels.length, 0);
}

// =============================================================================
// LOCAL STORAGE FUNCTIONS
// =============================================================================

/**
 * Retrieves stored personal times from localStorage with migration support
 * Handles migration from old storage keys to new structure
 * @returns {Object} Object mapping input IDs to time values
 */
function getStoredPersonalTimes()
{
    try {
        const categoryTimes = JSON.parse(localStorage.getItem(getPersonalTimesStorageKey())) || {};
        const oldTimes = activeCategory.id === "version-1-1"
            ? JSON.parse(localStorage.getItem("cupheadPersonalTimes")) || {}
            : {};
        
        // Migrate old DLC personal times to Lobber sub-option
        if (activeCategory.id === "version-DLC" && activeSubOption === "lobber") {
            const oldDlcTimes = JSON.parse(localStorage.getItem("cupheadPersonalTimes:version-DLC")) || {};
            if (Object.keys(oldDlcTimes).length > 0) {
                localStorage.setItem("cupheadPersonalTimes:version-DLC-lobber", JSON.stringify(oldDlcTimes));
                localStorage.removeItem("cupheadPersonalTimes:version-DLC");
                return { ...oldTimes, ...categoryTimes, ...oldDlcTimes };
            }
        }
        
        // Migrate old DLC-Lobber personal times to new structure
        if (activeCategory.id === "version-DLC" && activeSubOption === "lobber") {
            const oldLobberTimes = JSON.parse(localStorage.getItem("cupheadPersonalTimes:version-DLC-lobber")) || {};
            if (Object.keys(oldLobberTimes).length > 0) {
                localStorage.setItem("cupheadPersonalTimes:version-DLC:lobber", JSON.stringify(oldLobberTimes));
                localStorage.removeItem("cupheadPersonalTimes:version-DLC-lobber");
                return { ...oldTimes, ...categoryTimes, ...oldLobberTimes };
            }
        }
        
        // Migrate old DLC-Charge personal times to new structure
        if (activeCategory.id === "version-DLC" && activeSubOption === "charge") {
            const oldChargeTimes = JSON.parse(localStorage.getItem("cupheadPersonalTimes:version-DLC-charge")) || {};
            if (Object.keys(oldChargeTimes).length > 0) {
                localStorage.setItem("cupheadPersonalTimes:version-DLC:charge", JSON.stringify(oldChargeTimes));
                localStorage.removeItem("cupheadPersonalTimes:version-DLC-charge");
                return { ...oldTimes, ...categoryTimes, ...oldChargeTimes };
            }
        }

        return { ...oldTimes, ...categoryTimes };
    } catch {
        return {};
    }
}

/**
 * Generates the localStorage key for personal times based on current category and sub-option
 * @returns {string} The storage key for the current context
 */
function getPersonalTimesStorageKey()
{
    if (activeCategory.id === "version-DLC" && activeSubOption) {
        return `cupheadPersonalTimes:${activeCategory.id}:${activeSubOption}`;
    }
    return `cupheadPersonalTimes:${activeCategory.id}`;
}

/**
 * Exports all personal times across all categories to a downloadable JSON file
 */
function exportPersonalTimes()
{
    const exportData = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        categories: {}
    };

    // Collect times for all categories and sub-options
    categories.forEach(category => {
        if (category.subOptions) {
            // Category with sub-options (DLC)
            exportData.categories[category.id] = {
                label: category.label,
                subOptions: {}
            };
            category.subOptions.forEach(subOption => {
                const storageKey = `cupheadPersonalTimes:${category.id}:${subOption.id}`;
                const times = JSON.parse(localStorage.getItem(storageKey)) || {};
                exportData.categories[category.id].subOptions[subOption.id] = {
                    label: subOption.label,
                    times
                };
            });
        } else {
            // Regular category
            const storageKey = `cupheadPersonalTimes:${category.id}`;
            const times = JSON.parse(localStorage.getItem(storageKey)) || {};
            exportData.categories[category.id] = {
                label: category.label,
                times
            };
        }
    });

    // Create and download the file
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cuphead-times-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Imports personal times from an uploaded JSON file
 * @param {File} file - The JSON file to import
 */
function importPersonalTimes(file)
{
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);

            // Validate basic structure
            if (!importData.categories) {
                alert("Invalid file format: missing categories data");
                return;
            }

            let importCount = 0;

            // Import times for each category
            Object.keys(importData.categories).forEach(categoryId => {
                const categoryData = importData.categories[categoryId];

                if (categoryData.subOptions) {
                    // Category with sub-options
                    Object.keys(categoryData.subOptions).forEach(subOptionId => {
                        const subOptionData = categoryData.subOptions[subOptionId];
                        if (subOptionData.times && Object.keys(subOptionData.times).length > 0) {
                            const storageKey = `cupheadPersonalTimes:${categoryId}:${subOptionId}`;
                            localStorage.setItem(storageKey, JSON.stringify(subOptionData.times));
                            importCount++;
                        }
                    });
                } else if (categoryData.times) {
                    // Regular category
                    if (Object.keys(categoryData.times).length > 0) {
                        const storageKey = `cupheadPersonalTimes:${categoryId}`;
                        localStorage.setItem(storageKey, JSON.stringify(categoryData.times));
                        importCount++;
                    }
                }
            });

            // Refresh the current page to show imported times
            if (importCount > 0) {
                alert(`Successfully imported times from ${importCount} category/sub-option(s)`);
                renderActivePage();
            } else {
                alert("No times found in the import file");
            }
        } catch (error) {
            alert("Error importing file: Invalid JSON format");
            console.error("Import error:", error);
        }
    };
    reader.readAsText(file);
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} value - The string to escape
 * @returns {string} The escaped string
 */
function escapeAttribute(value)
{
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("\"", "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

// =============================================================================
// RANK CALCULATION FUNCTIONS
// =============================================================================

/**
 * Updates all personal rank displays based on current input values
 */
function syncAllPersonalRanks()
{
    table.querySelectorAll(".time-input").forEach(syncPersonalRank);
}

/**
 * Updates the rank display for a single time input
 * @param {HTMLInputElement} input - The time input element to sync
 */
function syncPersonalRank(input)
{
    const level = getLevelByFlatIndex(Number(input.dataset.levelIndex));
    const rankOutput = table.querySelector(`[data-rank-output="${input.dataset.levelIndex}"]`);
    const seconds = parseTime(input.value);
    const rankIndex = seconds === null ? null : getRankIndexForTime(seconds, level.times);
    const style = getPersonalRankStyle(rankIndex);

    rankOutput.textContent = rankIndex === null ? "-" : ranks[rankIndex];
    rankOutput.classList.toggle("personal-rank-empty", rankIndex === null);
    rankOutput.style.background = style.background;
    rankOutput.style.color = style.color;
}

/**
 * Gets a level object by its flat index across all islands
 * @param {number} targetIndex - The flat index to search for
 * @returns {Object} The level object at the specified index
 */
function getLevelByFlatIndex(targetIndex)
{
    let currentIndex = 0;

    for (const island of getActiveIslands())
    {
        for (const level of island.levels)
        {
            if (currentIndex === targetIndex) return level;
            currentIndex++;
        }
    }

    return getActiveIslands()[0].levels[0];
}

/**
 * Determines the rank index for a given time based on threshold values
 * @param {number} seconds - The time in seconds to rank
 * @param {Array} thresholds - Array of time thresholds for each rank
 * @returns {number} The rank index (0-18)
 */
function getRankIndexForTime(seconds, thresholds)
{
    const rankIndex = thresholds.findIndex(threshold => seconds <= threshold);
    return rankIndex === -1 ? ranks.length - 1 : rankIndex;
}

/**
 * Gets the styling for a personal rank display
 * @param {number|null} rankIndex - The rank index or null if no rank
 * @returns {Object} Style object with background and color properties
 */
function getPersonalRankStyle(rankIndex)
{
    if (rankIndex === null) {
        return { background: "#11092c", color: "#ffffff" };
    }

    return ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" };
}

// =============================================================================
// TIME PARSING AND FORMATTING FUNCTIONS
// =============================================================================

/**
 * Parses a time string into seconds
 * Supports formats: "MM:SS.ss", "MM:SS", "SS.ss", or just "SS"
 * @param {string} value - The time string to parse
 * @returns {number|null} Time in seconds, or null if invalid
 */
function parseTime(value)
{
    const cleanValue = value.trim().replace(",", ".");

    if (!cleanValue) return null;

    // Handle MM:SS format
    if (cleanValue.includes(":")) {
        const parts = cleanValue.split(":");
        if (parts.length !== 2) return null;

        const minutes = Number(parts[0]);
        const seconds = Number(parts[1]);

        if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
        if (minutes < 0 || seconds < 0 || seconds >= 60) return null;

        return minutes * 60 + seconds;
    }

    // Handle plain seconds format
    const seconds = Number(cleanValue);
    return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

/**
 * Matches column widths between the main table and totals table for visual alignment
 */
function matchColumnWidths() {
    const tableHeaderCells = table.querySelectorAll("thead th");
    const totalsHeaderCells = totals.querySelectorAll("thead th");
    
    if (tableHeaderCells.length === 0 || totalsHeaderCells.length === 0) return;
    
    let tableIndex = 2; 
    let totalsIndex = 1; 

    // Match rank column widths
    while (tableIndex < tableHeaderCells.length && totalsIndex < totalsHeaderCells.length) {
        const width = tableHeaderCells[tableIndex].getBoundingClientRect().width;
        totalsHeaderCells[totalsIndex].style.minWidth = `${width}px`;
        totalsHeaderCells[totalsIndex].style.maxWidth = `${width}px`;
        tableIndex++;
        totalsIndex++;
    }

    // Match combined island + boss column width
    const firstIslandWidth = table.querySelector(".island")?.getBoundingClientRect().width || 0;
    const firstBossWidth = table.querySelector(".boss")?.getBoundingClientRect().width || 0;
    const combinedFirstWidth = firstIslandWidth + firstBossWidth;
    totalsHeaderCells[0].style.minWidth = `${combinedFirstWidth}px`;
    totalsHeaderCells[0].style.maxWidth = `${combinedFirstWidth}px`;
}

/**
 * Formats a time in seconds into a human-readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (e.g., "1:23.45" or "45.67")
 */
function formatTime(seconds)
{
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round((seconds % 60) * 100) / 100;

    if (minutes > 0) {
        const secondsStr = String(remainingSeconds);
        const parts = secondsStr.split('.');
        const paddedInteger = parts[0].padStart(2, "0");
        
        return parts.length > 1 
            ? `${minutes}:${paddedInteger}.${parts[1]}` 
            : `${minutes}:${paddedInteger}`;
    }

    return String(remainingSeconds);
}
