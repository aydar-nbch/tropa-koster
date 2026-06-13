const Order = require('../models/Order');
const Product = require('../models/Product');

// Создать новый заказ
const addOrderItems = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            res.status(400);
            throw new Error('В заказе нет товаров');
        }

        const order = new Order({
            user: req.user._id, 
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();

        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (product) {
                product.countInStock = Math.max(0, product.countInStock - item.qty);
                await product.save();
            }
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось создать заказ', error: error.message });
    }
};

// Получить заказ по ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
                return res.status(403).json({ message: 'Нет прав для просмотра этого заказа' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Заказ не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера при поиске заказа', error: error.message });
    }
};

// Получить заказы вошедшего в систему пользователя (история)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Не удалось загрузить историю заказов', error: error.message });
    }
};



module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
};