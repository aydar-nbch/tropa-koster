const express = require('express');
const router = express.Router();
const multer = require('multer');

// Безопасный импорт middleware авторизации
const authMiddleware = require('../middleware/authMiddleware');
const protect = authMiddleware ? authMiddleware.protect : undefined;
const admin = authMiddleware ? authMiddleware.admin : undefined;

// Импортируем наши новые оптимизированные контроллеры сжатия из productController
const productController = require('../controllers/productController');


// Остальные админские методы продолжаем импортировать из adminController
const adminController = require('../controllers/adminController');
const createProduct = adminController ? adminController.createProduct : undefined;
const updateProduct = adminController ? adminController.updateProduct : undefined;
const deleteProduct = adminController ? adminController.deleteProduct : undefined;
const getOrders = adminController ? adminController.getOrders : undefined;
const updateOrderToDelivered = adminController ? adminController.updateOrderToDelivered : undefined;
const createPost = adminController ? adminController.createPost : undefined;
const deletePost = adminController ? adminController.deletePost : undefined;
const getSalesStats = adminController ? adminController.getSalesStats : undefined;

// --- ДИАГНОСТИКА ИМПОРТОВ ПРИ СТАРТЕ ---
console.log('\n=== [ДИАГНОСТИКА АДМИНСКИХ РОУТОВ] ===');
console.log('protect (middleware):', typeof protect === 'function' ? '✅ Успешно' : '❌ UNDEFINED!');
console.log('admin (middleware):', typeof admin === 'function' ? '✅ Успешно' : '❌ UNDEFINED!');
console.log('createProduct (controller):', typeof createProduct === 'function' ? '✅ Успешно' : '❌ UNDEFINED!');
console.log('updateProduct (controller):', typeof updateProduct === 'function' ? '✅ Успешно' : '❌ UNDEFINED!');
console.log('=======================================\n');

// Если критически важные функции отсутствуют, бросаем понятное исключение
if (!protect || !admin) {
    throw new Error(
        'Критическая ошибка: Не удалось импортировать "protect" или "admin" из middleware/authMiddleware.js. ' +
        'Проверьте, экспортируются ли они через module.exports = { protect, admin };'
    );
}

if (!createProduct || !updateProduct) {
    throw new Error(
        'Критическая ошибка: Не удалось импортировать "createProduct" или "updateProduct" из controllers/productController.js. ' +
        'Проверьте, что этот файл существует, пути указаны верно и функции экспортируются через module.exports.'
    );
}

// --- КОНФИГУРАЦИЯ MULTER  ---
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Можно загружать только изображения'), false);
        }
    }
});

// Маршруты для управления товарами
router.route('/products')
    .post(protect, admin, upload.single('image'), createProduct);

router.route('/products/:id')
    .put(protect, admin, upload.single('image'), updateProduct)
    .delete(protect, admin, deleteProduct);

// Маршруты для управления заказами
router.route('/orders')
    .get(protect, admin, getOrders);

router.route('/orders/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

// Маршруты для управления блогом
router.route('/posts')
    .post(protect, admin, createPost);

router.route('/posts/:id')
    .delete(protect, admin, deletePost);

// Маршрут для аналитики
router.route('/stats')
    .get(protect, admin, getSalesStats);

module.exports = router;