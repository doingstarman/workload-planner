const mongoose = require('mongoose');

// Модель сотрудника
const EmployeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        department: { type: String, required: true, trim: true },
        team: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        maxWeeklyHours: { type: Number, default: 40 },
        currentLoad: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Employee', EmployeeSchema);
