import { Button } from '@/components/ui/button';
import type { FC } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

export const RootErrorBoundary: FC = () => {
  let error = useRouteError();

  let errorMessage = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 py-8'>
      <h1>Oops!</h1>

      <p>Sorry, an unexpected error has occurred</p>

      <p>
        <i>{errorMessage}</i>
      </p>

      <Button onClick={() => (window.location.href = '/')}>Reload page</Button>
    </div>
  );
};
