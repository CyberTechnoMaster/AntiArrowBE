const jwt = require('jsonwebtoken');
const prisma = require('../db');

exports.authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        // Update last activity
        await prisma.user.update({
            where: { id: verified.id },
            data: { lastActivity: new Date() }
        }).catch(err => console.error('Error updating activity:', err));

        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

exports.adminMiddleware = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.user.id } });
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
