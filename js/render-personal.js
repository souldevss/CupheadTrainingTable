// Personal times page rendering (index.html)

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
    <th class="personal-time-col"></th>
</tr>
</thead>
<tbody>
`;

    for (const island of getActiveIslands()) {
        island.levels.forEach((boss, index) =>
        {
            const inputId = `personal-time-${levelCounter}`;
            const rowStyle = getPersonalRankStyle(null);

            html += "<tr>";

            if (index === 0) {
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

            html += `${createBossCellMarkup(boss)}
        <td class="personal-time-col">
            <div class="time-input-wrapper" data-time-wrapper="${levelCounter}">
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
                <span class="time-rank-display" data-rank-output="${levelCounter}" style="background: ${rowStyle.background}; color: ${rowStyle.color};">-</span>
            </div>
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

    table.querySelectorAll(".time-input").forEach(input => {
        let loopAudio = null;

        const playSelectSound = () => playSound(APP_SOUND_URLS.selection, 0.25);

        const startLoopSound = () => {
            if (loopAudio) {
                loopAudio.pause();
                loopAudio.currentTime = 0;
            }
            loopAudio = new Audio(APP_SOUND_URLS.loop);
            loopAudio.loop = true;
            loopAudio.volume = 0.2;
            loopAudio.play().catch(() => {});
        };

        const stopLoopSound = () => {
            if (loopAudio) {
                loopAudio.pause();
                loopAudio.currentTime = 0;
            }
            playSound(APP_SOUND_URLS.loopEnd, 0.2);
        };

        input.addEventListener("focus", () => {
            playSelectSound();
            startLoopSound();
        });

        input.addEventListener("blur", stopLoopSound);

        input.addEventListener("input", () => {
            storedTimes[input.id] = input.value;
            localStorage.setItem(getPersonalTimesStorageKey(), JSON.stringify(storedTimes));
            syncPersonalRank(input);
            renderPersonalTotals();
            renderRankChart();
        });
    });
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
    <th class="personal-time-col"></th>
</tr>
</thead>
<tbody>
`;

    totalsData.forEach(row =>
    {
        const rowStyle = totalsRowsStyles.find(r => r.name === row.name) || { background: "#333", color: "#fff" };
        const rankIndex = row.total === null ? null : getRankIndexForTime(row.total, row.thresholds);
        const rankStyle = getInterpolatedRankStyle(row.total, row.thresholds);

        totalsHtml += `
    <tr>
        <td class="island sticky-col-1" style="background: ${rowStyle.background}; color: ${rowStyle.color};">${row.name}</td>
        <td class="personal-time-col" style="background: ${rankStyle.background}; color: ${rankStyle.color};">
            <div class="time-input-wrapper" style="background: transparent !important; justify-content: space-between; padding: 1px 6px;">
                <span>${row.total === null ? "-" : formatTime(row.total)}</span>
                <span class="time-rank-display" style="background: ${rankStyle.background}; color: ${rankStyle.color};">
                    ${rankIndex === null ? "-" : ranks[rankIndex]}
                </span>
            </div>
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
