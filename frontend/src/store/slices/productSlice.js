import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (filters = {}, { rejectWithValue }) => {
    try {
        const { category, search, minPrice, maxPrice, sort } = filters;
        let queryParams = [];
        if (category && category !== 'Все') queryParams.push(`category=${encodeURIComponent(category)}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (minPrice) queryParams.push(`minPrice=${minPrice}`);
        if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
        if (sort) queryParams.push(`sort=${sort}`);
        const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
        const response = await axios.get(`${API_URL}/products${queryString}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});


export const createProductAdmin = createAsyncThunk(
    'products/createAdmin',
    async (productData, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } = {} } = getState();

            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('category', productData.category);
            formData.append('description', productData.description);
            formData.append('countInStock', productData.countInStock);

            if (productData.image) {
                formData.append('image', productData.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data', 
                    Authorization: `Bearer ${userInfo?.token}`
                }
            };

            const response = await axios.post(`${API_URL}/admin/products`, formData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateProductAdmin = createAsyncThunk(
    'products/updateAdmin',
    async ({ id, productData }, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } = {} } = getState();

            const formData = new FormData();
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('category', productData.category);
            formData.append('description', productData.description);
            formData.append('countInStock', productData.countInStock);

            if (productData.image && typeof productData.image !== 'string') {
                formData.append('image', productData.image);
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo?.token}`
                }
            };

            const response = await axios.put(`${API_URL}/admin/products/${id}`, formData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteProductAdmin = createAsyncThunk(
    'products/deleteAdmin',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } = {} } = getState();
            const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
            await axios.delete(`${API_URL}/admin/products/${id}`, config);
            return id; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearProductDetails: (state) => { state.product = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            // --- ДОБАВЬ ЭТОТ БЛОК ---
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload; // Теперь данные товара попадут в стейт!
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // ------------------------
            .addCase(createProductAdmin.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(updateProductAdmin.fulfilled, (state, action) => {
                const index = state.products.findIndex(p => p._id === action.payload._id);
                if (index !== -1) state.products[index] = action.payload;
            })
            .addCase(deleteProductAdmin.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload);
            });
    },
});

export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;