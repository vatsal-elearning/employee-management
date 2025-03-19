import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import EmployeeTable from './components/EmployeeTable';
import { makeServer } from './mock/server';

makeServer();

const App: React.FC = () => (
  <Provider store={store}>
    <EmployeeTable />
  </Provider>
);

export default App;
