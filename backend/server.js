const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 

const connectDB = require('./config/db.js');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const { protect, admin } = require('./middleware/authMiddleware');

// Инициализация приложения Express
const app = express();

// Подключение к базе данных
connectDB();

// Настройка Middlewares
app.use(cors()); // Разрешаем CORS-запросы
app.use(express.json()); // Позволяет читать JSON-данные из тела запроса (req.body)

// Приветственный маршрут для проверки работы API
app.get('/', (req, res) => {
    res.send('API для интернет-магазина "Товары для пикника и туризма" запущено и работает!');
});

// Маршрут для изображений
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Подключение маршрутов (API Endpoints)
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', protect, admin, adminRoutes);

// Обработка несуществующих маршрутов (404)
app.use((req, res, next) => {
    res.status(404).json({ message: `Страница не найдена - ${req.originalUrl}` });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`[Сервер] Запущен в режиме ${process.env.NODE_ENV} на порту ${PORT}`);
});
