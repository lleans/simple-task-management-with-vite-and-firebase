'use client';

import { ButtonWrapper } from '@/components/ButtonWrapper';
import type { DragEndEvent } from '@/components/ui/shadcn-io/list';
import {
  ListGroup,
  ListHeader,
  ListItem,
  ListItems,
  ListProvider,
} from '@/components/ui/shadcn-io/list';
import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { statuses } from '../lib/statuses';
import type { Task } from '../types/Task';

function ListView({ tasks, onEdit, onDelete }: { tasks: Task[], onEdit: (task: Task) => void, onDelete: (id: string) => void }) {
  const { editTask } = useTasks();
  const [localTasks, setLocalTasks] = useState(tasks); // For optimistic updates
  const [prevTasks, setPrevTasks] = useState(tasks);

  // Update local state when prop changes
  if (tasks !== prevTasks) {
    setPrevTasks(tasks);
    setLocalTasks(tasks);
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const newStatus = statuses.find((status) => status.id === over.id);
    if (!newStatus) return;

    const taskId = active.id as string;
    const oldStatus = localTasks.find((task) => task.id === taskId)?.status;
    if (oldStatus === newStatus.id) return;

    // Optimistic update
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus.id as Task['status'] } : task
      )
    );

    // Persist to backend
    editTask.mutate({ id: taskId, data: { status: newStatus.id as Task['status'] } });
  };

  return (
    <ListProvider onDragEnd={handleDragEnd} className="flex gap-4 overflow-x-auto p-4">
      {statuses.map((status) => (
        <ListGroup id={status.id} key={status.id} className="min-w-80 w-full">
          <ListHeader color={status.color} name={status.name} />
          <ListItems>
            {localTasks
              .filter((task) => task.status === status.id)
              .map((task, index) => (
                <ListItem
                  id={task.id}
                  index={index}
                  key={task.id}
                  name={task.title}
                  parent={task.status}
                  className="p-4"
                >
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <div className="flex-1">
                          <h3 className={`font-semibold text-sm break-all ${task.status === 'done' ? 'line-through' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 break-all">{task.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1" onPointerDown={(e) => e.stopPropagation()}>
                        <ButtonWrapper tooltip="Edit task" variant="outline" size="sm" onClick={() => onEdit(task)}>
                          Edit
                        </ButtonWrapper>
                        <ButtonWrapper tooltip="Delete task" variant="destructive" size="sm" onClick={() => onDelete(task.id)}>
                          Delete
                        </ButtonWrapper>
                      </div>
                    </div>
                  </div>
                </ListItem>
              ))}
          </ListItems>
        </ListGroup>
      ))}
    </ListProvider>
  );
}

export default ListView;
