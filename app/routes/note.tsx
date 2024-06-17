import {
  Form,
  isRouteErrorResponse,
  redirect,
  useLoaderData,
  useNavigation,
  useRouteError,
} from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, json } from '@remix-run/node';
import invariant from 'tiny-invariant';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NotFound from '@/components/NotFound';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { noteSchema } from '@/model/note';
import { authenticator } from '@/services/auth';

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  { title: `Note ${data?.note.title}` },
];

export const action = async ({ request, params }: ActionFunctionArgs) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  invariant(params.noteId, 'Note id not found');

  try {
    await fetch(`http://localhost:3000/note/${user}/${params.noteId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    throw new Error(`Failed to delete note - ${err}`);
  }

  throw redirect('/new-note');
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  invariant(params.noteId, 'Note id not found');

  try {
    let response = await fetch(`http://localhost:3000/note/${user}/${params.noteId}`);

    let note = await response.json();

    return json({ note: noteSchema.parse(note) });
  } catch (error) {
    throw new Error(`Error fetching note - ${error}`);
  }
};

export default function Note() {
  let { note } = useLoaderData<typeof loader>();

  let navigation = useNavigation();

  let isLoading = navigation.state === 'loading';

  if (!note) {
    return <NotFound resource='note' />;
  }

  return (
    <Card
      className={`w-full overflow-hidden ${isLoading && 'opacity-30'}`}
      x-chunk='dashboard-05-chunk-4'
    >
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>{note?.title}</CardTitle>
          <CardDescription>{note?.message}</CardDescription>
        </div>
        <div className='ml-auto flex items-center gap-1'>
          <Form method='POST'>
            <Button type='submit' size='icon' variant='outline' className='h-8 w-8'>
              <Trash className='h-3.5 w-3.5' />
              <span className='sr-only'>Delete</span>
            </Button>
          </Form>
        </div>
      </CardHeader>
    </Card>
  );
}

export function ErrorBoundary() {
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
    </div>
  );
}
