// Main Application Logic for Workload Planning System

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFilters();
    initForms();
    updateDashboard();
    renderEmployeesTable();
    renderProjectsGrid();
    renderPlanningSection();
    initReports();
});

// Tab Navigation
function initTabs() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Refresh content when switching tabs
            if (tabId === 'dashboard') updateDashboard();
            if (tabId === 'employees') renderEmployeesTable();
            if (tabId === 'projects') renderProjectsGrid();
            if (tabId === 'planning') renderPlanningSection();
            if (tabId === 'reports') generateReport();
        });
    });
}

// Initialize Filters
function initFilters() {
    // Populate department filter
    const deptFilters = document.querySelectorAll('#filter-department, #employee-department');
    deptFilters.forEach(select => {
        departments.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.id;
            option.textContent = dept.name;
            select.appendChild(option);
        });
    });

    // Populate team filter
    const teamFilter = document.getElementById('filter-team');
    const teamSelect = document.getElementById('employee-team');
    teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamFilter.appendChild(option.cloneNode(true));
        teamSelect.appendChild(option);
    });

    // Populate role filter
    const roleFilter = document.getElementById('filter-role');
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name;
        roleFilter.appendChild(option);
    });

    // Add filter event listeners
    document.getElementById('filter-department').addEventListener('change', renderEmployeesTable);
    document.getElementById('filter-team').addEventListener('change', renderEmployeesTable);
    document.getElementById('filter-role').addEventListener('change', renderEmployeesTable);
    document.getElementById('search-employee').addEventListener('input', renderEmployeesTable);

    document.getElementById('filter-project-status').addEventListener('change', renderProjectsGrid);
    document.getElementById('filter-project-priority').addEventListener('change', renderProjectsGrid);

    // Workload filter for planning
    const workloadFilter = document.getElementById('max-workload-filter');
    const workloadValue = document.getElementById('max-workload-value');
    workloadFilter.addEventListener('input', () => {
        workloadValue.textContent = workloadFilter.value + '%';
        renderAvailableEmployees();
    });

    // Populate project select for auto-planning
    updateProjectSelects();
}

// Initialize Forms
function initForms() {
    // Employee form
    document.getElementById('employee-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveEmployee();
    });

    // Project form
    document.getElementById('project-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProject();
    });

    // Assignment form
    document.getElementById('assignment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveAssignment();
    });

    // Update team options based on department selection
    document.getElementById('employee-department').addEventListener('change', (e) => {
        updateTeamOptions(e.target.value);
    });
}

// Update team options based on department
function updateTeamOptions(departmentId) {
    const teamSelect = document.getElementById('employee-team');
    teamSelect.innerHTML = '<option value="">Выберите команду</option>';
    
    const filteredTeams = teams.filter(t => t.departmentId === departmentId);
    filteredTeams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        teamSelect.appendChild(option);
    });
}

// Update project selects
function updateProjectSelects() {
    const selects = document.querySelectorAll('#assignment-project, #auto-plan-project');
    const projects = dataStore.getProjects().filter(p => p.status !== 'completed');
    
    selects.forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Выберите проект</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
        select.value = currentValue;
    });
}

// Update employee selects
function updateEmployeeSelects() {
    const select = document.getElementById('assignment-employee');
    const employees = dataStore.getEmployees();
    
    select.innerHTML = '<option value="">Выберите сотрудника</option>';
    employees.forEach(emp => {
        const workload = dataStore.getEmployeeWorkload(emp.id);
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = `${emp.name} (${workload}%)`;
        select.appendChild(option);
    });
}

// ==================== DASHBOARD ====================

function updateDashboard() {
    const stats = dataStore.getStatistics();
    
    document.getElementById('total-employees').textContent = stats.totalEmployees;
    document.getElementById('active-projects').textContent = stats.activeProjects;
    document.getElementById('avg-workload').textContent = stats.avgWorkload + '%';
    document.getElementById('overloaded').textContent = stats.overloaded;

    renderDepartmentChart();
    renderRoleChart();
    renderWorkloadBars();
}

