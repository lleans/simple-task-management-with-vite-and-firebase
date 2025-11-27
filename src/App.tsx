import { useAuthContext } from '@/context/auth-provider';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ThemeTogglerButton } from './components/animate-ui/components/buttons/theme-toggler';
import { TooltipProvider } from './components/animate-ui/primitives/animate/tooltip';
import { Spinner } from './components/ui/spinner';
import Auth from './pages/Auth';
import Main from './pages/Main';

function App() {
  const { user, loading } = useAuthContext();

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner className='size-8' /></div>;

  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth />} />
          <Route path="/" element={user ? <Main /> : <Navigate to="/auth" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
      <ThemeTogglerButton className='fixed bottom-4 right-4' />
    </TooltipProvider>
  );
}

export default App;
