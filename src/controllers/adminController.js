const prisma = require('../db');

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
                role: true
            },
            orderBy: { lastActivity: 'desc' }
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching users' });
    }
};
