import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import './index.css';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Auth, loginAction, loginLoader } from './routes/Auth.tsx';
import { Root, rootAction, rootLoader } from './routes/Root.tsx';
import { Note, noteAction, noteLoader } from './routes/Note.tsx';
import { NewNote, newNoteAction, newNoteLoader } from './routes/NewNote.tsx';
import { RootErrorBoundary } from './routes/error/RootErrorBoundary.tsx';
import ErrorBoundary from './routes/error/ErrorBoundary.tsx';

async function enableMocking() {
  if (import.meta.env.VITE_NODE_ENV !== 'development') {
    return;
  }

  const { worker } = await import('./mocks/browser');

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

enableMocking().then(() => {
  const router = createBrowserRouter(
    [
      {
        path: '/auth',
        loader: loginLoader,
        action: loginAction,
        element: <Auth />,
      },
      {
        path: '/',
        loader: rootLoader(queryClient),
        action: rootAction,
        element: <Root />,
        errorElement: <RootErrorBoundary />,
        children: [
          {
            path: '/note/:noteId',
            loader: noteLoader(queryClient),
            action: noteAction(queryClient),
            element: <Note />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: '/new-note',
            element: <NewNote />,
            loader: newNoteLoader,
            action: newNoteAction(queryClient),
            errorElement: <ErrorBoundary />,
          },
        ],
      },
      {
        path: '*',
        element: <Navigate to='/' />,
      },
    ],
    {
      future: {
        v7_normalizeFormMethod: true,
        v7_fetcherPersist: true,
        v7_relativeSplatPath: true,
        v7_partialHydration: true,
        unstable_skipActionErrorRevalidation: true,
      },
    },
  );

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />

        <div style={{ fontSize: '16px' }}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition='bottom-left' />
        </div>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
