const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

// Получить список всех статей в блоге
const getPosts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        const posts = await Post.find(query).sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении списка статей', error: error.message });
    }
};

// Получить детальную информацию о конкретной статье по ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Статья не найдена' });
        }
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Неверный формат идентификатора статьи' });
        }
        res.status(500).json({ message: 'Ошибка сервера при поиске статьи', error: error.message });
    }
};


// Создать новый пост (Только для админа)
const createPost = async (req, res) => {
    try {
        const { title, category, content } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const post = await Post.create({
            title,
            category,
            content,
            image,
            author: 'Администратор'
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при создании поста', error: error.message });
    }
};

// Удалить пост (Только для админа)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            if (post.image) {
                const filePath = path.join(__dirname, '..', post.image);

                fs.unlink(filePath, (err) => {
                    if (err) console.error("Ошибка при удалении файла:", err);
                    else console.log("Файл успешно удален:", filePath);
                });
            }

            await post.deleteOne();
            res.json({ message: 'Пост и изображение удалены' });
        } else {
            res.status(404).json({ message: 'Пост не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении', error: error.message });
    }
};

module.exports = { getPosts, getPostById, createPost, deletePost };