const Product = require('../models/Product');
const Order = require('../models/Order');
const Post = require('../models/Post'); 
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Оптимизация формата изображений
const optimizeAndSaveImage = async (fileBuffer) => {
    const uniqueFilename = `product-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`;

    // Определяем абсолютный путь к папке uploads на сервере
    const uploadDirectory = path.join(__dirname, '..', 'uploads');

    // Создаем папку uploads, если она еще не создана
    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }

    const outputPath = path.join(uploadDirectory, uniqueFilename);

    await sharp(fileBuffer)
        .resize(800, 800, {
            fit: 'inside', // Сохраняем пропорции, вписывая в рамки 800х800
            withoutEnlargement: true // Не увеличиваем, если картинка меньше 800px
        })
        .webp({ quality: 75 }) // Конвертируем в WebP с качеством 75%
        .toFile(outputPath);

    return `/uploads/${uniqueFilename}`;
};

// Создать товар
const createProduct = async (req, res) => {
    try {
        const { name, description, category, price, countInStock } = req.body;

        // Простая валидация обязательных текстовых полей на сервере
        if (!name || !price) {
            return res.status(400).json({
                message: 'Ошибка валидации: Поля "Название" и "Цена" обязательны для заполнения'
            });
        }

        let imagePath = 'default-product.jpg';

        // Безопасная проверка: если файл действительно передан
        if (req.file && req.file.buffer) {
            imagePath = await optimizeAndSaveImage(req.file.buffer);
        }

        const product = new Product({
            name,
            image: imagePath,
            description: description || '',
            category: category || 'Uncategorized',
            price: Number(price),
            countInStock: countInStock !== undefined ? Number(countInStock) : 0
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при создании товара', error: error.message });
    }
};

// Обновить товар
const updateProduct = async (req, res) => {
    try {
        const { name, price, description, category, countInStock } = req.body;
        const product = await Product.findById(req.params.id);

        if (product) {
            // Если пришел новый файл и старый файл не дефолтный, удаляем старый
            if (req.file && product.image && product.image !== 'default-product.jpg') {
                const oldImagePath = path.join(__dirname, '..', product.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            product.name = name || product.name;
            product.price = price !== undefined ? Number(price) : product.price;
            product.description = description || product.description;
            product.category = category || product.category;
            product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;

            // Если пришел новый файл, оптимизируем его и обновляем путь
            if (req.file && req.file.buffer) {
                product.image = await optimizeAndSaveImage(req.file.buffer);
            }

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Товар не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при обновлении товара', error: error.message });
    }
};

// Удалить товар
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            if (product.image && product.image !== 'default-product.jpg') {
                const imagePath = path.join(__dirname, '..', product.image);

                try {
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath); // Удаляем файл
                        console.log(`Файл ${imagePath} успешно удален`);
                    }
                } catch (err) {
                    console.error(`Не удалось удалить файл ${imagePath}:`, err);
                }
            }

            await product.deleteOne();
            res.json({ message: 'Товар и его изображение успешно удалены' });
        } else {
            res.status(404).json({ message: 'Товар не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при удалении товара', error: error.message });
    }
};

// 2. УПРАВЛЕНИЕ ЗАКАЗАМИ

// Получить все заказы в системе
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось загрузить все заказы', error: error.message });
    }
};

// Обновить статус заказа 
const updateOrderToDelivered = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            if (!order.isPaid) {
                order.isPaid = true;
                order.paidAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Заказ не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении статуса доставки', error: error.message });
    }
};

// 3. УПРАВЛЕНИЕ БЛОГОМ (POSTS)

// Создать новую статью в блоге
const createPost = async (req, res) => {
    try {
        const { title, image, content, tags } = req.body;

        const post = new Post({
            title,
            image,
            content,
            tags
        });

        const createdPost = await post.save();
        res.status(201).json(createdPost);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при создании статьи', error: error.message });
    }
};


// Удалить статью из блога
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post) {
            await post.deleteOne();
            res.json({ message: 'Статья успешно удалена' });
        } else {
            res.status(404).json({ message: 'Статья не найдена' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении статьи', error: error.message });
    }
};

// 4. СТАТИСТИКА ПРОДАЖ (ANALYTICS)

// Получить общую статистику продаж
const getSalesStats = async (req, res) => {
    try {
        const orders = await Order.find({});

        const totalOrders = orders.length;
        const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
        const paidOrdersCount = orders.filter(order => order.isPaid).length;
        const deliveredOrdersCount = orders.filter(order => order.isDelivered).length;

        res.json({
            totalOrders,
            totalSales,
            paidOrdersCount,
            deliveredOrdersCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при расчете статистики', error: error.message });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getOrders,
    updateOrderToDelivered,
    createPost,
    deletePost,
    getSalesStats
};
