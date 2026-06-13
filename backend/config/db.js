const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`[База Данных] Успешное подключение к MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[Ошибка БД] Ошибка подключения: ${error.message}`);
        process.exit(1); // Завершаем процесс в случае критической ошибки
    }
};

module.exports = connectDB;
