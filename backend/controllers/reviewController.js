const Review = require('../models/Review');
const Product = require('../models/Product');

// Создать отзыв
const createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const review = new Review({
            user: req.user._id,
            product: productId,
            rating,
            comment
        });
        await review.save();

        const reviews = await Review.find({ product: productId });
        const numReviews = reviews.length;
        const averageRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        const product = await Product.findById(productId);
        if (product) {
            product.rating = averageRating;
            product.numReviews = numReviews;
            await product.save();
        }

        res.status(201).json({ message: 'Отзыв успешно создан' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании отзыва' });
    }
};

// Получить все мои отзывы
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id }).populate('product', 'name');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Получить отзывы по ID товара
const getReviewsByProductId = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name'); 
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении отзывов' });
    }
};

module.exports = { createProductReview, getMyReviews, getReviewsByProductId };
