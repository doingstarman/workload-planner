// Data Models and Test Data for Workload Planning System

// Departments
const departments = [
    { id: 'desktop', name: 'Десктоп', color: '#4f46e5' },
    { id: 'rnd', name: 'R&D', color: '#7c3aed' },
    { id: 'mobile', name: 'Мобайл', color: '#06b6d4' },
    { id: 'qa', name: 'Тестирование', color: '#10b981' }
];

// Teams
const teams = [
    { id: 'desktop-core', name: 'Core Team', departmentId: 'desktop' },
    { id: 'desktop-ui', name: 'UI Team', departmentId: 'desktop' },
    { id: 'rnd-ml', name: 'ML Research', departmentId: 'rnd' },
    { id: 'rnd-platform', name: 'Platform Team', departmentId: 'rnd' },
    { id: 'mobile-ios', name: 'iOS Team', departmentId: 'mobile' },
    { id: 'mobile-android', name: 'Android Team', departmentId: 'mobile' },
    { id: 'qa-auto', name: 'Автоматизация', departmentId: 'qa' },
    { id: 'qa-manual', name: 'Ручное тестирование', departmentId: 'qa' }
];

// Roles
const roles = [
    { id: 'developer', name: 'Разработчик', color: '#3b82f6' },
    { id: 'senior-developer', name: 'Старший разработчик', color: '#6366f1' },
    { id: 'team-lead', name: 'Тимлид', color: '#8b5cf6' },
    { id: 'product-manager', name: 'Продакт-менеджер', color: '#ec4899' },
    { id: 'system-analyst', name: 'Системный аналитик', color: '#f59e0b' },
    { id: 'qa-engineer', name: 'QA инженер', color: '#10b981' },
    { id: 'devops', name: 'DevOps инженер', color: '#14b8a6' }
];

// Организационная структура для Jira
const orgDepartments = [
    { id: 'dev', name: 'Разработка', color: '#4f46e5' },
    { id: 'analytics', name: 'Аналитика', color: '#10b981' },
    { id: 'product', name: 'Продукт', color: '#f59e0b' },
    { id: 'qa', name: 'Тестирование', color: '#ef4444' }
];

const orgTeams = [
    { id: 'dev-team-1', name: 'Команда разработки 1', departmentId: 'dev' },
    { id: 'dev-team-2', name: 'Команда разработки 2', departmentId: 'dev' },
    { id: 'dev-team-3', name: 'Команда разработки 3', departmentId: 'dev' },
    { id: 'dev-team-4', name: 'Команда разработки 4', departmentId: 'dev' },
    { id: 'dev-team-5', name: 'Команда разработки 5', departmentId: 'dev' },
    { id: 'dev-team-6', name: 'Команда разработки 6', departmentId: 'dev' },
    { id: 'dev-team-7', name: 'Команда разработки 7', departmentId: 'dev' }
];

