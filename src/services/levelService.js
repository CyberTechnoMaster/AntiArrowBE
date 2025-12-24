/**
 * Level Service
 * Handles difficulty scaling, boss levels, and grid sizing.
 */

const BASE_GRID_SIZE = 3;

/**
 * Calculates level configuration based on the player's level.
 * @param {number} level - The current player level.
 * @returns {object} - Configuration including gridSize, isBossLevel, and timeLimit.
 */
exports.getLevelConfig = (level) => {
    if (!level || level < 1) level = 1;

    // Boss levels happen every 20 levels.
    const isBossLevel = level % 20 === 0;

    // Reset difficulty after each boss level.
    // Tier is 0 for levels 1-20, 1 for levels 21-40, etc.
    const tier = Math.floor((level - 1) / 20);
    const levelInTier = ((level - 1) % 20) + 1;

    // Every second level up increases the size of the grid by one.
    // Level 1-2: gridSize = 3
    // Level 3-4: gridSize = 4
    // Level 5-6: gridSize = 5
    // Level 19-20: gridSize = 12
    const gridSize = BASE_GRID_SIZE + Math.floor((levelInTier - 1) / 2);

    // Boss levels have a time limit based on the size of the grid.
    let timeLimit = null;
    if (isBossLevel) {
        timeLimit = gridSize * 5;
    }

    const config = {
        level,
        tier,
        levelInTier,
        gridSize,
        isBossLevel,
        timeLimit
    };

    console.log(`[LevelService] Level: ${level}, GridSize: ${gridSize}, Boss: ${isBossLevel}`);
    return config;
};
