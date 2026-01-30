const Assignment = require('../models/Assignment');
const Employee = require('../models/Employee');
const Project = require('../models/Project');

// Пересчёт текущей загрузки сотрудника
async function recalcEmployeeLoad(employeeId) {
    const employee = await Employee.findById(employeeId);
    if (!employee) return null;

    const result = await Assignment.aggregate([
        { $match: { employee: employee._id } },
        { $group: { _id: '$employee', total: { $sum: '$hoursPerWeek' } } }
    ]);

    const totalHours = result[0]?.total || 0;
    const maxHours = employee.maxWeeklyHours || 40;
    const currentLoad = maxHours > 0 ? Math.round((totalHours / maxHours) * 100) : 0;

    employee.currentLoad = currentLoad;
    await employee.save();

    return currentLoad;
}

// Пересчёт текущих часов по проекту
async function recalcProjectHours(projectId) {
    const project = await Project.findById(projectId);
    if (!project) return null;

    const result = await Assignment.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: '$project', total: { $sum: '$hoursPerWeek' } } }
    ]);

    const totalHours = result[0]?.total || 0;
    project.currentHours = totalHours;
    await project.save();

    return totalHours;
}

async function recalcEmployeesByIds(ids = []) {
    const uniqueIds = [...new Set(ids.map(id => id.toString()))];
    for (const id of uniqueIds) {
        await recalcEmployeeLoad(id);
    }
}

async function recalcProjectsByIds(ids = []) {
    const uniqueIds = [...new Set(ids.map(id => id.toString()))];
    for (const id of uniqueIds) {
        await recalcProjectHours(id);
    }
}

module.exports = {
    recalcEmployeeLoad,
    recalcProjectHours,
    recalcEmployeesByIds,
    recalcProjectsByIds
};