// Test Employees
const initialEmployees = [
    // Desktop Department
    { id: 1, name: 'Александр Петров', departmentId: 'desktop', teamId: 'desktop-core', role: 'team-lead', maxHours: 40 },
    { id: 2, name: 'Мария Иванова', departmentId: 'desktop', teamId: 'desktop-core', role: 'senior-developer', maxHours: 40 },
    { id: 3, name: 'Дмитрий Сидоров', departmentId: 'desktop', teamId: 'desktop-core', role: 'developer', maxHours: 40 },
    { id: 4, name: 'Елена Козлова', departmentId: 'desktop', teamId: 'desktop-ui', role: 'developer', maxHours: 40 },
    { id: 5, name: 'Андрей Новиков', departmentId: 'desktop', teamId: 'desktop-ui', role: 'senior-developer', maxHours: 40 },
    { id: 6, name: 'Ольга Морозова', departmentId: 'desktop', teamId: 'desktop-core', role: 'system-analyst', maxHours: 40 },
    
    // R&D Department
    { id: 7, name: 'Сергей Волков', departmentId: 'rnd', teamId: 'rnd-ml', role: 'team-lead', maxHours: 40 },
    { id: 8, name: 'Анна Федорова', departmentId: 'rnd', teamId: 'rnd-ml', role: 'senior-developer', maxHours: 40 },
    { id: 9, name: 'Игорь Соколов', departmentId: 'rnd', teamId: 'rnd-ml', role: 'developer', maxHours: 40 },
    { id: 10, name: 'Наталья Попова', departmentId: 'rnd', teamId: 'rnd-platform', role: 'senior-developer', maxHours: 40 },
    { id: 11, name: 'Павел Лебедев', departmentId: 'rnd', teamId: 'rnd-platform', role: 'developer', maxHours: 40 },
    { id: 12, name: 'Татьяна Кузнецова', departmentId: 'rnd', teamId: 'rnd-ml', role: 'product-manager', maxHours: 40 },
    
    // Mobile Department
    { id: 13, name: 'Виктор Смирнов', departmentId: 'mobile', teamId: 'mobile-ios', role: 'team-lead', maxHours: 40 },
    { id: 14, name: 'Екатерина Васильева', departmentId: 'mobile', teamId: 'mobile-ios', role: 'senior-developer', maxHours: 40 },
    { id: 15, name: 'Михаил Николаев', departmentId: 'mobile', teamId: 'mobile-ios', role: 'developer', maxHours: 40 },
    { id: 16, name: 'Юлия Павлова', departmentId: 'mobile', teamId: 'mobile-android', role: 'senior-developer', maxHours: 40 },
    { id: 17, name: 'Роман Егоров', departmentId: 'mobile', teamId: 'mobile-android', role: 'developer', maxHours: 40 },
    { id: 18, name: 'Светлана Орлова', departmentId: 'mobile', teamId: 'mobile-ios', role: 'system-analyst', maxHours: 40 },
    { id: 19, name: 'Артём Киселёв', departmentId: 'mobile', teamId: 'mobile-android', role: 'developer', maxHours: 40 },
    
    // QA Department
    { id: 20, name: 'Алексей Макаров', departmentId: 'qa', teamId: 'qa-auto', role: 'team-lead', maxHours: 40 },
    { id: 21, name: 'Ирина Зайцева', departmentId: 'qa', teamId: 'qa-auto', role: 'qa-engineer', maxHours: 40 },
    { id: 22, name: 'Денис Белов', departmentId: 'qa', teamId: 'qa-auto', role: 'qa-engineer', maxHours: 40 },
    { id: 23, name: 'Анастасия Комарова', departmentId: 'qa', teamId: 'qa-manual', role: 'qa-engineer', maxHours: 40 },
    { id: 24, name: 'Владимир Тихонов', departmentId: 'qa', teamId: 'qa-manual', role: 'qa-engineer', maxHours: 40 },
    
    // Cross-functional roles
    { id: 25, name: 'Константин Громов', departmentId: 'desktop', teamId: 'desktop-core', role: 'product-manager', maxHours: 40 },
    { id: 26, name: 'Валерия Соловьёва', departmentId: 'mobile', teamId: 'mobile-ios', role: 'product-manager', maxHours: 40 },
    { id: 27, name: 'Николай Воробьёв', departmentId: 'rnd', teamId: 'rnd-platform', role: 'devops', maxHours: 40 },
    { id: 28, name: 'Кристина Медведева', departmentId: 'qa', teamId: 'qa-auto', role: 'system-analyst', maxHours: 40 }
];

