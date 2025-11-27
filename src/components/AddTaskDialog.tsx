import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/animate-ui/components/radix/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as React from 'react';
import type { Task } from '../types/Task';
import { Button } from './animate-ui/components/buttons/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select';

type TaskData = Omit<Task, 'id' | 'createdAt'>;

interface TaskDialogProps {
  mode: 'create' | 'edit';
  task?: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
}

export function TaskDialog({ mode, task, isOpen, onClose, onSubmit }: TaskDialogProps) {
  const [taskData, setTaskData] = React.useState<TaskData>({
    title: '',
    description: '',
    status: 'todo',
  });

  React.useEffect(() => {
    if (mode === 'edit' && task) {
      setTaskData({
        title: task.title,
        description: task.description || '',
        status: task.status,
      });
    } else {
      setTaskData({ title: '', description: '', status: 'todo' });
    }
  }, [mode, task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taskData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] gap-4">
        <form onSubmit={handleSubmit} className="grid gap-6">
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add New Task' : 'Edit Task'}</DialogTitle>
            <DialogDescription>
              {mode === 'create' ? 'Fill in the details to add a new task.' : 'Modify the task details.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={taskData.title}
                onChange={e => setTaskData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={taskData.description || ''}
                onChange={e => setTaskData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="status">Status</Label>
              <Select value={taskData.status} onValueChange={(value) => setTaskData(prev => ({ ...prev, status: value as TaskData['status'] }))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{mode === 'create' ? 'Add' : 'Update'} Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Export the old AddTaskDialog as deprecated for gradual migration if needed
export function AddTaskDialog({ onSubmit }: { onSubmit: (task: TaskData) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Add Task</Button>
      <TaskDialog
        mode="create"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={onSubmit}
      />
    </>
  );
}
