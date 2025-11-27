export const statuses = [
  { id: 'todo', name: 'Todo', color: '#6B7280' },
  { id: 'in-progress', name: 'In Progress', color: '#F59E0B' },
  { id: 'done', name: 'Done', color: '#10B981' },
] as const;

export type Status = typeof statuses[number]['id'];
