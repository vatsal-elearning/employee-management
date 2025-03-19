import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { fetchEmployees } from '../store/employeeSlice';
import { RootState, useAppDispatch } from '../store/store';
import { Employee } from '../types/Employee';
import { toast } from 'react-hot-toast';

const EmployeeTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useSelector(
    (state: RootState) => state.employees,
  );
  const [searchText, setSearchText] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  // Fetch employees
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Show error if happens during load
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Filter employees based on search input
  useEffect(() => {
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          emp.role?.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  }, [searchText, employees]);

  const columns = [
    { name: 'Name', selector: (row: Employee) => row.name, sortable: true },
    { name: 'Email', selector: (row: Employee) => row.email },
    { name: 'Role', selector: (row: Employee) => row.role },
    {
      name: 'Actions',
      cell: (row: Employee) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500"
            onClick={() => {
              return;
            }}
          >
            Edit
          </button>
          <button
            className="text-red-500"
            onClick={() => {
              return;
            }}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <button
          className="bg-green-500 text-white p-2 rounded"
          onClick={() => {
            return;
          }}
        >
          Add Employee
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 border rounded"
        />
      </div>
      {
        /* Loading State */
        loading && (
          <p className="text-blue-500 text-center">Loading employees...</p>
        )
      }

      <DataTable columns={columns} data={filteredEmployees} pagination />
    </div>
  );
};

export default EmployeeTable;
