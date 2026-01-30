require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const connectDB = require('./config/db');
const requestLogger = require('./middleware/logger');
const requireAuth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const employeesRoutes = require('./routes/employees');
const projectsRoutes = require('./routes/projects');
const assignmentsRoutes = require('./routes/assignments');

const Employee = require('./models/Employee');
const Project = require('./models/Project');

const app = express();

if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET не задан в переменных окружения');
    process.exit(1);
}

// Базовые middleware
app.use(express.json({ limit: '1mb' }));
app.use(requestLogger);

// CORS для продакшена и разработки
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigin = process.env.CLIENT_URL;
app.use(
    cors({
        origin: (origin, callback) => {
            if (!isProd) return callback(null, true);
            if (!origin) return callback(null, true);
            if (origin === allowedOrigin) return callback(null, true);
            return callback(new Error('CORS: origin запрещён'));
        },
        credentials: true
    })
);

// Health-check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Статика клиентского приложения
app.use(express.static(path.join(__dirname, '..', 'client')));

// Аутентификация
app.use('/api/auth', authRoutes);

// Защищённые API роуты
app.use('/api/employees', requireAuth, employeesRoutes);
app.use('/api/projects', requireAuth, projectsRoutes);
app.use('/api/assignments', requireAuth, assignmentsRoutes);

// Статистика дашборда
app.get('/api/stats/dashboard', requireAuth, async (req, res, next) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'active' });
        const avgLoadAgg = await Employee.aggregate([
            { $group: { _id: null, avgLoad: { $avg: '$currentLoad' } } }
        ]);
        const overloaded = await Employee.countDocuments({ currentLoad: { $gt: 100 } });

        res.json({
            success: true,
            data: {
                totalEmployees,
                activeProjects,
                avgWorkload: Math.round(avgLoadAgg[0]?.avgLoad || 0),
                overloaded
            }
        });
    } catch (error) {
        next(error);
    }
});

// SPA fallback
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'index.html'));
});

// Обработчик ошибок
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
    });
});
