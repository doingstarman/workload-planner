const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Assignment = require('../models/Assignment');
const Employee = require('../models/Employee');
const Project = require('../models/Project');
const { recalcEmployeeLoad, recalcProjectHours } = require('../utils/recalculate');

const router = express.Router();

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
}

async function getEmployeeAssignedHours(employeeId, excludeAssignmentId = null) {
    const match = { employee: employeeId };
    if (excludeAssignmentId) {
        match._id = { $ne: excludeAssignmentId };
    }

    const result = await Assignment.aggregate([
        { $match: match },
        { $group: { _id: '$employee', total: { $sum: '$hoursPerWeek' } } }
    ]);

    return result[0]?.total || 0;
}

function buildDateFilter(startDate, endDate) {
    const filter = {};
    if (startDate) {
        filter.$or = [{ endDate: { $gte: startDate } }, { endDate: null }];
    }
    if (endDate) {
        filter.startDate = { $lte: endDate };
    }
    return filter;
}

// GET /api/assignments
router.get(
    '/',
    [
        query('employee').optional().isMongoId(),
        query('project').optional().isMongoId(),
        query('startDate').optional().isISO8601(),
        query('endDate').optional().isISO8601()
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const filter = {};
            if (req.query.employee) filter.employee = req.query.employee;
            if (req.query.project) filter.project = req.query.project;

            const dateFilter = buildDateFilter(
                req.query.startDate ? new Date(req.query.startDate) : null,
                req.query.endDate ? new Date(req.query.endDate) : null
            );

            const assignments = await Assignment.find({ ...filter, ...dateFilter })
                .populate('employee')
                .populate('project')
                .sort({ startDate: 1 });

            res.json({ success: true, data: assignments });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/assignments/employee/:id
router.get(
    '/employee/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const assignments = await Assignment.find({ employee: req.params.id })
                .populate('employee')
                .populate('project')
                .sort({ startDate: 1 });

            res.json({ success: true, data: assignments });
        } catch (error) {
            next(error);
        }
    }
);

// GET /api/assignments/project/:id
router.get(
    '/project/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const assignments = await Assignment.find({ project: req.params.id })
                .populate('employee')
                .populate('project')
                .sort({ startDate: 1 });

            res.json({ success: true, data: assignments });
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/assignments
router.post(
    '/',
    [
        body('employee').isMongoId(),
        body('project').isMongoId(),
        body('hoursPerWeek').isInt({ min: 1, max: 80 }),
        body('startDate').isISO8601(),
        body('endDate').optional().isISO8601()
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const employee = await Employee.findById(req.body.employee);
            const project = await Project.findById(req.body.project);

            if (!employee || !project) {
                return res.status(404).json({ success: false, message: 'Сотрудник или проект не найден' });
            }

            if (req.body.endDate && new Date(req.body.startDate) > new Date(req.body.endDate)) {
                return res.status(400).json({ success: false, message: 'Дата начала должна быть раньше даты окончания' });
            }

            const assignedHours = await getEmployeeAssignedHours(employee._id);
            const newTotal = assignedHours + req.body.hoursPerWeek;

            if (newTotal > employee.maxWeeklyHours) {
                return res.status(400).json({
                    success: false,
                    message: 'Перегрузка сотрудника (>100%)'
                });
            }

            const assignment = await Assignment.create({
                employee: employee._id,
                project: project._id,
                hoursPerWeek: req.body.hoursPerWeek,
                startDate: req.body.startDate,
                endDate: req.body.endDate || null
            });

            await recalcEmployeeLoad(employee._id);
            await recalcProjectHours(project._id);

            console.log(`✅ Назначение создано: ${employee.name} -> ${project.name}`);
            res.status(201).json({ success: true, data: assignment });
        } catch (error) {
            next(error);
        }
    }
);

