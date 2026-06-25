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
