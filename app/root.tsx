import {
  Links,
  Meta,
  Outlet,
  Scripts,
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from '@remix-run/react';
import { Button } from './components/ui/button';
import '@/tailwind.css';

export default function Component() {
  return (
    <>
      <Outlet />
      <Meta />
      <Links />
      <Scripts />
    </>
  );
}

export function HydrateFallback() {
  return (
    <>
      <p>Loading...</p>
      <Scripts />
    </>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();

  const navigate = useNavigate();

  let errorMessage = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className='flex flex-col items-center justify-center gap-2 py-8'>
          <h1>Oops!</h1>

          <p>Sorry, an unexpected error has occurred</p>

          <p>
            <i>{errorMessage}</i>
          </p>

          <Button onClick={() => navigate('/')}>Reload page</Button>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
