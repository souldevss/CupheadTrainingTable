// Active category data accessors and totals calculations

/**
 * Gets the active category context for the current category and sub-option
 * @returns {Object} The current category data container
 */
function getActiveCategoryContext()
{
    if (!activeCategory) {
        return { data: null };
    }

    if (activeCategory.id === "DLC" && activeCategory.subOptions) {
        const subOption = activeCategory.subOptions.find(sub => sub.id === activeSubOption);
        return { data: subOption || activeCategory };
    }

    return { data: activeCategory };
}

/**
 * Gets the active islands data based on current category and sub-option
 * @returns {Array} Array of island objects with level data
 */
function getActiveIslands()
{
    const { data } = getActiveCategoryContext();
    return data?.islands || [];
}

/**
 * Gets the active residual times based on current category and sub-option
 * @returns {Array} Array of residual time values for each rank
 */
function getActiveResidual()
{
    const { data } = getActiveCategoryContext();
    return data?.residual || [];
}

/**
 * Gets the active sob (sum of best) times based on current category and sub-option
 * @returns {Array|null} Array of sob time values for each rank, or null if not predefined
 */
function getActiveSob()
{
    const { data } = getActiveCategoryContext();
    return data?.sob || null;
}

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
 * Gets a level object by its flat index across all islands
 * @param {number} targetIndex - The flat index to search for
 * @returns {Object} The level object at the specified index
 */
function getLevelByFlatIndex(targetIndex)
{
    let currentIndex = 0;

    for (const island of getActiveIslands()) {
        for (const level of island.levels) {
            if (currentIndex === targetIndex) return level;
            currentIndex++;
        }
    }

    return getActiveIslands()[0].levels[0];
}

/**
 * Gets the total number of levels across all active islands
 * @returns {number} Total level count
 */
function getTotalLevelCount()
{
    return getActiveIslands().reduce((sum, island) => sum + island.levels.length, 0);
}
