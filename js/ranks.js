// Rank calculation, styling, and personal-time sync

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

const hollowKnightRankStyles = [
    { background: "#eef3f8", color: "#17212b" },
    { background: "#bce1f1", color: "#947615", fontWeight: "900" },
    { background: "#368f9c", color: "#f3fbfc" },
    { background: "#347d8e", color: "#f1f8fa" },
    { background: "#3e7186", color: "#f0f6f8" },
    { background: "#476a7c", color: "#f0f5f7" },
    { background: "#526579", color: "#f1f4f7" },
    { background: "#665f78", color: "#f4f1f7" },
    { background: "#775b76", color: "#f7eff5" },
    { background: "#87556f", color: "#f8eef3" },
    { background: "#945467", color: "#faedf0" },
    { background: "#99565b", color: "#fbefed" },
    { background: "#8c4d50", color: "#f8ecea" },
    { background: "#76474d", color: "#f4e9e9" },
    { background: "#62414a", color: "#f0e7eb" },
    { background: "#513b49", color: "#ece5ed" },
    { background: "#403643", color: "#e8e4ec" },
    { background: "#302d3a", color: "#e3e2ec" },
    { background: "#171923", color: "#e5cbd5" }
];

function getRankStyle(rankIndex)
{
    const styles = activeGame === "hollow-knight" ? hollowKnightRankStyles : ranksStyles;
    return styles[rankIndex] || { background: "transparent", color: "#ffffff" };
}

/**
 * Gets the styling for a personal rank display
 * @param {number|null} rankIndex - The rank index or null if no rank
 * @returns {Object} Style object with background and color properties
 */
function getPersonalRankStyle(rankIndex)
{
    if (rankIndex === null) {
        return {
            background: activeGame === "hollow-knight" ? "#111824" : "#11092c",
            color: "#ffffff"
        };
    }

    return getRankStyle(rankIndex);
}

/**
 * Calculates the luminance of a color for contrast checking
 * @param {string} hexColor - Color in hex format
 * @returns {number} Luminance value (0-1)
 */
function getLuminance(hexColor)
{
    const c = hexColor.replace("#", "");
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;

    const linearR = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    const linearG = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    const linearB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
}

/**
 * Interpolates between two hex colors based on a factor (0-1)
 * @param {string} color1 - Starting color in hex format (e.g., "#ff0000")
 * @param {string} color2 - Ending color in hex format (e.g., "#0000ff")
 * @param {number} factor - Interpolation factor (0 = color1, 1 = color2)
 * @returns {string} Interpolated color in hex format
 */
function interpolateColor(color1, color2, factor)
{
    const c1 = color1.replace("#", "");
    const c2 = color2.replace("#", "");

    const r1 = parseInt(c1.substring(0, 2), 16);
    const g1 = parseInt(c1.substring(2, 4), 16);
    const b1 = parseInt(c1.substring(4, 6), 16);

    const r2 = parseInt(c2.substring(0, 2), 16);
    const g2 = parseInt(c2.substring(2, 4), 16);
    const b2 = parseInt(c2.substring(4, 6), 16);

    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Calculates the interpolated color for a time based on its position between rank thresholds
 * @param {number} seconds - The time in seconds
 * @param {Array} thresholds - Array of time thresholds for each rank
 * @returns {Object} Object with background and color properties
 */
function getInterpolatedRankStyle(seconds, thresholds)
{
    if (seconds === null) {
        return {
            background: activeGame === "hollow-knight" ? "#111824" : "#11092c",
            color: "#ffffff"
        };
    }

    const rankIndex = thresholds.findIndex(threshold => seconds <= threshold);
    const currentRankIndex = rankIndex === -1 ? ranks.length - 1 : rankIndex;

    if (currentRankIndex === 0 && seconds <= thresholds[0]) {
        return getRankStyle(0);
    }

    if (currentRankIndex === ranks.length - 1) {
        return getRankStyle(ranks.length - 1);
    }

    const currentThreshold = thresholds[currentRankIndex];
    const previousThreshold = thresholds[currentRankIndex - 1];
    const range = previousThreshold - currentThreshold;
    const position = seconds - currentThreshold;
    const rawFactor = Math.max(0, Math.min(1, position / range));
    const isAPlusBoundary = currentRankIndex === 3 && currentRankIndex - 1 === 2;
    const factor = isAPlusBoundary
        ? (rawFactor < 0.25 ? 0 : rawFactor < 0.55 ? 0.25 : 0.7)
        : rawFactor < 0.5
            ? rawFactor * 0.6
            : 0.4 + (rawFactor - 0.5) * 0.6;

    const currentStyle = getRankStyle(currentRankIndex);
    const previousStyle = getRankStyle(currentRankIndex - 1);

    const interpolatedBackground = interpolateColor(
        currentStyle.background || "#000000",
        previousStyle.background || "#000000",
        factor
    );

    const interpolatedTextColor = interpolateColor(
        currentStyle.color || "#ffffff",
        previousStyle.color || "#ffffff",
        factor
    );

    return {
        background: interpolatedBackground,
        color: interpolatedTextColor,
        ...(currentRankIndex === 1 ? { fontWeight: "900" } : {})
    };
}

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
    const wrapper = table.querySelector(`[data-time-wrapper="${input.dataset.levelIndex}"]`);
    const rankOutput = table.querySelector(`[data-rank-output="${input.dataset.levelIndex}"]`);
    const seconds = parseTime(input.value);

    if (!wrapper || !rankOutput) {
        console.error("Wrapper or rank output not found for level index:", input.dataset.levelIndex);
        return;
    }

    const style = seconds === null
        ? getPersonalRankStyle(null)
        : getInterpolatedRankStyle(seconds, level.times);

    const rankIndex = seconds === null ? null : getRankIndexForTime(seconds, level.times);

    rankOutput.textContent = rankIndex === null ? "-" : ranks[rankIndex];
    rankOutput.classList.toggle("personal-rank-empty", rankIndex === null);
    rankOutput.style.background = style.background;
    rankOutput.style.color = style.color;
    rankOutput.style.fontWeight = style.fontWeight || "";

    if (seconds !== null) {
        wrapper.style.setProperty("background", style.background, "important");
        const inputTextColor = activeGame === "hollow-knight" && rankIndex === 1
            ? "#17212b"
            : style.color;
        input.style.setProperty("color", inputTextColor, "important");
        input.style.setProperty("border-color", style.background, "important");
    } else {
        wrapper.style.removeProperty("background");
        input.style.removeProperty("color");
        input.style.removeProperty("border-color");
    }
}
