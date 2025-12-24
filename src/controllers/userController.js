const prisma = require('../db');
const levelService = require('../services/levelService');

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get current user profile and level configuration
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile and level configuration
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     levelConfig:
 *                       $ref: '#/components/schemas/LevelConfig'
 *       500:
 *         description: Error fetching profile
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, level: true, experience: true, lastLogin: true }
        });
        const levelConfig = levelService.getLevelConfig(user.level);
        res.json({ ...user, levelConfig });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

/**
 * @swagger
 * /progress:
 *   patch:
 *     summary: Update user progress and get new level configuration
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - level
 *               - experience
 *             properties:
 *               level:
 *                 type: integer
 *               experience:
 *                 type: integer
 *               timeInSec:
 *                 type: integer
 *                 description: Time taken to complete the level in seconds (Optional).
 *     responses:
 *       200:
 *         description: Progress updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 level:
 *                   type: integer
 *                 experience:
 *                   type: integer
 *                 levelConfig:
 *                   $ref: '#/components/schemas/LevelConfig'
 *       500:
 *         description: Error updating progress
 */
exports.updateProgress = async (req, res) => {
    try {
        const { level, experience, timeInSec } = req.body;

        // Update user level and experience
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { level, experience }
        });

        // If timeInSec is provided, record level completion
        if (timeInSec !== undefined) {
            await prisma.levelCompletion.create({
                data: {
                    level,
                    timeInSec,
                    userId: req.user.id
                }
            });

            // Best Times Leaderboard (Starting from Level 10)
            if (level >= 10) {
                const existingBest = await prisma.bestTime.findUnique({
                    where: { level }
                });

                if (!existingBest || timeInSec < existingBest.timeInSec) {
                    // Update or create best time record
                    const userForName = await prisma.user.findUnique({
                        where: { id: req.user.id },
                        select: { username: true }
                    });

                    await prisma.bestTime.upsert({
                        where: { level },
                        update: {
                            timeInSec,
                            username: userForName.username,
                            userId: req.user.id
                        },
                        create: {
                            level,
                            timeInSec,
                            username: userForName.username,
                            userId: req.user.id
                        }
                    });
                }
            }
        }

        const levelConfig = levelService.getLevelConfig(user.level);
        res.json({ message: 'Progress updated', level: user.level, experience: user.experience, levelConfig });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating progress' });
    }
};
