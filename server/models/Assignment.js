const mongoose = require('mongoose');

// Модель назначения сотрудника на проект
const AssignmentSchema = new mongoose.Schema(
    {
        employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
        project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
        hoursPerWeek: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Assignment', AssignmentSchema);
