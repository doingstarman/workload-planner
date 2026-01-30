const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const Assignment = require('../models/Assignment');
const { recalcEmployeeLoad, recalcProjectsByIds } = require('../utils/recalculate');

const router = express.Router();

// Обработчик ошибок валидации
function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
}

// GET /api/employees - список сотрудников с фильтрами
router.get(
    '/',
    [
        query('department').optional().isString(),
        query('team').optional().isString(),
        query('role').optional().isString()
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const filter = {};
            if (req.query.department) filter.department = req.query.department;
            if (req.query.team) filter.team = req.query.team;
            if (req.query.role) filter.role = req.query.role;

            const employees = await Employee.find(filter).sort({ createdAt: -1 });
            res.json({ success: true, data: employees });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/employees/stats - статистика по сотрудникам
router.get('/stats', async (req, res, next) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const overloaded = await Employee.countDocuments({ currentLoad: { $gt: 100 } });
        const avgLoadAgg = await Employee.aggregate([
            { $group: { _id: null, avgLoad: { $avg: '$currentLoad' } } }
        ]);

        const byDepartment = await Employee.aggregate([
            { $group: { _id: '$department', count: { $sum: 1 }, avgLoad: { $avg: '$currentLoad' } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalEmployees,
                overloaded,
                avgLoad: Math.round(avgLoadAgg[0]?.avgLoad || 0),
                byDepartment
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/employees/:id
router.get(
    '/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
            }
            res.json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/employees
router.post(
    '/',
    [
        body('name').isString().notEmpty(),
        body('department').isString().notEmpty(),
        body('team').isString().notEmpty(),
        body('role').isString().notEmpty(),
        body('maxWeeklyHours').optional().isInt({ min: 1, max: 80 })
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const employee = await Employee.create({
                name: req.body.name,
                department: req.body.department,
                team: req.body.team,
                role: req.body.role,
                maxWeeklyHours: req.body.maxWeeklyHours || 40
            });

            console.log(`✅ Создан сотрудник: ${employee.name}`);
            res.status(201).json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    }
);

// PUT /api/employees/:id
router.put(
    '/:id',
    [
        param('id').isMongoId(),
        body('name').optional().isString(),
        body('department').optional().isString(),
        body('team').optional().isString(),
        body('role').optional().isString(),
        body('maxWeeklyHours').optional().isInt({ min: 1, max: 80 })
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
            }

            await recalcEmployeeLoad(employee._id);
            console.log(`✏️ Обновлён сотрудник: ${employee.name}`);

            res.json({ success: true, data: employee });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE /api/employees/:id
router.delete(
    '/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const employee = await Employee.findById(req.params.id);
            if (!employee) {
                return res.status(404).json({ success: false, message: 'Сотрудник не найден' });
            }

            const assignments = await Assignment.find({ employee: employee._id });
            const projectIds = assignments.map(a => a.project);

            await Assignment.deleteMany({ employee: employee._id });
            await Employee.deleteOne({ _id: employee._id });

            await recalcProjectsByIds(projectIds);
            console.log(`🗑️ Удалён сотрудник: ${employee.name}`);

            res.json({ success: true, message: 'Сотрудник удалён' });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