// PUT /api/assignments/:id
router.put(
    '/:id',
    [
        param('id').isMongoId(),
        body('employee').optional().isMongoId(),
        body('project').optional().isMongoId(),
        body('hoursPerWeek').optional().isInt({ min: 1, max: 80 }),
        body('startDate').optional().isISO8601(),
        body('endDate').optional().isISO8601()
    ],
    handleValidation,
    async (req, res, next) => {
        try {
            const assignment = await Assignment.findById(req.params.id);
            if (!assignment) {
                return res.status(404).json({ success: false, message: 'Назначение не найдено' });
            }

            const employeeId = req.body.employee || assignment.employee;
            const projectId = req.body.project || assignment.project;

            const employee = await Employee.findById(employeeId);
            const project = await Project.findById(projectId);

            if (!employee || !project) {
                return res.status(404).json({ success: false, message: 'Сотрудник или проект не найден' });
            }

            const startDate = req.body.startDate || assignment.startDate;
            const endDate = req.body.endDate || assignment.endDate;
            if (endDate && new Date(startDate) > new Date(endDate)) {
                return res.status(400).json({ success: false, message: 'Дата начала должна быть раньше даты окончания' });
            }

            const assignedHours = await getEmployeeAssignedHours(employee._id, assignment._id);
            const updatedHours = req.body.hoursPerWeek ?? assignment.hoursPerWeek;
            const newTotal = assignedHours + updatedHours;

            if (newTotal > employee.maxWeeklyHours) {
                return res.status(400).json({
                    success: false,
                    message: 'Перегрузка сотрудника (>100%)'
                });
            }

            const previousEmployee = assignment.employee;
            const previousProject = assignment.project;

            assignment.employee = employee._id;
            assignment.project = project._id;
            assignment.hoursPerWeek = updatedHours;
            assignment.startDate = startDate;
            assignment.endDate = endDate;
            await assignment.save();

            await recalcEmployeeLoad(employee._id);
            await recalcProjectHours(project._id);

            if (previousEmployee.toString() !== employee._id.toString()) {
                await recalcEmployeeLoad(previousEmployee);
            }
            if (previousProject.toString() !== project._id.toString()) {
                await recalcProjectHours(previousProject);
            }

            console.log(`✏️ Назначение обновлено: ${employee.name} -> ${project.name}`);
            res.json({ success: true, data: assignment });
        } catch (error) {
            next(error);
        }
    }
);

// DELETE /api/assignments/:id
router.delete(
    '/:id',
    [param('id').isMongoId()],
    handleValidation,
    async (req, res, next) => {
        try {
            const assignment = await Assignment.findById(req.params.id);
            if (!assignment) {
                return res.status(404).json({ success: false, message: 'Назначение не найдено' });
            }

            const employeeId = assignment.employee;
            const projectId = assignment.project;

            await Assignment.deleteOne({ _id: assignment._id });

            await recalcEmployeeLoad(employeeId);
            await recalcProjectHours(projectId);

            console.log('🗑️ Назначение удалено');
            res.json({ success: true, message: 'Назначение удалено' });
        } catch (error) {
            next(error);
        }
    }
);

// POST /api/assignments/suggest
router.post(
    '/suggest',
    [body('projectId').isMongoId(), body('requiredHours').isInt({ min: 1 })],
    handleValidation,
    async (req, res, next) => {
        try {
            const project = await Project.findById(req.body.projectId);
            if (!project) {
                return res.status(404).json({ success: false, message: 'Проект не найден' });
            }

            const employees = await Employee.find().sort({ currentLoad: 1 });
            const suggestions = [];
            let remaining = req.body.requiredHours;

            for (const employee of employees) {
                if (remaining <= 0) break;
                const assignedHours = await getEmployeeAssignedHours(employee._id);
                const availableHours = Math.max(0, (employee.maxWeeklyHours || 40) - assignedHours);
                if (availableHours <= 0) continue;

                const suggestedHours = Math.min(availableHours, remaining, 40);
                suggestions.push({
                    employee,
                    suggestedHours,
                    availableHours
                });
                remaining -= suggestedHours;
            }

            res.json({ success: true, data: { project, suggestions, remainingHours: remaining } });
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;
