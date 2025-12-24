const prisma = require('../db');

/**
 * @swagger
 * /leaderboard:
 *   get:
 *     summary: Get the best completion times for each level
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: List of best times per level
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   level:
 *                     type: integer
 *                   timeInSec:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
exports.getBestTimes = async (req, res) => {
    try {
        const bestTimes = await prisma.bestTime.findMany({
            orderBy: { level: 'asc' },
            select: {
                level: true,
                timeInSec: true,
                username: true,
                updatedAt: true
            }
        });
        res.json(bestTimes);
    } catch (err) {
        console.error('Error in getBestTimes:', err);
        res.status(500).json({ error: 'Error fetching leaderboard' });
    }
};
