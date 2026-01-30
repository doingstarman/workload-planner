const fs = require('fs');
const path = require('path');
const vm = require('vm');
require('dotenv').config();

const connectDB = require('./config/db');
const Employee = require('./models/Employee');
const Project = require('./models/Project');
const Assignment = require('./models/Assignment');
const { recalcEmployeesByIds, recalcProjectsByIds } = require('./utils/recalculate');

// Загрузка демо‑данных из client/data.js
function loadClientData() {
    const dataPath = path.join(__dirname, '..', 'client', 'data.js');
    const source = fs.readFileSync(dataPath, 'utf-8');

    const context = {};
    vm.createContext(context);
    vm.runInContext(
        `${source}\n;globalThis.__seed = { departments, teams, roles, initialEmployees, initialProjects, initialAssignments };`,
        context
    );

    return context.__seed;
}

async function seed() {
    await connectDB();

    const { departments, teams, roles, initialEmployees, initialProjects, initialAssignments } = loadClientData();

    const departmentMap = Object.fromEntries(departments.map(d => [d.id, d.name]));
    const teamMap = Object.fromEntries(teams.map(t => [t.id, t.name]));
    const roleMap = Object.fromEntries(roles.map(r => [r.id, r.name]));

    await Assignment.deleteMany();
    await Employee.deleteMany();
    await Project.deleteMany();

    const employeesData = initialEmployees.map(e => ({
        name: e.name,
        department: departmentMap[e.departmentId],
        team: teamMap[e.teamId],
        role: roleMap[e.role],
        maxWeeklyHours: e.maxHours || 40
    }));

    const projectStatusMap = {
        'planning': 'planning',
        'active': 'active',
        'on-hold': 'paused',
        'completed': 'completed'
    };

    const projectsData = initialProjects.map(p => ({
        name: p.name,
        description: p.description || '',
        status: projectStatusMap[p.status] || 'planning',
        priority: p.priority,
        startDate: p.startDate,
        endDate: p.endDate,
        requiredHours: p.requiredHours || 0
    }));

    const createdEmployees = await Employee.insertMany(employeesData);
    const createdProjects = await Project.insertMany(projectsData);

    const employeeIdMap = {};
    createdEmployees.forEach((emp, idx) => {
        employeeIdMap[initialEmployees[idx].id] = emp._id;
    });

    const projectIdMap = {};
    createdProjects.forEach((proj, idx) => {
        projectIdMap[initialProjects[idx].id] = proj._id;
    });

    const assignmentsData = initialAssignments.map(a => ({
        employee: employeeIdMap[a.employeeId],
        project: projectIdMap[a.projectId],
        hoursPerWeek: a.hoursPerWeek,
        startDate: a.startDate,
        endDate: a.endDate || null
    })).filter(a => a.employee && a.project);

    await Assignment.insertMany(assignmentsData);
    await recalcEmployeesByIds(createdEmployees.map(e => e._id));
    await recalcProjectsByIds(createdProjects.map(p => p._id));

    console.log('✅ Демо‑данные успешно загружены');
    process.exit(0);
}

seed().catch(error => {
    console.error('❌ Ошибка при сидировании:', error);
    process.exit(1);
});
