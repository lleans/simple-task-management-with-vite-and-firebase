export interface Task {
  id: string;
  title: string; // Required, min length 3
  description?: string; // Optional
  status: 'todo' | 'in-progress' | 'done'; // Default: 'todo'
  createdAt: Date; // Auto-set
}
