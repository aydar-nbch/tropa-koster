const Product = require('../models/Product');

// Получить все товары 
const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortBy = {};
        if (sort === 'priceAsc') sortBy.price = 1;
        else if (sort === 'priceDesc') sortBy.price = -1;
        else if (sort === 'rating') sortBy.rating = -1;
        else sortBy.createdAt = -1; // По умолчанию - новые товары

        const products = await Product.find(query).sort(sortBy);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при получении товаров', error: error.message });
    }
};

// Получить 1 товар по ID

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Товар не найден в базе данных' });
        }
    } catch (error) {
        console.error('ОШИБКА В getProductById:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById
};