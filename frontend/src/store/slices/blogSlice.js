import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchPosts = createAsyncThunk(
    'blog/fetchPosts',
    async (searchQuery = '', { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/posts?search=${encodeURIComponent(searchQuery)}`);
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

export const fetchPostById = createAsyncThunk(
    'blog/fetchPostById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/posts/${id}`);
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
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
};

const blogSlice = createSlice({
    name: 'blog',
    initialState,
    reducers: {
        clearCurrentPost: (state) => {
            state.currentPost = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchPostById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPostById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentPost = action.payload;
            })
            .addCase(fetchPostById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCurrentPost } = blogSlice.actions;
export default blogSlice.reducer;