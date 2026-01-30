const jwt = require('jsonwebtoken');

// Проверка JWT токена
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Требуется авторизация' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Неверный или истёкший токен' });
    }
}

module.exports = requireAuth;
