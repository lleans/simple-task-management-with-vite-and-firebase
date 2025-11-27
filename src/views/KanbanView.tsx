import { ButtonWrapper } from '@/components/ButtonWrapper';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { KanbanBoard, KanbanCard, KanbanCards, KanbanHeader, KanbanProvider } from '../components/ui/shadcn-io/kanban';
import { useTasks } from '../hooks/useTasks';
import { statuses } from '../lib/statuses';
import type { Task } from '../types/Task';


type KanbanData = Pick<Task, 'description'> & {
  id: string;
  column: Task['status'];
  name: string;
};

const DraggableCard = ({ task, onEdit, onDelete }: { task: Task; onEdit: (task: Task) => void; onDelete: (id: string) => void }) => {
  return (
    <>
      <CardHeader>
        <CardTitle className={`text-base break-all ${task.status === 'done' ? 'line-through' : ''}`}>{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-sm break-all">
        {task.description}
        <div className="flex space-x-2 mt-2" onPointerDown={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
          <ButtonWrapper tooltip="Edit task" variant='outline' onClick={() => onEdit(task)}>
            Edit
          </ButtonWrapper>
          <ButtonWrapper tooltip="Delete task" variant='destructive' onClick={() => onDelete(task.id)}>
            Delete
          </ButtonWrapper>
        </div>
      </CardContent>
    </>
  );
};

const KanbanView = ({ tasks, onEdit, onDelete }: {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}) => {
  const { editTask } = useTasks();

  const mapTasksToKanbanData = (taskList: Task[]): KanbanData[] => {
    return taskList.map((it) => ({
      column: it.status,
      id: it.id,
      name: it.title,
      description: it.description,
    }));
  };

  const [features, setFeatures] = useState<KanbanData[]>(() => mapTasksToKanbanData(tasks));
  const [prevTasks, setPrevTasks] = useState(tasks);

  if (tasks !== prevTasks) {
    setPrevTasks(tasks);
    setFeatures(mapTasksToKanbanData(tasks));
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    const overFeature = features.find(f => f.id === overId);

    let newStatus = overFeature?.column;
    if (!newStatus) {
      const overStatus = statuses.find(s => s.id === overId);
      if (overStatus) newStatus = overStatus.id;
    }

    // Dropped on column or card in another column
    if (newStatus && activeTask.status !== newStatus) {
      // Optimistic update
      setFeatures((prev) =>
        prev.map((feature) =>
          feature.id === activeTask.id ? { ...feature, column: newStatus! } : feature
        )
      );

      // Persist to backend
      editTask.mutate({ id: activeTask.id, data: { status: newStatus } });
    }
  };

  return (
    <KanbanProvider
      columns={[...statuses]}
      data={features}
      className='flex flex-col xl:flex-row gap-8 w-full h-full my-3'
      onDataChange={setFeatures}
      onDragEnd={handleDragEnd}
    >
      {(column) => (
        <KanbanBoard id={column.id} key={column.id}>
          <KanbanHeader>
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: column.color }}
              />
              <span>{column.name}</span>
            </div>
          </KanbanHeader>
          <KanbanCards id={column.id}>
            {(feature: (typeof features)[number]) => (
              <KanbanCard
                column={column.id}
                id={feature.id}
                key={feature.id}
                name={feature.name}
                className={`${feature.column === 'done' ? 'opacity-60' : ''} wrap-break-word my-3 overflow-x-auto`}
              >
                <DraggableCard task={tasks.find(task => task.id === feature.id)!} onEdit={onEdit} onDelete={onDelete} />
              </KanbanCard>
            )}
          </KanbanCards>
        </KanbanBoard>
      )}
    </KanbanProvider>
  );
};


export default KanbanView;
