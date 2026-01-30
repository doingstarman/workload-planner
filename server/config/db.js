const mongoose = require('mongoose');

// Подключение к MongoDB
async function connectDB() {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI не задан');
        }

        await mongoose.connect(uri);
        console.log('✅ MongoDB подключена');
    } catch (error) {
        console.error('❌ Ошибка подключения к MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;