// Test Projects
const initialProjects = [
    {
        id: 1,
        name: 'CRM System 2.0',
        description: 'Обновление корпоративной CRM системы с новым интерфейсом и интеграциями',
        status: 'active',
        priority: 'high',
        startDate: '2026-01-15',
        endDate: '2026-06-30',
        requiredHours: 2000
    },
    {
        id: 2,
        name: 'Mobile Banking App',
        description: 'Разработка мобильного приложения для банковских операций',
        status: 'active',
        priority: 'high',
        startDate: '2026-01-01',
        endDate: '2026-08-31',
        requiredHours: 3500
    },
    {
        id: 3,
        name: 'AI Assistant',
        description: 'Исследование и разработка AI-ассистента для поддержки клиентов',
        status: 'active',
        priority: 'medium',
        startDate: '2026-02-01',
        endDate: '2026-12-31',
        requiredHours: 4000
    },
    {
        id: 4,
        name: 'Desktop Analytics Tool',
        description: 'Инструмент аналитики для десктопных приложений',
        status: 'planning',
        priority: 'medium',
        startDate: '2026-03-01',
        endDate: '2026-09-30',
        requiredHours: 1500
    },
    {
        id: 5,
        name: 'API Gateway',
        description: 'Централизованный API шлюз для микросервисной архитектуры',
        status: 'active',
        priority: 'high',
        startDate: '2026-01-10',
        endDate: '2026-04-30',
        requiredHours: 800
    },
    {
        id: 6,
        name: 'E-commerce Platform',
        description: 'Платформа электронной коммерции с интеграцией платежей',
        status: 'active',
        priority: 'medium',
        startDate: '2026-01-20',
        endDate: '2026-07-31',
        requiredHours: 2500
    },
    {
        id: 7,
        name: 'Internal Dashboard',
        description: 'Внутренняя панель мониторинга для отслеживания KPI',
        status: 'on-hold',
        priority: 'low',
        startDate: '2026-02-15',
        endDate: '2026-05-31',
        requiredHours: 600
    },
    {
        id: 8,
        name: 'Security Audit System',
        description: 'Система аудита безопасности и мониторинга уязвимостей',
        status: 'planning',
        priority: 'high',
        startDate: '2026-04-01',
        endDate: '2026-10-31',
        requiredHours: 1800
    },
    {
        id: 9,
        name: 'Legacy Migration',
        description: 'Миграция устаревших систем на современный стек',
        status: 'active',
        priority: 'medium',
        startDate: '2025-11-01',
        endDate: '2026-05-31',
        requiredHours: 2200
    },
    {
        id: 10,
        name: 'Testing Framework',
        description: 'Разработка внутреннего фреймворка для автоматизированного тестирования',
        status: 'active',
        priority: 'medium',
        startDate: '2026-01-05',
        endDate: '2026-04-15',
        requiredHours: 700
    }
];

