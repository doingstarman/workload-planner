// Централизованный обработчик ошибок
function errorHandler(err, req, res, next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Внутренняя ошибка сервера';

    if (process.env.NODE_ENV !== 'test') {
        console.error('Ошибка:', err);
    }

    res.status(statusCode).json({
        success: false,
        message
    });
}

module.exports = errorHandler;
