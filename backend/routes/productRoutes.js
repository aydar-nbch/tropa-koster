const express = require('express');
const router = express.Router();
const { getProducts, createProduct, getProductById } = require('../controllers/productController');

// Маршрут для получения ВСЕХ товаров
router.route('/')
    .get(getProducts);

//  Получение одного товара по ID
router.route('/:id')
    .get(getProductById);

module.exports = router;