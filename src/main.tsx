import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { Outlet } from 'react-router';
import Layout from './components/layout/layout.tsx';
import Authorization from './components/pages/Authorization.tsx';
import Settings from './components/pages/Settings.tsx';
import Shipment from './components/pages/Shipment.tsx';
import ViewDB from './components/pages/ViewDB.tsx';
import { Toaster } from 'sonner';
import SyncPage from './components/pages/SyncPage.tsx';
import Nomenclature from './components/pages/Nomenclature.tsx';
import Counterparties from './components/pages/Counterparties.tsx';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { index: true, element: <App />, handle: { title: 'Прием отчетов' } },
      { path: 'authorization', element: <Authorization />, handle: { title: 'Авторизация' } },
      { path: 'database', element: <ViewDB />, handle: { title: 'Просмотр базы данных' } },
      // { path: 'profile', element: <Profile /> },
      { path: 'shipment', element: <Shipment />, handle: { title: 'Отгрузка' } },
      { path: 'sync', element: <SyncPage />, handle: { title: 'Синхронизация' } },
      { path: 'counterparties', element: <Counterparties />, handle: { title: 'Контрагенты' } },
      { path: 'nomenclature', element: <Nomenclature />, handle: { title: 'Номенкулатура' } },
      // { path: 'settings', element: <Settings />, handle: { title: 'Настройки' } },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </QueryClientProvider>
    ,
  </StrictMode>,
);