// Test Assignments (employee to project)
const initialAssignments = [
    // CRM System 2.0
    { id: 1, employeeId: 1, projectId: 1, hoursPerWeek: 20, startDate: '2026-01-15', endDate: '2026-06-30', role: 'Tech Lead' },
    { id: 2, employeeId: 2, projectId: 1, hoursPerWeek: 32, startDate: '2026-01-15', endDate: '2026-06-30', role: 'Backend Developer' },
    { id: 3, employeeId: 3, projectId: 1, hoursPerWeek: 40, startDate: '2026-01-15', endDate: '2026-06-30', role: 'Backend Developer' },
    { id: 4, employeeId: 4, projectId: 1, hoursPerWeek: 24, startDate: '2026-01-15', endDate: '2026-06-30', role: 'Frontend Developer' },
    { id: 5, employeeId: 6, projectId: 1, hoursPerWeek: 16, startDate: '2026-01-15', endDate: '2026-03-31', role: 'System Analyst' },
    { id: 6, employeeId: 25, projectId: 1, hoursPerWeek: 20, startDate: '2026-01-15', endDate: '2026-06-30', role: 'Product Manager' },
    
    // Mobile Banking App
    { id: 7, employeeId: 13, projectId: 2, hoursPerWeek: 24, startDate: '2026-01-01', endDate: '2026-08-31', role: 'iOS Lead' },
    { id: 8, employeeId: 14, projectId: 2, hoursPerWeek: 40, startDate: '2026-01-01', endDate: '2026-08-31', role: 'iOS Developer' },
    { id: 9, employeeId: 15, projectId: 2, hoursPerWeek: 40, startDate: '2026-01-01', endDate: '2026-08-31', role: 'iOS Developer' },
    { id: 10, employeeId: 16, projectId: 2, hoursPerWeek: 40, startDate: '2026-01-01', endDate: '2026-08-31', role: 'Android Developer' },
    { id: 11, employeeId: 17, projectId: 2, hoursPerWeek: 40, startDate: '2026-01-01', endDate: '2026-08-31', role: 'Android Developer' },
    { id: 12, employeeId: 18, projectId: 2, hoursPerWeek: 24, startDate: '2026-01-01', endDate: '2026-04-30', role: 'System Analyst' },
    { id: 13, employeeId: 26, projectId: 2, hoursPerWeek: 32, startDate: '2026-01-01', endDate: '2026-08-31', role: 'Product Manager' },
    { id: 14, employeeId: 23, projectId: 2, hoursPerWeek: 24, startDate: '2026-02-01', endDate: '2026-08-31', role: 'QA Engineer' },
    
    // AI Assistant
    { id: 15, employeeId: 7, projectId: 3, hoursPerWeek: 32, startDate: '2026-02-01', endDate: '2026-12-31', role: 'ML Lead' },
    { id: 16, employeeId: 8, projectId: 3, hoursPerWeek: 40, startDate: '2026-02-01', endDate: '2026-12-31', role: 'ML Engineer' },
    { id: 17, employeeId: 9, projectId: 3, hoursPerWeek: 40, startDate: '2026-02-01', endDate: '2026-12-31', role: 'ML Engineer' },
    { id: 18, employeeId: 12, projectId: 3, hoursPerWeek: 24, startDate: '2026-02-01', endDate: '2026-12-31', role: 'Product Manager' },
    
    // API Gateway
    { id: 19, employeeId: 10, projectId: 5, hoursPerWeek: 32, startDate: '2026-01-10', endDate: '2026-04-30', role: 'Platform Developer' },
    { id: 20, employeeId: 11, projectId: 5, hoursPerWeek: 40, startDate: '2026-01-10', endDate: '2026-04-30', role: 'Platform Developer' },
    { id: 21, employeeId: 27, projectId: 5, hoursPerWeek: 24, startDate: '2026-01-10', endDate: '2026-04-30', role: 'DevOps Engineer' },
    
    // E-commerce Platform
    { id: 22, employeeId: 5, projectId: 6, hoursPerWeek: 32, startDate: '2026-01-20', endDate: '2026-07-31', role: 'Frontend Lead' },
    { id: 23, employeeId: 4, projectId: 6, hoursPerWeek: 16, startDate: '2026-01-20', endDate: '2026-07-31', role: 'Frontend Developer' },
    { id: 24, employeeId: 19, projectId: 6, hoursPerWeek: 24, startDate: '2026-02-01', endDate: '2026-07-31', role: 'Mobile Developer' },
    
    // Legacy Migration
    { id: 25, employeeId: 1, projectId: 9, hoursPerWeek: 16, startDate: '2025-11-01', endDate: '2026-05-31', role: 'Tech Advisor' },
    { id: 26, employeeId: 2, projectId: 9, hoursPerWeek: 8, startDate: '2025-11-01', endDate: '2026-05-31', role: 'Developer' },
    
    // Testing Framework
    { id: 27, employeeId: 20, projectId: 10, hoursPerWeek: 24, startDate: '2026-01-05', endDate: '2026-04-15', role: 'QA Lead' },
    { id: 28, employeeId: 21, projectId: 10, hoursPerWeek: 32, startDate: '2026-01-05', endDate: '2026-04-15', role: 'QA Automation' },
    { id: 29, employeeId: 22, projectId: 10, hoursPerWeek: 32, startDate: '2026-01-05', endDate: '2026-04-15', role: 'QA Automation' },
    { id: 30, employeeId: 28, projectId: 10, hoursPerWeek: 16, startDate: '2026-01-05', endDate: '2026-02-28', role: 'System Analyst' },
    
    // Additional assignments for QA
    { id: 31, employeeId: 21, projectId: 1, hoursPerWeek: 8, startDate: '2026-03-01', endDate: '2026-06-30', role: 'QA Engineer' },
    { id: 32, employeeId: 24, projectId: 6, hoursPerWeek: 24, startDate: '2026-03-01', endDate: '2026-07-31', role: 'QA Engineer' }
];

