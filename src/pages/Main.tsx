import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import type { Task } from '../types/Task';
import KanbanView from '../views/KanbanView';
import ListView from '../views/ListView';

import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/animate-ui/components/radix/alert-dialog';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { signOut } from 'firebase/auth';
import { TaskDialog } from '../components/AddTaskDialog';
import { Button } from '../components/animate-ui/components/buttons/button';
import { ButtonWrapper } from '../components/ButtonWrapper';
import { TypographyH1 } from '../components/ui/typography/heading1';
import { TypographyMuted } from '../components/ui/typography/muted';
import { auth } from '../lib/firebase';

function Main() {
  const { tasks, isLoading, addTask, editTask, deleteTask } = useTasks();
  const [tab, setTab] = useState<'kanban' | 'list'>('list');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [dialogTask, setDialogTask] = useState<Task | null>(null);

  // Delete Alert State
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  const openCreateDialog = () => {
    setDialogMode('create');
    setDialogTask(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setDialogMode('edit');
    setDialogTask(task);
    setIsDialogOpen(true);
  };

  const openDeleteAlert = (taskId: string) => {
    setDeleteTaskId(taskId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTaskId) {
      await deleteTask.mutateAsync(deleteTaskId);
      setIsDeleteAlertOpen(false);
      setDeleteTaskId(null);
    }
  };

  const handleDialogSubmit = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (dialogMode === 'create') {
      addTask.mutate(taskData);
    } else if (dialogTask) {
      editTask.mutate({ id: dialogTask.id, data: taskData });
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading Tasks...</div>;

  return (
    <div className="flex flex-col justify-center items-center p-16 min-h-screen w-full">
      <header className="w-full max-w-4xl flex flex-col justify-between items-center gap-8">
        <div className='flex flex-col gap-4'>
          <TypographyH1>Task Management - {tab.charAt(0).toUpperCase() + tab.slice(1)} View</TypographyH1>
          <TypographyMuted>Select a view to manage your tasks effectively.</TypographyMuted>
        </div>
        <div className="flex items-center space-x-2">
          <ButtonWrapper tooltip='Add Task' onClick={openCreateDialog}>Add Task</ButtonWrapper>
          <Button variant='outline' onClick={() => signOut(auth)}>
            Logout
          </Button>
        </div>
      </header>
      <Tabs className="w-full h-full p-2 md:p-4 xl:p-16" value={tab} onValueChange={(value: string) => setTab(value as 'list' | 'kanban')}>
        <TabsList className="justify-center items-center w-full">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="kanban">Kanban View</TabsTrigger>
        </TabsList>
        <Card className="shadow-none py-0 h-full">
          <TabsContents className="py-6 h-full">
            <TabsContent value="list" className="h-full">
              <CardContent className="h-full">
                <ListView tasks={tasks || []} onEdit={openEditDialog} onDelete={openDeleteAlert} />
              </CardContent>
            </TabsContent>
            <TabsContent value="kanban" className="h-full">
              <CardContent className="h-full">
                <KanbanView tasks={tasks || []} onEdit={openEditDialog} onDelete={openDeleteAlert} />
              </CardContent>
            </TabsContent>
          </TabsContents>
        </Card>
      </Tabs>
      <TaskDialog
        mode={dialogMode}
        task={dialogTask}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
      />
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Main;
