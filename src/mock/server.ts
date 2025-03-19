import { createServer, Model, Registry } from 'miragejs';
import { ModelDefinition, AnyModels } from 'miragejs/-types';
import Schema from 'miragejs/orm/schema';
import { Employee } from '../types/Employee';

const EmployeeModel: ModelDefinition<Employee> = Model.extend({});

interface AppModels extends AnyModels {
  employee: typeof EmployeeModel;
}
type AppRegistry = Registry<AppModels, Record<string, never>>;
type AppSchema = Schema<AppRegistry>;

export function makeServer() {
  createServer({
    models: {
      employee: EmployeeModel,
    },

    seeds(server) {
      [
        {
          id: '1',
          name: 'John Doe',
          role: 'Developer',
          email: 'john@example.com',
        },
        {
          id: '2',
          name: 'Jane Smith',
          role: 'Designer',
          email: 'jane@example.com',
        },
        {
          id: '3',
          name: 'Robert Brown',
          role: 'Manager',
          email: 'robert@example.com',
        },
        {
          id: '4',
          name: 'Emily Johnson',
          role: 'HR',
          email: 'emily@example.com',
        },
        {
          id: '5',
          name: 'Michael Lee',
          role: 'DevOps',
          email: 'michael@example.com',
        },
        {
          id: '6',
          name: 'Sarah Wilson',
          role: 'QA',
          email: 'sarah@example.com',
        },
        {
          id: '7',
          name: 'David Miller',
          role: 'Product Owner',
          email: 'david@example.com',
        },
        {
          id: '8',
          name: 'Emma Davis',
          role: 'Marketing',
          email: 'emma@example.com',
        },
        {
          id: '9',
          name: 'Daniel White',
          role: 'Support',
          email: 'daniel@example.com',
        },
        {
          id: '10',
          name: 'Sophia Martin',
          role: 'Finance',
          email: 'sophia@example.com',
        },
      ].forEach((emp) => server.create('employee', emp));
    },

    routes() {
      this.namespace = 'api';

      this.get('/employees', (schema: AppSchema) => {
        return schema.all('employee');
      });
    },
  });
}
