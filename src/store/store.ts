import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './employeeSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: { employees: employeeReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