function renderDepartmentChart() {
    const container = document.getElementById('department-chart');
    container.innerHTML = '';

    departments.forEach(dept => {
        const workload = dataStore.getDepartmentWorkload(dept.id);
        const employeeCount = dataStore.getEmployees().filter(e => e.departmentId === dept.id).length;
        
        const bar = document.createElement('div');
        bar.className = 'dept-bar';
        bar.innerHTML = `
            <div class="dept-name">
                <span>${dept.name}</span>
                <span>${workload}% (${employeeCount} чел.)</span>
            </div>
            <div class="bar-bg">
                <div class="bar-fill" style="width: ${Math.min(workload, 100)}%; background: ${dept.color}"></div>
            </div>
        `;
        container.appendChild(bar);
    });
}

function renderRoleChart() {
    const container = document.getElementById('role-chart');
    container.innerHTML = '';

    const employees = dataStore.getEmployees();
    
    roles.forEach(role => {
        const count = employees.filter(e => e.role === role.id).length;
        if (count > 0) {
            const item = document.createElement('div');
            item.className = 'role-item';
            item.innerHTML = `
                <div class="color-dot" style="background: ${role.color}"></div>
                <span class="role-name">${role.name}</span>
                <span class="role-count">${count}</span>
            `;
            container.appendChild(item);
        }
    });
}

function renderWorkloadBars() {
    const container = document.getElementById('workload-bars');
    container.innerHTML = '';

    const employees = dataStore.getEmployees();
    const employeesWithWorkload = employees.map(e => ({
        ...e,
        workload: dataStore.getEmployeeWorkload(e.id)
    })).sort((a, b) => b.workload - a.workload).slice(0, 15);

    employeesWithWorkload.forEach(emp => {
        const dept = departments.find(d => d.id === emp.departmentId);
        const workloadClass = emp.workload > 100 ? 'high' : emp.workload > 70 ? 'medium' : 'low';
        
        const item = document.createElement('div');
        item.className = 'workload-bar-item';
        item.innerHTML = `
            <span class="name">${emp.name}</span>
            <div class="bar-container">
                <div class="bar ${workloadClass}" style="width: ${Math.min(emp.workload, 100)}%">
                    ${emp.workload}%
                </div>
            </div>
            <span class="department">${dept ? dept.name : ''}</span>
        `;
        container.appendChild(item);
    });
}

// ==================== EMPLOYEES ====================

