import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { z } from 'zod';
import { auth, db } from '../lib/firebase';
import type { Task } from '../types/Task';

const taskSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']).default('todo'),
  completed: z.boolean().default(false),
  createdAt: z.date().default(() => new Date()),
});

type NewTask = z.infer<typeof taskSchema>;

export function useTasks() {
  const userId = auth.currentUser?.uid;
  const queryClient = useQueryClient();

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const snapshot = await getDocs(collection(db, `users/${userId}/tasks`));
      return snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Task)
      );
    },
    enabled: !!userId,
  });

  const addTask = useMutation({
    mutationFn: async (
      data: Omit<z.input<typeof taskSchema>, 'id' | 'createdAt'>
    ) => {
      if (!userId) throw new Error('User not authenticated');
      const validated = taskSchema.parse({ ...data, createdAt: new Date() });
      await addDoc(collection(db, `users/${userId}/tasks`), validated);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const editTask = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Omit<NewTask, 'id' | 'createdAt'>>;
    }) => {
      if (!userId) throw new Error('User not authenticated');
      const validated = taskSchema.partial().parse(data);
      await updateDoc(doc(db, `users/${userId}/tasks/${id}`), validated);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');
      await deleteDoc(doc(db, `users/${userId}/tasks/${id}`));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const markComplete = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error('User not authenticated');
      await updateDoc(doc(db, `users/${userId}/tasks/${id}`), {
        completed: true,
        status: 'done',
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return {
    tasks,
    isLoading,
    error,
    addTask,
    editTask,
    deleteTask,
    markComplete,
  };
}
