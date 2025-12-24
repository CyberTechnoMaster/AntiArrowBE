const prisma = require('../db');

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users with their statistics (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden (Not an admin)
 *       500:
 *         description: Error fetching users
 */

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                level: true,
                experience: true,
                lastLogin: true,
                lastActivity: true,
                role: true,
                levelCompletions: {
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                }
            },
            orderBy: { lastActivity: 'desc' }
        });
        res.json(users);
    } catch (err) {
        console.error('Error in getAllUsers:', err.message, err.stack);
        res.status(500).json({ error: 'Error fetching users', details: err.message });
    }
};
