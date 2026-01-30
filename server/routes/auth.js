const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
}

// POST /api/auth/login - получение JWT
router.post(
    '/login',
    [body('username').isString().notEmpty(), body('password').isString().notEmpty()],
    handleValidation,
    async (req, res) => {
        const adminUser = process.env.ADMIN_USER || 'admin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

        if (req.body.username !== adminUser || req.body.password !== adminPassword) {
            return res.status(401).json({ success: false, message: 'Неверные учетные данные' });
        }

        const token = jwt.sign(
            { username: req.body.username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ success: true, token });
    }
);

module.exports = router;
