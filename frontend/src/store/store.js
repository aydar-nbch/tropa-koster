import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import blogReducer from './slices/blogSlice';
import orderReducer from './slices/orderSlice'; 
import reviewReducer from './slices/reviewSlice'; 



const store = configureStore({
    reducer: {
        cart: cartReducer,
        products: productReducer,
        user: userReducer,
        blog: blogReducer,
        orders: orderReducer, 
        reviews: reviewReducer, 

    },
});

export default store;