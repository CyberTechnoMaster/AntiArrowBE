const prisma = require('../db');

exports.getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, level: true, experience: true, lastLogin: true }
        });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

exports.updateProgress = async (req, res) => {
    try {
        const { level, experience } = req.body;
        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: { level, experience }
        });
        res.json({ message: 'Progress updated', level: user.level, experience: user.experience });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error updating progress' });
    }
};