// Data Storage Class
class DataStore {
    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const storedEmployees = localStorage.getItem('workload_employees');
        const storedProjects = localStorage.getItem('workload_projects');
        const storedAssignments = localStorage.getItem('workload_assignments');

        this.employees = storedEmployees ? JSON.parse(storedEmployees) : [...initialEmployees];
        this.projects = storedProjects ? JSON.parse(storedProjects) : [...initialProjects];
        this.assignments = storedAssignments ? JSON.parse(storedAssignments) : [...initialAssignments];
    }

    saveToStorage() {
        localStorage.setItem('workload_employees', JSON.stringify(this.employees));
        localStorage.setItem('workload_projects', JSON.stringify(this.projects));
        localStorage.setItem('workload_assignments', JSON.stringify(this.assignments));
    }

    resetToDefaults() {
        this.employees = [...initialEmployees];
        this.projects = [...initialProjects];
        this.assignments = [...initialAssignments];
        this.saveToStorage();
    }

    // Employee methods
    getEmployees() {
        return this.employees;
    }

    getEmployeeById(id) {
        return this.employees.find(e => e.id === id);
    }

    addEmployee(employee) {
        const newId = Math.max(...this.employees.map(e => e.id), 0) + 1;
        const newEmployee = { ...employee, id: newId };
        this.employees.push(newEmployee);
        this.saveToStorage();
        return newEmployee;
    }

    updateEmployee(id, data) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.employees[index] = { ...this.employees[index], ...data };
            this.saveToStorage();
            return this.employees[index];
        }
        return null;
    }

    deleteEmployee(id) {
        this.employees = this.employees.filter(e => e.id !== id);
        this.assignments = this.assignments.filter(a => a.employeeId !== id);
        this.saveToStorage();
    }

    // Project methods
    getProjects() {
        return this.projects;
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }

    addProject(project) {
        const newId = Math.max(...this.projects.map(p => p.id), 0) + 1;
        const newProject = { ...project, id: newId };
        this.projects.push(newProject);
        this.saveToStorage();
        return newProject;
    }

    updateProject(id, data) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...data };
            this.saveToStorage();
            return this.projects[index];
        }
        return null;
    }

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.assignments = this.assignments.filter(a => a.projectId !== id);
        this.saveToStorage();
    }

    // Assignment methods
    getAssignments() {
        return this.assignments;
    }

    getAssignmentsByEmployee(employeeId) {
        return this.assignments.filter(a => a.employeeId === employeeId);
    }

    getAssignmentsByProject(projectId) {
        return this.assignments.filter(a => a.projectId === projectId);
    }

    addAssignment(assignment) {
        const newId = Math.max(...this.assignments.map(a => a.id), 0) + 1;
        const newAssignment = { ...assignment, id: newId };
        this.assignments.push(newAssignment);
        this.saveToStorage();
        return newAssignment;
    }

    updateAssignment(id, data) {
        const index = this.assignments.findIndex(a => a.id === id);
        if (index !== -1) {
            this.assignments[index] = { ...this.assignments[index], ...data };
            this.saveToStorage();
            return this.assignments[index];
        }
        return null;
    }

    deleteAssignment(id) {
        this.assignments = this.assignments.filter(a => a.id !== id);
        this.saveToStorage();
    }

    // Workload calculations
    getEmployeeWorkload(employeeId, date = new Date()) {
        const employee = this.getEmployeeById(employeeId);
        if (!employee) return 0;

        const activeAssignments = this.assignments.filter(a => {
            if (a.employeeId !== employeeId) return false;
            const startDate = new Date(a.startDate);
            const endDate = a.endDate ? new Date(a.endDate) : new Date('2099-12-31');
            return date >= startDate && date <= endDate;
        });

        const totalHours = activeAssignments.reduce((sum, a) => sum + a.hoursPerWeek, 0);
        return Math.round((totalHours / employee.maxHours) * 100);
    }

    getEmployeeCurrentHours(employeeId, date = new Date()) {
        const activeAssignments = this.assignments.filter(a => {
            if (a.employeeId !== employeeId) return false;
            const startDate = new Date(a.startDate);
            const endDate = a.endDate ? new Date(a.endDate) : new Date('2099-12-31');
            return date >= startDate && date <= endDate;
        });

        return activeAssignments.reduce((sum, a) => sum + a.hoursPerWeek, 0);
    }

    getEmployeeAvailableHours(employeeId, date = new Date()) {
        const employee = this.getEmployeeById(employeeId);
        if (!employee) return 0;
        const currentHours = this.getEmployeeCurrentHours(employeeId, date);
        return Math.max(0, employee.maxHours - currentHours);
    }

    getDepartmentWorkload(departmentId) {
        const deptEmployees = this.employees.filter(e => e.departmentId === departmentId);
        if (deptEmployees.length === 0) return 0;

        const totalWorkload = deptEmployees.reduce((sum, e) => sum + this.getEmployeeWorkload(e.id), 0);
        return Math.round(totalWorkload / deptEmployees.length);
    }

    getProjectTeam(projectId) {
        const projectAssignments = this.getAssignmentsByProject(projectId);
        return projectAssignments.map(a => {
            const employee = this.getEmployeeById(a.employeeId);
            return {
                ...a,
                employee
            };
        });
    }

    getEmployeeProjects(employeeId) {
        const employeeAssignments = this.getAssignmentsByEmployee(employeeId);
        return employeeAssignments.map(a => {
            const project = this.getProjectById(a.projectId);
            return {
                ...a,
                project
            };
        });
    }

    // Statistics
    getStatistics() {
        const totalEmployees = this.employees.length;
        const activeProjects = this.projects.filter(p => p.status === 'active').length;
        
        const workloads = this.employees.map(e => this.getEmployeeWorkload(e.id));
        const avgWorkload = workloads.length > 0 
            ? Math.round(workloads.reduce((a, b) => a + b, 0) / workloads.length) 
            : 0;
        
        const overloaded = workloads.filter(w => w > 100).length;

        return {
            totalEmployees,
            activeProjects,
            avgWorkload,
            overloaded
        };
    }

    // Get available employees for assignment
    getAvailableEmployees(maxWorkload = 80) {
        return this.employees.filter(e => {
            const workload = this.getEmployeeWorkload(e.id);
            return workload < maxWorkload;
        }).map(e => ({
            ...e,
            workload: this.getEmployeeWorkload(e.id),
            availableHours: this.getEmployeeAvailableHours(e.id)
        })).sort((a, b) => a.workload - b.workload);
    }

    // Suggest assignments for a project
    suggestAssignments(projectId, requiredHours) {
        const project = this.getProjectById(projectId);
        if (!project) return [];

        const availableEmployees = this.getAvailableEmployees(100);
        const suggestions = [];
        let remainingHours = requiredHours;

        for (const employee of availableEmployees) {
            if (remainingHours <= 0) break;
            
            const availableHours = employee.availableHours;
            if (availableHours > 0) {
                const assignHours = Math.min(availableHours, remainingHours, 40);
                suggestions.push({
                    employee,
                    suggestedHours: assignHours,
                    availableHours
                });
                remainingHours -= assignHours;
            }
        }

        return suggestions;
    }
}

// Initialize data store
const dataStore = new DataStore();
