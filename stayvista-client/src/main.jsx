import ReactDOM from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import AuthProvider from './providers/AuthProvider';
import { router } from './routes/Routes';
import { Toaster } from 'react-hot-toast';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { HelmetProvider } from 'react-helmet-async';


const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
)
