import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { addEmployee, updateEmployee } from '../store/employeeSlice';
import { Employee } from '../types/Employee';
import { useAppDispatch } from '../store/store';
import { toast } from 'react-hot-toast';

interface EmployeeFormProps {
  employee?: Employee | null;
  viewOnly: boolean;
  onClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  viewOnly,
  onClose,
}) => {
  const dispatch = useAppDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role: Yup.string().required('Role is required'),
  });

  return (
    <Formik
      initialValues={employee || { name: '', email: '', role: '' }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (employee) {
            await dispatch(updateEmployee({ ...employee, ...values }));
            toast.success('Employee updated successfully.');
          } else {
            await dispatch(addEmployee(values));
            toast.success('Employee saved successfully.');
          }
          onClose();
        } catch (error: any) {
          toast.error(error?.message || 'Failed to save employee.');
        }
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Field
              name="name"
              className="border p-2 w-full"
              disabled={viewOnly}
            />
            <ErrorMessage
              name="name"
              className="text-red-500 text-xs"
              component="div"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Field
              name="email"
              type="email"
              className="border p-2 w-full"
              disabled={viewOnly}
            />
            <ErrorMessage
              name="email"
              className="text-red-500 text-xs"
              component="div"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Role</label>
            <Field
              name="role"
              className="border p-2 w-full"
              disabled={viewOnly}
            />
            <ErrorMessage
              name="role"
              className="text-red-500 text-xs"
              component="div"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={isSubmitting}
              hidden={viewOnly}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default EmployeeForm;
