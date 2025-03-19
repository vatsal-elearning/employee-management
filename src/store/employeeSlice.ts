import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Employee } from '../types/Employee';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
};

// Helper function for error handling
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || 'Something went wrong!');
  }
};

// Helper function to handle pending and rejected cases
const handleAsyncActions = <T>(
  builder: any,
  asyncThunk: any,
  successHandler: (state: EmployeeState, action: PayloadAction<T>) => void,
) => {
  builder
    .addCase(asyncThunk.pending, (state: EmployeeState) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(
      asyncThunk.fulfilled,
      (state: EmployeeState, action: PayloadAction<T>) => {
        state.loading = false;
        successHandler(state, action);
      },
    )
    .addCase(
      asyncThunk.rejected,
      (state: EmployeeState, action: PayloadAction<T>) => {
        state.loading = false;
        state.error = action.payload as string;
      },
    );
};

// Async actions
export const fetchEmployees = createAsyncThunk(
  'employees/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/employees');
      await handleApiError(response);
      const data = await response.json();
      return data.employees;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch employees');
    }
  },
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch employees
    handleAsyncActions<Employee[]>(builder, fetchEmployees, (state, action) => {
      state.employees = action.payload;
    });
  },
});

export default employeeSlice.reducer;
