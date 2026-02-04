import { RouterProvider } from 'react-router';
import './App.css';
import router from './app-router';
import { AlertProvider } from './context/AlertContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <RouterProvider router={router} />
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;

