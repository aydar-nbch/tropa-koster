const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Пожалуйста, введите название товара'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Пожалуйста, добавьте ссылку на изображение товара']
    },
    description: {
        type: String,
        required: [true, 'Пожалуйста, добавьте описание товара']
    },
    category: {
        type: String,
        required: [true, 'Пожалуйста, укажите категорию товара'],
        enum: ['Палатки', 'Грили', 'Рюкзаки', 'Освещение', 'Кухня', 'Одежда']
    },
    price: {
        type: Number,
        required: [true, 'Пожалуйста, укажите цену'],
        default: 0
    },
    countInStock: {
        type: Number,
        required: [true, 'Пожалуйста, укажите количество на складе'],
        default: 0
    },
    rating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true 
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
