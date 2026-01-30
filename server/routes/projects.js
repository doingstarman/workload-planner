const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Project = require('../models/Project');
const Assignment = require('../models/Assignment');
const { recalcProjectHours, recalcEmployeesByIds } = require('../utils/recalculate');

const router = express.Router();

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
}

// GET /api/projects - список проектов с фильтрами
router.get(
    '/',
    [
        query('status').optional().isString(),
        query('priority').optional().isString()
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const filter = {};
            if (req.query.status) filter.status = req.query.status;
            if (req.query.priority) filter.priority = req.query.priority;

            const projects = await Project.find(filter).sort({ createdAt: -1 });
            res.json({ success: true, data: projects });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/projects/stats - статистика по проектам
router.get('/stats', async (req, res, next) => {
    try {
        const totalProjects = await Project.countDocuments();
        const byStatus = await Project.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);
        const byPriority = await Project.aggregate([
            { $group: { _id: '$priority', count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({ success: true, data: { totalProjects, byStatus, byPriority } });
    } catch (error) {
        next(error);
    }
});

// GET /api/projects/:id
router.get(
    '/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Проект не найден' });
            }
            res.json({ success: true, data: project });
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/projects
router.post(
    '/',
    [
        body('name').isString().notEmpty(),
        body('description').optional().isString(),
        body('status').optional().isIn(['planning', 'active', 'paused', 'completed']),
        body('priority').optional().isIn(['high', 'medium', 'low']),
        body('startDate').optional().isISO8601(),
        body('endDate').optional().isISO8601(),
        body('requiredHours').optional().isInt({ min: 0 })
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            if (req.body.startDate && req.body.endDate && new Date(req.body.startDate) > new Date(req.body.endDate)) {
                return res.status(400).json({ success: false, message: 'Дата начала должна быть раньше даты окончания' });
            }

            const project = await Project.create({
                name: req.body.name,
                description: req.body.description || '',
                status: req.body.status || 'planning',
                priority: req.body.priority || 'medium',
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                requiredHours: req.body.requiredHours || 0
            });

            console.log(`✅ Создан проект: ${project.name}`);
            res.status(201).json({ success: true, data: project });
        } catch (error) {
            next(error);
        }
    }
);

// PUT /api/projects/:id
router.put(
    '/:id',
    [
        param('id').isMongoId(),
        body('name').optional().isString(),
        body('description').optional().isString(),
        body('status').optional().isIn(['planning', 'active', 'paused', 'completed']),
        body('priority').optional().isIn(['high', 'medium', 'low']),
        body('startDate').optional().isISO8601(),
        body('endDate').optional().isISO8601(),
        body('requiredHours').optional().isInt({ min: 0 })
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            if (req.body.startDate && req.body.endDate && new Date(req.body.startDate) > new Date(req.body.endDate)) {
                return res.status(400).json({ success: false, message: 'Дата начала должна быть раньше даты окончания' });
            }

            const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!project) {
                return res.status(404).json({ success: false, message: 'Проект не найден' });
            }

            await recalcProjectHours(project._id);
            console.log(`✏️ Обновлён проект: ${project.name}`);
            res.json({ success: true, data: project });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE /api/projects/:id
router.delete(
    '/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const project = await Project.findById(req.params.id);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Проект не найден' });
            }

            const assignments = await Assignment.find({ project: project._id });
            const employeeIds = assignments.map(a => a.employee);

            await Assignment.deleteMany({ project: project._id });
            await Project.deleteOne({ _id: project._id });

            await recalcEmployeesByIds(employeeIds);
            console.log(`🗑️ Удалён проект: ${project.name}`);

            res.json({ success: true, message: 'Проект удалён' });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
