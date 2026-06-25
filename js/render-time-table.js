// Time table page rendering (index2.html)

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

    for (const island of getActiveIslands()) {
        island.levels.forEach((boss, index) =>
        {
            // Generate times array from fRankTime if not already present
            if (!boss.times && boss.fRankTime) {
                boss.times = generateRankTimes(boss.fRankTime, getActiveRankMultipliers());
            }

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

            html += createBossCellMarkup(boss);

            boss.times.forEach((time, rankIndex) =>
            {
                const style = ranksStyles[rankIndex] || { background: "transparent", color: "#ffffff" };

                if (rankIndex === 0 && boss.wrUrl) {
                    html += `
            <td class="rank-col rank-0" style="background: ${style.background}; color: ${style.color};">
                <a class="wr-link" href="${escapeAttribute(boss.wrUrl)}" target="_blank" rel="noopener" title="${escapeAttribute(boss.wrPlayer ? boss.wrPlayer + ' — ' + formatTime(time) : formatTime(time))}" style="color: ${style.color};">
                    ${formatTime(time)}
                </a>
            </td>
            `;
                } else {
                    html += `
            <td class="rank-col rank-${rankIndex}" style="background: ${style.background}; color: ${style.color};">
                ${formatTime(time)}
            </td>
            `;
                }
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

    requestAnimationFrame(matchColumnWidths);
    window.addEventListener("load", matchColumnWidths);
    window.addEventListener("resize", matchColumnWidths);
}

/**
 * Renders the totals table showing island times, residual, and sob for each rank
 */
function renderTimeTableTotals()
{
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

    for (let i = 0; i < activeIslands.length; i++) {
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

    const residualStyle = totalsRowsStyles.find(r => r.name === "Residual") || { background: "#333", color: "#fff" };
    const residualArray = getResidualRankTimes();

    totalsHtml += `
<tr data-tooltip="Residuals are the time spent outside from levels, like walking in the map, scorecards, cutscenes etc.">
    <td class="island sticky-col-1" style="background: ${residualStyle.background}; color: ${residualStyle.color};">Residual</td>
    ${residualArray.map((value, rankIndex) =>
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

    const sobStyle = totalsRowsStyles.find(r => r.name === "Sob") || { background: "#333", color: "#fff" };

    totalsHtml += `
<tr data-tooltip="Sum of all the best times + Residual">
    <td class="island sticky-col-1" style="background: ${sobStyle.background}; color: ${sobStyle.color};">Sob</td>
    ${ranks.map((_, rankIndex) =>
    {
        const total = getSobTotal(rankIndex);
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

    // Set up tooltips for Residual and Sob rows
    const tooltipRows = totals.querySelectorAll("[data-tooltip]");
    let infoTooltip = document.querySelector(".info-tooltip");
    if (!infoTooltip) {
        infoTooltip = document.createElement("div");
        infoTooltip.className = "info-tooltip";
        infoTooltip.style.position = "fixed";
        infoTooltip.style.zIndex = "10000";
        infoTooltip.style.pointerEvents = "none";
        infoTooltip.style.opacity = "0";
        infoTooltip.style.transition = "opacity 0.15s ease";
        document.body.appendChild(infoTooltip);
    }

    tooltipRows.forEach(row => {
        row.addEventListener("mouseenter", () => {
            infoTooltip.textContent = row.dataset.tooltip;
            infoTooltip.style.opacity = "1";
        });

        row.addEventListener("mousemove", (e) => {
            infoTooltip.style.left = `${e.clientX + 12}px`;
            infoTooltip.style.top = `${e.clientY + 12}px`;
        });

        row.addEventListener("mouseleave", () => {
            infoTooltip.style.opacity = "0";
        });
    });
}
