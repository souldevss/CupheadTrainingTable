// WR times fetching from alt.json and data updates

const WR_TIMES_CACHE_KEY = "cupheadWrTimesCache";
const WR_TIMES_CACHE_DURATION = 24 * 60 * 60 * 1000;

const BOSS_NAME_MAP = {
    "forestfollies": "Forest Follies",
    "therootpack": "The Root Pack",
    "ribbyandcroaks": "Ribby & Croaks",
    "goopylegrande": "Goopy Le Grande",
    "hildaberg": "Hilda Berg",
    "cagneycarnation": "Cagney Carnation",
    "baronessvonbonbon": "Baroness Von Bon Bon",
    "wallywarbles": "Wally Warbles",
    "djimmithegreat": "Djimmi The Great",
    "beppitheclown": "Beppi The Clown",
    "grimmatchstick": "Grim Matchstick",
    "rumorhoneybottoms": "Rumor Honeybottoms",
    "drkahlsrobot": "Dr. Kahl's Robot",
    "sallystageplay": "Sally Stageplay",
    "wernerwerman": "Werner Werman",
    "captainbrineybeard": "Captain Brineybeard",
    "calamaria": "Cala Maria",
    "phantomexpress": "Phantom Express",
    "kingdice": "King Dice",
    "thedevil": "The Devil",
    "glumstonethegiant": "Glumstone The Giant",
    "mortimerfreeze": "Mortimer Freeze",
    "thehowlingaces": "The Howling Aces",
    "estherwinchester": "Esther Winchester",
    "moonshinemob": "Moonshine Mob",
    "chefsaltbaker": "Chef Saltbaker",
    "mausoleum": "Mausoleum"
};

/**
 * Fetches WR times from myekul.com and updates the data structure
 * Caches results in localStorage to avoid excessive fetching
 */
async function fetchAndUpdateWrTimes()
{
    try {
        const cached = localStorage.getItem(WR_TIMES_CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < WR_TIMES_CACHE_DURATION) {
                console.log("Using cached WR times");
                updateWrTimesInData(data);
                return data;
            }
        }
    } catch (e) {
        console.error("Error reading cache:", e);
    }

    try {
        const response = await fetch("https://myekul.com/run-recap/resources/alt.json");
        if (!response.ok) {
            console.error("Failed to fetch WR times:", response.status);
            return;
        }

        const data = await response.json();

        console.log("Fetched WR data:", data);

        localStorage.setItem(WR_TIMES_CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));

        console.log("Fetched and cached WR times");
        updateWrTimesInData(data);
        return data;
    } catch (error) {
        console.error("Error fetching WR times:", error);
    }
}

/**
 * Finds the fastest WR time from a boss strategy list in alt.json
 * @param {Array} strategies - Strategy entries for a boss
 * @returns {number|null} Best time in seconds, or null if none found
 */
function getBestWrTimeFromStrategies(strategies)
{
    let bestTime = null;

    for (const strategy of strategies) {
        if (!strategy.time || strategy.title) continue;

        const time = parseTime(String(strategy.time));
        if (time !== null && (bestTime === null || time < bestTime)) {
            bestTime = time;
        }
    }

    return bestTime;
}

/**
 * Updates the data structure with fetched WR times
 * @param {Object} wrData - The fetched alt.json data
 */
function updateWrTimesInData(wrData)
{
    if (wrData["1.1+"]) {
        updateCategoryTimes("1-1", wrData["1.1+"], BOSS_NAME_MAP);
    }

    if (wrData["DLC L/S"]) {
        updateCategoryTimes("DLC", wrData["DLC L/S"], BOSS_NAME_MAP, "lobber");
    }

    if (wrData["DLC C/S"]) {
        updateCategoryTimes("DLC", wrData["DLC C/S"], BOSS_NAME_MAP, "charge");
    }
}

/**
 * Updates times for a specific category
 * @param {string} categoryId - The category ID to update
 * @param {Object} categoryData - The WR data for this category
 * @param {Object} bossNameMap - Mapping of JSON boss names to data.js names
 * @param {string|null} subOptionId - Optional DLC sub-option id (lobber/charge)
 */
function updateCategoryTimes(categoryId, categoryData, bossNameMap, subOptionId = null)
{
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const targets = [];

    if (subOptionId && category.subOptions) {
        const subOption = category.subOptions.find(sub => sub.id === subOptionId);
        if (subOption?.islands) {
            targets.push(subOption);
        }
    } else if (category.islands) {
        targets.push(category);
    }

    targets.forEach(target => {
        let oldWrSum = 0;
        let newWrSum = 0;
        let updatedLevelCount = 0;

        target.islands.forEach(island => {
            island.levels.forEach(level => {
                const jsonBossKey = Object.keys(bossNameMap).find(key =>
                    bossNameMap[key].toLowerCase() === level.name.toLowerCase()
                );

                if (!jsonBossKey || !categoryData[jsonBossKey]) return;

                const wrTime = getBestWrTimeFromStrategies(categoryData[jsonBossKey]);
                if (wrTime === null || !level.times || level.times.length === 0) return;

                const oldWr = level.times[0];
                const ratio = wrTime / oldWr;

                level.times = level.times.map(time => Math.round(time * ratio * 100) / 100);
                oldWrSum += oldWr;
                newWrSum += wrTime;
                updatedLevelCount++;
            });
        });

        if (updatedLevelCount > 0 && oldWrSum > 0) {
            const totalRatio = newWrSum / oldWrSum;

            if (target.residual?.length) {
                target.residual = target.residual.map(time =>
                    Math.round(time * totalRatio * 100) / 100
                );
            }

            if (target.sob?.length) {
                target.sob = target.sob.map(time =>
                    Math.round(time * totalRatio * 100) / 100
                );
            }
        }
    });
}
