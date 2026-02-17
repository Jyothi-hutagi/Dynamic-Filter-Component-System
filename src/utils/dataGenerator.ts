// Generate sample employee data

import type { Employee } from '../types/data.types';

const firstNames = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa',
  'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Linda', 'Thomas',
  'Patricia', 'Charles', 'Elizabeth', 'Daniel', 'Susan', 'Matthew', 'Jessica',
  'Anthony', 'Karen', 'Donald', 'Nancy', 'Mark', 'Betty', 'Paul', 'Margaret',
  'Steven', 'Sandra', 'Andrew', 'Ashley', 'Kenneth', 'Dorothy', 'Joshua',
  'Kimberly', 'Kevin', 'Carol', 'Brian', 'Amanda', 'George', 'Melissa',
  'Edward', 'Deborah', 'Ronald', 'Stephanie', 'Timothy', 'Rebecca',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
];

const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];

const roles = [
  'Senior Developer', 'Junior Developer', 'Team Lead', 'Manager',
  'Sales Representative', 'Marketing Specialist', 'HR Coordinator',
  'Financial Analyst', 'Operations Manager', 'Product Manager',
  'Designer', 'Data Analyst', 'DevOps Engineer', 'QA Engineer',
];

const skills = [
  'React', 'TypeScript', 'Node.js', 'GraphQL', 'Python', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis',
  'Angular', 'Vue.js', 'Go', 'Rust', 'C++', 'Swift',
];

const cities = [
  'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Boston',
  'Seattle', 'Austin', 'Denver', 'Portland', 'Miami', 'Atlanta',
  'Dallas', 'Houston', 'Phoenix', 'Philadelphia',
];

const states = [
  'CA', 'NY', 'IL', 'MA', 'WA', 'TX', 'CO', 'OR', 'FL', 'GA', 'AZ', 'PA',
];

const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomElement = <T,>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split('T')[0];
};

const randomSkills = (): string[] => {
  const count = random(2, 6);
  const selected = new Set<string>();
  while (selected.size < count) {
    selected.add(randomElement(skills));
  }
  return Array.from(selected);
};

export const generateEmployees = (count: number = 50): Employee[] => {
  const employees: Employee[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const department = randomElement(departments);
    const city = randomElement(cities);
    const state = randomElement(states);

    employees.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      role: randomElement(roles),
      salary: random(50, 200) * 1000,
      joinDate: randomDate(new Date(2018, 0, 1), new Date(2024, 11, 31)),
      isActive: Math.random() > 0.15, // 85% active
      skills: randomSkills(),
      address: {
        city,
        state,
        country: 'USA',
      },
      projects: random(0, 10),
      lastReview: randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
      performanceRating: Math.round((random(25, 50) / 10) * 10) / 10, // 2.5 to 5.0
    });
  }

  return employees;
};

export const employees = generateEmployees(60);