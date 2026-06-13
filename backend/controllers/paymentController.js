const yookassaModule = require('yookassa');

console.log('--- Диагностика ЮKassa ---');
console.log(yookassaModule);
console.log('--------------------------');

const YooKassa = yookassaModule.YooKassa || yookassaModule;

const yookassa = new YooKassa({
    shopId: process.env.YOOKASSA_SHOP_ID,
    secretKey: process.env.YOOKASSA_SECRET_KEY
});

const createYooKassaPayment = async (req, res) => {
    try {
        const { orderId, amount } = req.body;

        const payment = await yookassa.createPayment({
            amount: {
                value: amount.toFixed(2),
                currency: 'RUB'
            },
            payment_method_data: {
                type: 'bank_card'
            },
            confirmation: {
                type: 'redirect',
                return_url: `http://localhost:5173/order_success`
            },
            description: `Заказ №${orderId}`,
        }, orderId);

        res.status(200).json({ confirmation_url: payment.confirmation.confirmation_url });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании платежа в ЮKassa', error: error.message });
    }
};


module.exports = { createYooKassaPayment };