const mongoose = require('mongoose');

// Модель проекта
const ProjectSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        status: { type: String, default: 'planning' },
        priority: { type: String, default: 'medium' },
        startDate: { type: Date },
        endDate: { type: Date },
        requiredHours: { type: Number, default: 0 },
        currentHours: { type: Number, default: 0 }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', ProjectSchema);
