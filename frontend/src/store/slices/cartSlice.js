import { createSlice } from '@reduxjs/toolkit';

const loadCartFromStorage = () => {
    try {
        const serializedCart = localStorage.getItem('cartItems');
        const parsed = serializedCart ? JSON.parse(serializedCart) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.error("Ошибка при чтении корзины из localStorage:", err);
        return [];
    }
};

const initialState = {
    items: loadCartFromStorage(),
    promoCode: '',
    appliedDiscount: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const productId = product._id || product.id;

            const existingItem = state.items.find(item => (item._id || item.id) === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({
                    id: productId,
                    _id: productId,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1,
                });
            }
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        updateQuantity: (state, action) => {
            const { id, delta } = action.payload;
            const item = state.items.find(item => (item._id || item.id) === id);

            if (item) {
                const newQuantity = item.quantity + delta;

                if (newQuantity > 0) {
                    item.quantity = newQuantity;
                } else {
                    state.items = state.items.filter(i => (i._id || i.id) !== id);
                }
            }

            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        removeFromCart: (state, action) => {
            const id = action.payload;
            state.items = state.items.filter(item => (item._id || item.id) !== id);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },

        applyPromoCode: (state, action) => {
            const code = action.payload.trim().toUpperCase();
            state.promoCode = code;
            state.appliedDiscount = (code === 'CAMP2026') ? 15 : 0;
        },

        clearCart: (state) => {
            state.items = [];
            state.promoCode = '';
            state.appliedDiscount = 0;
            localStorage.removeItem('cartItems');
        }
    }
});

export const { addToCart, updateQuantity, removeFromCart, applyPromoCode, clearCart } = cartSlice.actions;
export default cartSlice.reducer;