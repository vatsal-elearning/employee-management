import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useSelector } from 'react-redux';
import { fetchEmployees, deleteEmployee } from '../store/employeeSlice';
import { RootState, useAppDispatch } from '../store/store';
import { Employee } from '../types/Employee';
import EmployeeForm from './EmployeeForm';
import { Button, Modal } from 'flowbite-react';
import { toast } from 'react-hot-toast';

const EmployeeTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { employees, loading, error } = useSelector(
    (state: RootState) => state.employees,
  );
  const [searchText, setSearchText] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

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

  // Open form modal
  const openModal = (employee: Employee | null = null, viewOnly = false) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    setViewOnly(viewOnly ? true : false);
  };

  // Close form modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setViewOnly(false);
  };

  // Open confirm delete modal
  const openConfirmModal = (id: string) => {
    setEmployeeToDelete(id);
    setIsConfirmModalOpen(true);
  };

  // Delete employee after confirmation
  const confirmDelete = async () => {
    try {
      if (employeeToDelete !== null) {
        await dispatch(deleteEmployee(employeeToDelete));
        setIsConfirmModalOpen(false);
        toast.success('Employee deleted successfully.');
      } else {
        toast.error('Record not found.');
      }
      setEmployeeToDelete(null);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete employee.');
    }
  };

  const columns = [
    { name: 'Name', selector: (row: Employee) => row.name, sortable: true },
    { name: 'Email', selector: (row: Employee) => row.email },
    { name: 'Role', selector: (row: Employee) => row.role },
    {
      name: 'Actions',
      cell: (row: Employee) => (
        <div className="flex gap-2">
          <button
            className="text-green-500"
            onClick={() => openModal(row, true)}
          >
            View
          </button>
          <button
            className="text-blue-500"
            onClick={() => openModal(row, false)}
          >
            Edit
          </button>
          <button
            className="text-red-500"
            onClick={() => openConfirmModal(row.id)}
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
          onClick={() => openModal(null)}
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
      {/* Modal for Add/Edit/View */}
      <Modal
        show={isModalOpen}
        onClose={closeModal}
        size="lg"
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
          <Modal.Header>
            {selectedEmployee
              ? viewOnly
                ? 'View Employee'
                : 'Edit Employee'
              : 'Add Employee'}
          </Modal.Header>
          <Modal.Body>
            <EmployeeForm
              employee={selectedEmployee}
              onClose={closeModal}
              viewOnly={viewOnly}
            />
          </Modal.Body>
        </div>
      </Modal>
      {/* Confirm Delete Modal */}
      <Modal
        show={isConfirmModalOpen}
        onClose={() => {
          setEmployeeToDelete(null);
          setIsConfirmModalOpen(false);
        }}
        size="md"
        className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Modal.Header>Confirm Delete</Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this employee?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setEmployeeToDelete(null);
                setIsConfirmModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeTable;
