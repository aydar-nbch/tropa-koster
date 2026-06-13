import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const createProductReview = createAsyncThunk(
    'reviews/createProductReview',
    async ({ productId, review }, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const response = await axios.post(`${API_URL}/reviews/${productId}`, review, config);
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

export const fetchMyReviews = createAsyncThunk(
    'reviews/fetchMyReviews',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { user: { userInfo } } = getState();
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const response = await axios.get(`${API_URL}/reviews/myreviews`, config);
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

export const fetchProductReviews = createAsyncThunk(
    'reviews/fetchProductReviews',
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/reviews/product/${productId}`);
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
    loading: false,
    success: false,
    error: null,
    myReviews: [], 
    productReviews: [], 
};

const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        resetReviewState: (state) => {
            state.success = false;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProductReview.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.loading = false;
                state.success = true;
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            })
            .addCase(fetchMyReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.myReviews = action.payload;
            })
            .addCase(fetchMyReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.productReviews = action.payload; // Записываем отзывы в стейт
            })
            .addCase(fetchProductReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;
