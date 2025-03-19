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

export const addEmployee = createAsyncThunk(
  'employees/add',
  async (employee: Omit<Employee, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      await handleApiError(response);
      const data = await response.json();
      return data.employee;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to add employee');
    }
  },
);

export const updateEmployee = createAsyncThunk(
  'employees/update',
  async (employee: Employee, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/employees/${employee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(employee),
      });
      await handleApiError(response);
      const data = await response.json();
      return data.employee;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to update employee');
    }
  },
);

export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE',
      });
      await handleApiError(response);
      return id;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to delete employee');
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

    // Add employee
    handleAsyncActions<Employee>(builder, addEmployee, (state, action) => {
      state.employees.push(action.payload);
    });

    // Update employee
    handleAsyncActions<Employee>(builder, updateEmployee, (state, action) => {
      const index = state.employees.findIndex(
        (emp) => emp.id === action.payload.id,
      );
      if (index !== -1) state.employees[index] = action.payload;
    });

    // Delete employee
    handleAsyncActions<string>(builder, deleteEmployee, (state, action) => {
      state.employees = state.employees.filter(
        (emp) => emp.id !== action.payload,
      );
    });
  },
});

export default employeeSlice.reducer;
