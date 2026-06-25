// Time parsing, formatting, and display helpers

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

    if (cleanValue.includes(":")) {
        const parts = cleanValue.split(":");
        if (parts.length !== 2) return null;

        const minutes = Number(parts[0]);
        const seconds = Number(parts[1]);

        if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) return null;
        if (minutes < 0 || seconds < 0 || seconds >= 60) return null;

        return minutes * 60 + seconds;
    }

    const seconds = Number(cleanValue);
    return Number.isFinite(seconds) && seconds >= 0 ? seconds : null;
}

/**
 * Formats a time in seconds into a human-readable string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string (e.g., "1:23.45" or "0:45.67")
 */
function formatTime(seconds)
{
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round((seconds % 60) * 100) / 100;
    const secondsStr = String(remainingSeconds);
    const parts = secondsStr.split('.');
    const paddedInteger = parts[0].padStart(2, "0");

    return parts.length > 1
        ? `${minutes}:${paddedInteger}.${parts[1]}`
        : `${minutes}:${paddedInteger}`;
}

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

/**
 * Matches column widths between the main table and totals table for visual alignment
 */
function matchColumnWidths()
{
    const tableHeaderCells = table.querySelectorAll("thead th");
    const totalsHeaderCells = totals.querySelectorAll("thead th");

    if (tableHeaderCells.length === 0 || totalsHeaderCells.length === 0) return;

    let tableIndex = 2;
    let totalsIndex = 1;

    while (tableIndex < tableHeaderCells.length && totalsIndex < totalsHeaderCells.length) {
        const width = tableHeaderCells[tableIndex].getBoundingClientRect().width;
        totalsHeaderCells[totalsIndex].style.minWidth = `${width}px`;
        totalsHeaderCells[totalsIndex].style.maxWidth = `${width}px`;
        tableIndex++;
        totalsIndex++;
    }

    const firstIslandWidth = table.querySelector(".island")?.getBoundingClientRect().width || 0;
    const firstBossWidth = table.querySelector(".boss")?.getBoundingClientRect().width || 0;
    const combinedFirstWidth = firstIslandWidth + firstBossWidth;
    totalsHeaderCells[0].style.minWidth = `${combinedFirstWidth}px`;
    totalsHeaderCells[0].style.maxWidth = `${combinedFirstWidth}px`;
}
