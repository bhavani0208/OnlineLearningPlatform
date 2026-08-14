import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCoursesAPI, getCourseByIdAPI } from '../../services/courseService';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const res = await getCoursesAPI(params);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch courses');
  }
});

export const fetchCourseById = createAsyncThunk('courses/fetchById', async (id, { rejectWithValue }) => {
  try {
    const res = await getCourseByIdAPI(id);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Course not found');
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],
    selectedCourse: null,
    total: 0,
    totalPages: 0,
    page: 1,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedCourse: (state) => { state.selectedCourse = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.page = action.payload.page;
      })
      .addCase(fetchCourses.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchCourseById.pending, (state) => { state.loading = true; })
      .addCase(fetchCourseById.fulfilled, (state, action) => { state.loading = false; state.selectedCourse = action.payload; })
      .addCase(fetchCourseById.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearSelectedCourse } = courseSlice.actions;
export default courseSlice.reducer;
