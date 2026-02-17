// Generate sample employee data with realistic variations
// This module creates a dataset of employees with randomized attributes
// Used for testing and demonstration purposes in the filter application

import type { Employee } from '../types/data.types';

// Name pools for realistic employee generation
// Using diverse names to create authentic-looking records
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

// Company departments - represents organizational divisions
const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];

// Job positions - diverse roles across different departments
const roles = [
  'Senior Developer', 'Junior Developer', 'Team Lead', 'Manager',
  'Sales Representative', 'Marketing Specialist', 'HR Coordinator',
  'Financial Analyst', 'Operations Manager', 'Product Manager',
  'Designer', 'Data Analyst', 'DevOps Engineer', 'QA Engineer',
];

// Technical and soft skills for employees
// Covers both backend, frontend, cloud, and database technologies
const skills = [
  'React', 'TypeScript', 'Node.js', 'GraphQL', 'Python', 'Java',
  'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL', 'Redis',
  'Angular', 'Vue.js', 'Go', 'Rust', 'C++', 'Swift',
];

// Geographic distribution of employees - major US cities
const cities = [
  'San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Boston',
  'Seattle', 'Austin', 'Denver', 'Portland', 'Miami', 'Atlanta',
  'Dallas', 'Houston', 'Phoenix', 'Philadelphia',
];

// US state abbreviations for geographic data
const states = [
  'CA', 'NY', 'IL', 'MA', 'WA', 'TX', 'CO', 'OR', 'FL', 'GA', 'AZ', 'PA',
];

/**
 * Generate a random integer between min and max (inclusive on both ends)
 * Used for salary ranges, project counts, and other numeric properties
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random integer between min and max
 */
const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Select a random element from an array
 * Used frequently to pick random names, departments, cities, etc.
 * @typeparam T - The type of elements in the array
 * @param arr - Array to select from
 * @returns A random element from the array
 */
const randomElement = <T,>(arr: T[]): T => {
  // Return a random element by selecting a random index
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generate a random date between start and end dates
 * Used to create realistic join dates and review dates
 * @param start - Start date (inclusive)
 * @param end - End date (inclusive)
 * @returns Date string in YYYY-MM-DD format
 */
const randomDate = (start: Date, end: Date): string => {
  // Generate a random time between start and end dates using linear interpolation
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(randomTime);
  // Return in YYYY-MM-DD format for consistency
  return date.toISOString().split('T')[0];
};

/**
 * Generate a random set of skills for an employee
 * Ensures variety while preventing duplicates
 * @returns Array of 2-6 unique skills
 */
const randomSkills = (): string[] => {
  // Decide how many skills this employee should have (2-6)
  const count = random(2, 6);
  // Use a Set to automatically prevent duplicate skills
  const selected = new Set<string>();
  
  // Keep adding random skills until we reach the target count
  while (selected.size < count) {
    selected.add(randomElement(skills));
  }
  
  // Convert Set back to array for the Employee record
  return Array.from(selected);
};

/**
 * Generate sample employee records for the application
 * Creates realistic data with varied departments, salaries, and attributes
 * 
 * @param count - Number of employees to generate (default: 50)
 * @returns Array of generated Employee objects
 * 
 * @example
 * const employees = generateEmployees(60);
 * // Generates 60 realistic employee records with all required fields
 */
export const generateEmployees = (count: number = 50): Employee[] => {
  const employees: Employee[] = [];

  // Generate each employee record with randomized attributes
  for (let i = 1; i <= count; i++) {
    // Randomly select a name combination for variety
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    
    // Randomly assign company attributes
    const department = randomElement(departments);
    const city = randomElement(cities);
    const state = randomElement(states);

    // Create the employee record with realistic data
    employees.push({
      // Unique identifier for each employee
      id: i,
      // Full name combining first and last names
      name: `${firstName} ${lastName}`,
      // Generate consistent email format from name components
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      // Assigned company division
      department,
      // Current job role/position
      role: randomElement(roles),
      // Salary ranges from $50,000 to $200,000 in $1,000 increments
      salary: random(50, 200) * 1000,
      // Join dates distributed across 2018-2024 for tenure variation
      joinDate: randomDate(new Date(2018, 0, 1), new Date(2024, 11, 31)),
      // 85% of employees are active, 15% are inactive (simulating attrition)
      isActive: Math.random() > 0.15,
      // Each employee has 2-6 unique skills (no duplicates)
      skills: randomSkills(),
      // Include nested address information for testing nested field filtering
      address: {
        city,
        state,
        country: 'USA',
      },
      // Number of current projects assigned (0-10 projects per employee)
      projects: random(0, 10),
      // Last performance review date distributed across 2023-2024
      lastReview: randomDate(new Date(2023, 0, 1), new Date(2024, 11, 31)),
      // Performance rating from 2.5 to 5.0 in 0.1 increments
      // Math.round(...*10)*10/10 creates nice decimal values
      performanceRating: Math.round((random(25, 50) / 10) * 10) / 10,
    });
  }

  return employees;
};

// Generate and export the default dataset
// This creates 60 realistic employee records used throughout the application
export const employees = generateEmployees(60);
