import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntDesignApp, ConfigProvider } from 'antd';
import App from './App';
import './index.css';
import { AuthProvider } from './features/auth/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#155eef',
              borderRadius: 10,
              fontFamily:
                'Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
              colorBgLayout: '#f5f7fb',
            },
            components: {
              Button: {
                controlHeight: 42,
              },
              Input: {
                controlHeight: 42,
              },
            },
          }}
        >
          <ConfigProvider
  theme={{
    token: {
      colorPrimary: '#155eef',
      borderRadius: 10,
      fontFamily:
        'Inter, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
      colorBgLayout: '#f5f7fb',
    },
  }}
>
  <AntDesignApp>
  <AuthProvider>
    <App />
  </AuthProvider>
</AntDesignApp>
</ConfigProvider>
        </ConfigProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);