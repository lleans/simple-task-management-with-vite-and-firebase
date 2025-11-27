import { auth } from '@/lib/firebase';
import { getStrictContext } from '@/lib/get-strict-context';
import type { User } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

interface AuthContextType {
  user: User | null | undefined;
  loading: boolean;
  error: Error | undefined;
}

const [Provider, useAuthContext] = getStrictContext<AuthContextType>('Auth');

export { useAuthContext };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Provider value={{ user, loading, error }}>
      {children}
    </Provider>
  );
}
