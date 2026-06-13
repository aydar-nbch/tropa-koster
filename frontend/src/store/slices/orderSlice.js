import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.post(`${API_URL}/orders`, orderData, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/orders/myorders`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/orders/${id}`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchAllOrdersAdmin = createAsyncThunk(
    'orders/fetchAllAdmin',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/admin/orders`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const deliverOrderAdmin = createAsyncThunk(
    'orders/deliverAdmin',
    async (id, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.put(`${API_URL}/admin/orders/${id}/deliver`, {}, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

export const fetchSalesStatsAdmin = createAsyncThunk(
    'orders/fetchStatsAdmin',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/admin/stats`, config);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message
            );
        }
    }
);

const initialState = {
    orders: [],
    orderDetails: null,
    adminOrders: [],
    adminStats: null,
    loading: false,
    success: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {
        resetOrderState: (state) => {
            state.success = false;
            state.error = null;
        },
        clearOrderDetails: (state) => {
            state.orderDetails = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Создание заказа
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.orderDetails = action.payload;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })

            // Получение личной истории заказов
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Получение деталей конкретного заказа
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.orderDetails = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Админ: Получение всех заказов
            .addCase(fetchAllOrdersAdmin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrdersAdmin.fulfilled, (state, action) => {
                state.loading = false;
                state.adminOrders = action.payload;
            })
            .addCase(fetchAllOrdersAdmin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deliverOrderAdmin.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                state.adminOrders = state.adminOrders.map(o => o._id === updatedOrder._id ? updatedOrder : o);
                if (state.orderDetails && state.orderDetails._id === updatedOrder._id) {
                    state.orderDetails = updatedOrder;
                }
            })

            .addCase(fetchSalesStatsAdmin.fulfilled, (state, action) => {
                state.adminStats = action.payload;
            });
    }
});

export const { resetOrderState, clearOrderDetails } = orderSlice.actions;
export default orderSlice.reducer;