function renderEmployeesTable() {
    const tbody = document.querySelector('#employees-table tbody');
    tbody.innerHTML = '';

    let employees = dataStore.getEmployees();

    // Apply filters
    const deptFilter = document.getElementById('filter-department').value;
    const teamFilter = document.getElementById('filter-team').value;
    const roleFilter = document.getElementById('filter-role').value;
    const searchFilter = document.getElementById('search-employee').value.toLowerCase();

    if (deptFilter) employees = employees.filter(e => e.departmentId === deptFilter);
    if (teamFilter) employees = employees.filter(e => e.teamId === teamFilter);
    if (roleFilter) employees = employees.filter(e => e.role === roleFilter);
    if (searchFilter) employees = employees.filter(e => e.name.toLowerCase().includes(searchFilter));

    employees.forEach(emp => {
        const dept = departments.find(d => d.id === emp.departmentId);
        const team = teams.find(t => t.id === emp.teamId);
        const role = roles.find(r => r.id === emp.role);
        const workload = dataStore.getEmployeeWorkload(emp.id);
        const projects = dataStore.getEmployeeProjects(emp.id);
        
        const workloadClass = workload > 100 ? 'high' : workload > 70 ? 'medium' : 'low';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${emp.name}</strong></td>
            <td>${dept ? dept.name : '-'}</td>
            <td>${team ? team.name : '-'}</td>
            <td>${role ? role.name : '-'}</td>
            <td><span class="workload-badge ${workloadClass}">${workload}%</span></td>
            <td>${projects.length} проект(ов)</td>
            <td>
                <button class="btn small secondary" onclick="editEmployee(${emp.id})">✏️</button>
                <button class="btn small secondary" onclick="viewEmployeeDetails(${emp.id})">👁️</button>
                <button class="btn small danger" onclick="deleteEmployee(${emp.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openEmployeeModal(employeeId = null) {
    const modal = document.getElementById('employee-modal');
    const title = document.getElementById('employee-modal-title');
    const form = document.getElementById('employee-form');
    
    form.reset();
    document.getElementById('employee-id').value = '';
    
    if (employeeId) {
        const employee = dataStore.getEmployeeById(employeeId);
        if (employee) {
            title.textContent = 'Редактировать сотрудника';
            document.getElementById('employee-id').value = employee.id;
            document.getElementById('employee-name').value = employee.name;
            document.getElementById('employee-department').value = employee.departmentId;
            updateTeamOptions(employee.departmentId);
            document.getElementById('employee-team').value = employee.teamId;
            document.getElementById('employee-role').value = employee.role;
            document.getElementById('employee-max-hours').value = employee.maxHours;
        }
    } else {
        title.textContent = 'Добавить сотрудника';
    }
    
    modal.classList.add('active');
}

function editEmployee(id) {
    openEmployeeModal(id);
}

function saveEmployee() {
    const id = document.getElementById('employee-id').value;
    const data = {
        name: document.getElementById('employee-name').value,
        departmentId: document.getElementById('employee-department').value,
        teamId: document.getElementById('employee-team').value,
        role: document.getElementById('employee-role').value,
        maxHours: parseInt(document.getElementById('employee-max-hours').value)
    };

    if (id) {
        dataStore.updateEmployee(parseInt(id), data);
        showToast('Сотрудник обновлён', 'success');
    } else {
        dataStore.addEmployee(data);
        showToast('Сотрудник добавлен', 'success');
    }

    closeModal('employee-modal');
    renderEmployeesTable();
    updateDashboard();
    updateEmployeeSelects();
}

function deleteEmployee(id) {
    if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        dataStore.deleteEmployee(id);
        showToast('Сотрудник удалён', 'success');
        renderEmployeesTable();
        updateDashboard();
    }
}

function viewEmployeeDetails(id) {
    const employee = dataStore.getEmployeeById(id);
    if (!employee) return;

    const dept = departments.find(d => d.id === employee.departmentId);
    const team = teams.find(t => t.id === employee.teamId);
    const role = roles.find(r => r.id === employee.role);
    const workload = dataStore.getEmployeeWorkload(id);
    const projects = dataStore.getEmployeeProjects(id);

    let projectsList = projects.map(p => `
        <div class="report-item">
            <span class="label">${p.project.name}</span>
            <span class="value">${p.hoursPerWeek} ч/нед</span>
        </div>
    `).join('');

    if (projects.length === 0) {
        projectsList = '<p>Нет назначенных проектов</p>';
    }

    const content = `
        <h2>${employee.name}</h2>
        <div style="margin: 20px 0;">
            <p><strong>Отдел:</strong> ${dept ? dept.name : '-'}</p>
            <p><strong>Команда:</strong> ${team ? team.name : '-'}</p>
            <p><strong>Роль:</strong> ${role ? role.name : '-'}</p>
            <p><strong>Макс. часов:</strong> ${employee.maxHours} ч/нед</p>
            <p><strong>Текущая загрузка:</strong> ${workload}%</p>
        </div>
        <h3>Проекты</h3>
        ${projectsList}
    `;

    showInfoModal(content);
}

// ==================== PROJECTS ====================

function renderProjectsGrid() {
    const container = document.getElementById('projects-grid');
    container.innerHTML = '';

    let projects = dataStore.getProjects();

    // Apply filters
    const statusFilter = document.getElementById('filter-project-status').value;
    const priorityFilter = document.getElementById('filter-project-priority').value;

    if (statusFilter) projects = projects.filter(p => p.status === statusFilter);
    if (priorityFilter) projects = projects.filter(p => p.priority === priorityFilter);

    projects.forEach(project => {
        const team = dataStore.getProjectTeam(project.id);
        const statusLabels = {
            'planning': 'Планирование',
            'active': 'Активный',
            'on-hold': 'На паузе',
            'completed': 'Завершён'
        };
        const priorityLabels = {
            'high': 'Высокий',
            'medium': 'Средний',
            'low': 'Низкий'
        };

        const teamAvatars = team.slice(0, 5).map(t => {
            const initials = t.employee.name.split(' ').map(n => n[0]).join('');
            return `<div class="team-avatar" title="${t.employee.name}">${initials}</div>`;
        }).join('');

        const moreCount = team.length > 5 ? `<div class="team-avatar">+${team.length - 5}</div>` : '';

        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-card-header">
                <div>
                    <h3>${project.name}</h3>
                    <span class="project-priority ${project.priority}">${priorityLabels[project.priority]}</span>
                </div>
                <span class="project-status ${project.status}">${statusLabels[project.status]}</span>
            </div>
            <p class="description">${project.description || 'Нет описания'}</p>
            <div class="project-meta">
                <span>📅 ${formatDate(project.startDate)} - ${formatDate(project.endDate)}</span>
                <span>⏱️ ${project.requiredHours} ч</span>
            </div>
            <div class="project-team">
                <h4>Команда (${team.length})</h4>
                <div class="team-avatars">
                    ${teamAvatars}${moreCount}
                </div>
            </div>
            <div class="project-card-actions">
                <button class="btn small secondary" onclick="editProject(${project.id})">✏️ Редактировать</button>
                <button class="btn small secondary" onclick="viewProjectDetails(${project.id})">👁️ Подробнее</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function openProjectModal(projectId = null) {
    const modal = document.getElementById('project-modal');
    const title = document.getElementById('project-modal-title');
    const form = document.getElementById('project-form');
    
    form.reset();
    document.getElementById('project-id').value = '';
    
    if (projectId) {
        const project = dataStore.getProjectById(projectId);
        if (project) {
            title.textContent = 'Редактировать проект';
            document.getElementById('project-id').value = project.id;
            document.getElementById('project-name').value = project.name;
            document.getElementById('project-description').value = project.description || '';
            document.getElementById('project-status').value = project.status;
            document.getElementById('project-priority').value = project.priority;
            document.getElementById('project-start-date').value = project.startDate;
            document.getElementById('project-end-date').value = project.endDate;
            document.getElementById('project-required-hours').value = project.requiredHours;
        }
    } else {
        title.textContent = 'Добавить проект';
    }
    
    modal.classList.add('active');
}

function editProject(id) {
    openProjectModal(id);
}

function saveProject() {
    const id = document.getElementById('project-id').value;
    const data = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
        status: document.getElementById('project-status').value,
        priority: document.getElementById('project-priority').value,
        startDate: document.getElementById('project-start-date').value,
        endDate: document.getElementById('project-end-date').value,
        requiredHours: parseInt(document.getElementById('project-required-hours').value) || 0
    };

    if (id) {
        dataStore.updateProject(parseInt(id), data);
        showToast('Проект обновлён', 'success');
    } else {
        dataStore.addProject(data);
        showToast('Проект добавлен', 'success');
    }

    closeModal('project-modal');
    renderProjectsGrid();
    updateDashboard();
    updateProjectSelects();
}

function viewProjectDetails(id) {
    const project = dataStore.getProjectById(id);
    if (!project) return;

    const team = dataStore.getProjectTeam(id);
    const statusLabels = {
        'planning': 'Планирование',
        'active': 'Активный',
        'on-hold': 'На паузе',
        'completed': 'Завершён'
    };

    let teamList = team.map(t => {
        const role = roles.find(r => r.id === t.employee.role);
        return `
            <div class="report-item">
                <span class="label">${t.employee.name} (${role ? role.name : '-'})</span>
                <span class="value">${t.hoursPerWeek} ч/нед - ${t.role || 'Участник'}</span>
            </div>
        `;
    }).join('');

    if (team.length === 0) {
        teamList = '<p>Команда не назначена</p>';
    }

    const totalHours = team.reduce((sum, t) => sum + t.hoursPerWeek, 0);

    const content = `
        <h2>${project.name}</h2>
        <div style="margin: 20px 0;">
            <p><strong>Статус:</strong> ${statusLabels[project.status]}</p>
            <p><strong>Приоритет:</strong> ${project.priority}</p>
            <p><strong>Период:</strong> ${formatDate(project.startDate)} - ${formatDate(project.endDate)}</p>
            <p><strong>Требуемые часы:</strong> ${project.requiredHours} ч</p>
            <p><strong>Выделено часов/нед:</strong> ${totalHours} ч</p>
            <p><strong>Описание:</strong> ${project.description || 'Нет описания'}</p>
        </div>
        <h3>Команда проекта (${team.length})</h3>
        ${teamList}
    `;

    showInfoModal(content);
}

// ==================== PLANNING ====================

function renderPlanningSection() {
    renderAvailableEmployees();
    renderAssignmentsTimeline();
    updateEmployeeSelects();
    updateProjectSelects();
}

function renderAvailableEmployees() {
    const container = document.getElementById('available-employees');
    const maxWorkload = parseInt(document.getElementById('max-workload-filter').value);
    
    const availableEmployees = dataStore.getAvailableEmployees(maxWorkload);
    
    container.innerHTML = '';
    
    if (availableEmployees.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-secondary);">Нет доступных сотрудников</p>';
        return;
    }

    availableEmployees.forEach(emp => {
        const dept = departments.find(d => d.id === emp.departmentId);
        const role = roles.find(r => r.id === emp.role);
        const workloadClass = emp.workload > 70 ? 'medium' : 'low';
        const fillColor = emp.workload > 70 ? '#f59e0b' : '#10b981';
        
        const item = document.createElement('div');
        item.className = 'employee-item';
        item.onclick = () => quickAssign(emp.id);
        item.innerHTML = `
            <div class="name">${emp.name}</div>
            <div class="info">${role ? role.name : '-'} • ${dept ? dept.name : '-'}</div>
            <div class="info">Доступно: ${emp.availableHours} ч/нед</div>
            <div class="workload">
                <div class="workload-fill" style="width: ${emp.workload}%; background: ${fillColor}"></div>
            </div>
        `;
        container.appendChild(item);
    });
}

function quickAssign(employeeId) {
    document.getElementById('assignment-employee').value = employeeId;
    openAssignmentModal();
}

function renderAssignmentsTimeline() {
    const container = document.getElementById('assignments-timeline');
    container.innerHTML = '';

    const assignments = dataStore.getAssignments();
    const today = new Date();

    // Filter active assignments
    const activeAssignments = assignments.filter(a => {
        const endDate = a.endDate ? new Date(a.endDate) : new Date('2099-12-31');
        return endDate >= today;
    });

    if (activeAssignments.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-secondary);">Нет активных назначений</p>';
        return;
    }

    // Group by employee
    const groupedByEmployee = {};
    activeAssignments.forEach(a => {
        if (!groupedByEmployee[a.employeeId]) {
            groupedByEmployee[a.employeeId] = [];
        }
        groupedByEmployee[a.employeeId].push(a);
    });

    Object.entries(groupedByEmployee).forEach(([employeeId, empAssignments]) => {
        const employee = dataStore.getEmployeeById(parseInt(employeeId));
        if (!employee) return;

        empAssignments.forEach(assignment => {
            const project = dataStore.getProjectById(assignment.projectId);
            if (!project) return;

            const row = document.createElement('div');
            row.className = 'assignment-row';
            row.innerHTML = `
                <div class="assignment-employee">${employee.name}</div>
                <div class="assignment-project">
                    <span class="project-name">${project.name}</span>
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">
                        ${assignment.role || 'Участник'}
                    </span>
                </div>
                <div class="assignment-hours">${assignment.hoursPerWeek} ч/нед</div>
                <div class="assignment-actions">
                    <button class="btn small danger" onclick="deleteAssignment(${assignment.id})">🗑️</button>
                </div>
            `;
            container.appendChild(row);
        });
    });
}

function openAssignmentModal() {
    const modal = document.getElementById('assignment-modal');
    updateEmployeeSelects();
    updateProjectSelects();
    
    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('assignment-start-date').value = today;
    
    modal.classList.add('active');
}

function saveAssignment() {
    const employeeId = parseInt(document.getElementById('assignment-employee').value);
    const projectId = parseInt(document.getElementById('assignment-project').value);
    const hoursPerWeek = parseInt(document.getElementById('assignment-hours').value);
    const startDate = document.getElementById('assignment-start-date').value;
    const endDate = document.getElementById('assignment-end-date').value;
    const role = document.getElementById('assignment-role').value;

    if (!employeeId || !projectId || !hoursPerWeek) {
        showToast('Заполните все обязательные поля', 'error');
        return;
    }

    // Check if employee has enough available hours
    const availableHours = dataStore.getEmployeeAvailableHours(employeeId);
    if (hoursPerWeek > availableHours) {
        if (!confirm(`У сотрудника доступно только ${availableHours} ч/нед. Продолжить?`)) {
            return;
        }
    }

    dataStore.addAssignment({
        employeeId,
        projectId,
        hoursPerWeek,
        startDate,
        endDate: endDate || null,
        role
    });

    showToast('Назначение создано', 'success');
    closeModal('assignment-modal');
    document.getElementById('assignment-form').reset();
    renderPlanningSection();
    updateDashboard();
}

function deleteAssignment(id) {
    if (confirm('Удалить это назначение?')) {
        dataStore.deleteAssignment(id);
        showToast('Назначение удалено', 'success');
        renderPlanningSection();
        updateDashboard();
    }
}

function suggestAssignments() {
    const projectId = parseInt(document.getElementById('auto-plan-project').value);
    const requiredHours = parseInt(document.getElementById('required-hours').value);
    const container = document.getElementById('suggestions-container');

    if (!projectId || !requiredHours) {
        showToast('Выберите проект и укажите требуемые часы', 'warning');
        return;
    }

    const suggestions = dataStore.suggestAssignments(projectId, requiredHours);
    
    if (suggestions.length === 0) {
        container.innerHTML = '<p style="padding: 20px; text-align: center; color: var(--text-secondary);">Нет доступных сотрудников для назначения</p>';
        return;
    }

    const project = dataStore.getProjectById(projectId);
    let totalSuggested = 0;

    container.innerHTML = `<h4>Предложения для проекта "${project.name}":</h4>`;
    
    suggestions.forEach(s => {
        const dept = departments.find(d => d.id === s.employee.departmentId);
        const role = roles.find(r => r.id === s.employee.role);
        totalSuggested += s.suggestedHours;

        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <div class="employee-info">
                <strong>${s.employee.name}</strong>
                <span style="color: var(--text-secondary); margin-left: 10px;">
                    ${role ? role.name : '-'} • ${dept ? dept.name : '-'}
                </span>
            </div>
            <div class="available-hours">
                Предложено: ${s.suggestedHours} ч/нед (доступно: ${s.availableHours} ч)
            </div>
            <button class="btn small primary" onclick="applySuggestion(${s.employee.id}, ${projectId}, ${s.suggestedHours})">
                Назначить
            </button>
        `;
        container.appendChild(item);
    });

    const summary = document.createElement('div');
    summary.style.cssText = 'margin-top: 15px; padding: 15px; background: var(--background); border-radius: 8px;';
    summary.innerHTML = `
        <strong>Итого предложено:</strong> ${totalSuggested} ч/нед из ${requiredHours} ч/нед требуемых
        ${totalSuggested < requiredHours ? '<br><span style="color: var(--warning-color);">⚠️ Недостаточно ресурсов для полного покрытия</span>' : ''}
    `;
    container.appendChild(summary);
}

function applySuggestion(employeeId, projectId, hours) {
    const today = new Date().toISOString().split('T')[0];
    const project = dataStore.getProjectById(projectId);
    
    dataStore.addAssignment({
        employeeId,
        projectId,
        hoursPerWeek: hours,
        startDate: today,
        endDate: project.endDate,
        role: ''
    });

    showToast('Сотрудник назначен на проект', 'success');
    renderPlanningSection();
    updateDashboard();
    suggestAssignments(); // Refresh suggestions
}

// ==================== REPORTS ====================

function initReports() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    document.getElementById('report-start-date').value = startOfMonth.toISOString().split('T')[0];
    document.getElementById('report-end-date').value = endOfMonth.toISOString().split('T')[0];
}

function generateReport() {
    renderDepartmentReport();
    renderTopLoadedReport();
    renderUnderloadedReport();
    renderProjectsReport();
}

function renderDepartmentReport() {
    const container = document.getElementById('report-departments');
    container.innerHTML = '';

    departments.forEach(dept => {
        const employees = dataStore.getEmployees().filter(e => e.departmentId === dept.id);
        const workload = dataStore.getDepartmentWorkload(dept.id);
        
        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <span class="label">${dept.name}</span>
            <span class="value">${employees.length} чел. • ${workload}% загрузка</span>
        `;
        container.appendChild(item);
    });
}

function renderTopLoadedReport() {
    const container = document.getElementById('report-top-loaded');
    container.innerHTML = '';

    const employees = dataStore.getEmployees()
        .map(e => ({ ...e, workload: dataStore.getEmployeeWorkload(e.id) }))
        .sort((a, b) => b.workload - a.workload)
        .slice(0, 5);

    employees.forEach(emp => {
        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <span class="label">${emp.name}</span>
            <span class="value" style="color: ${emp.workload > 100 ? 'var(--danger-color)' : 'inherit'}">${emp.workload}%</span>
        `;
        container.appendChild(item);
    });
}

function renderUnderloadedReport() {
    const container = document.getElementById('report-underloaded');
    container.innerHTML = '';

    const employees = dataStore.getEmployees()
        .map(e => ({ ...e, workload: dataStore.getEmployeeWorkload(e.id) }))
        .filter(e => e.workload < 50)
        .sort((a, b) => a.workload - b.workload)
        .slice(0, 5);

    if (employees.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary);">Все сотрудники загружены более чем на 50%</p>';
        return;
    }

    employees.forEach(emp => {
        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <span class="label">${emp.name}</span>
            <span class="value" style="color: var(--success-color)">${emp.workload}%</span>
        `;
        container.appendChild(item);
    });
}

function renderProjectsReport() {
    const container = document.getElementById('report-projects');
    container.innerHTML = '';

    const projects = dataStore.getProjects().filter(p => p.status === 'active');

    projects.forEach(project => {
        const team = dataStore.getProjectTeam(project.id);
        const totalHours = team.reduce((sum, t) => sum + t.hoursPerWeek, 0);
        
        const item = document.createElement('div');
        item.className = 'report-item';
        item.innerHTML = `
            <span class="label">${project.name}</span>
            <span class="value">${team.length} чел. • ${totalHours} ч/нед</span>
        `;
        container.appendChild(item);
    });
}

function exportReport() {
    const stats = dataStore.getStatistics();
    const employees = dataStore.getEmployees();
    const projects = dataStore.getProjects();

    let report = '=== ОТЧЁТ О ЗАГРУЗКЕ СОТРУДНИКОВ ===\n\n';
    report += `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}\n\n`;
    
    report += '--- ОБЩАЯ СТАТИСТИКА ---\n';
    report += `Всего сотрудников: ${stats.totalEmployees}\n`;
    report += `Активных проектов: ${stats.activeProjects}\n`;
    report += `Средняя загрузка: ${stats.avgWorkload}%\n`;
    report += `Перегруженных сотрудников: ${stats.overloaded}\n\n`;

    report += '--- ЗАГРУЗКА ПО ОТДЕЛАМ ---\n';
    departments.forEach(dept => {
        const workload = dataStore.getDepartmentWorkload(dept.id);
        const count = employees.filter(e => e.departmentId === dept.id).length;
        report += `${dept.name}: ${count} чел., ${workload}% загрузка\n`;
    });

    report += '\n--- СОТРУДНИКИ ---\n';
    employees.forEach(emp => {
        const workload = dataStore.getEmployeeWorkload(emp.id);
        const dept = departments.find(d => d.id === emp.departmentId);
        report += `${emp.name} (${dept ? dept.name : '-'}): ${workload}%\n`;
    });

    report += '\n--- АКТИВНЫЕ ПРОЕКТЫ ---\n';
    projects.filter(p => p.status === 'active').forEach(project => {
        const team = dataStore.getProjectTeam(project.id);
        report += `${project.name}: ${team.length} участников\n`;
    });

    // Download as file
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workload-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    showToast('Отчёт экспортирован', 'success');
}

// ==================== UTILITIES ====================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showInfoModal(content) {
    // Create temporary modal for info display
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            ${content}
        </div>
    `;
    document.body.appendChild(modal);
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modals on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Reset data function (for testing)
function resetData() {
    if (confirm('Сбросить все данные к начальным значениям?')) {
        dataStore.resetToDefaults();
        location.reload();
    }
}
