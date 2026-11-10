// Page render router

function createBossCellMarkup(boss)
{
    const iconMarkup = boss.icon ? `<img src="${boss.icon}" class="boss-icon" alt="" loading="lazy" decoding="async">` : "";
    const splitBase = activeGame === "silksong" ? "#2d2632" : "var(--panel-bg)";
    const splitColor = activeGame === "silksong" && boss.color
        ? `color-mix(in srgb, #e25363 20%, ${boss.color})` : boss.color;
    const background = activeGame === "cuphead" ? boss.background || "#ffffff"
        : `color-mix(in srgb, ${splitBase} 68%, ${splitColor || splitBase})`;
    const color = activeGame === "cuphead" ? boss.color || "#000000" : "#edf1f5";
    const accent = activeGame !== "cuphead" && splitColor ? `border-inline-start: 4px solid ${splitColor};` : "";
    return `
        <td class="boss" style="background: ${background}; color: ${color}; ${accent}">
            <div class="boss-content">
                ${iconMarkup}
                <span>${escapeAttribute(boss.name || "")}</span>
            </div>
        </td>
    `;
}

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
