const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Пожалуйста, введите заголовок статьи'],
        trim: true
    },
    category: { 
        type: String,
        required: [true, 'Пожалуйста, укажите категорию'],
        trim: true
    },
    image: {
        type: String,
        required: [true, 'Пожалуйста, добавьте ссылку на изображение']
    },
    content: {
        type: String,
        required: [true, 'Пожалуйста, напишите текст статьи']
    },
    author: {
        type: String,
        required: true,
        default: 'Администратор'
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;