import { Await, Form, Link, NavLink, Outlet, redirect, useLoaderData } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, defer } from '@remix-run/node';
import { Button } from '@/components/ui/button';
import { NoteType, notesSchema } from '@/model/note';
import { Suspense } from 'react';
import { authenticator } from '@/services/auth';

export const meta: MetaFunction = ({ error }) => [{ title: error ? 'Oh no!' : 'Notes' }];

export const action = async ({ request }: ActionFunctionArgs) => {
  await authenticator.logout(request, { redirectTo: '/auth' });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/auth',
  });

  if (!user) {
    let params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    throw redirect('/auth?' + params.toString());
  }

  try {
    return defer({
      notes: fetch(`http://localhost:3000/notes/${user}`).then(res => {
        return notesSchema.parse(res.json());
      }),
    });
  } catch (error) {
    throw new Error(`Error fetching notes - ${error}`);
  }
};

export default function Root() {
  let { notes } = useLoaderData<typeof loader>();

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
        <div className='mx-auto w-full max-w-6xl gap-2 flex justify-between'>
          <h1 className='text-3xl font-semibold'>Notes</h1>

          <Form method='post' replace>
            <Button type='submit'>Logout</Button>
          </Form>
        </div>
        <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
          <nav className='grid gap-4 text-sm text-muted-foreground' x-chunk='dashboard-04-chunk-0'>
            <Button asChild>
              <Link to='new-note'>Create Note</Link>
            </Button>

            <Suspense fallback={<p>Loading notes...</p>}>
              <Await resolve={notes}>
                {notes =>
                  notes.map((note: NoteType) => (
                    <NavLink key={note.id} to={`/note/${note.id}`}>
                      {({ isActive, isPending }) => (
                        <li
                          className={`${isActive ? 'text-blue-500' : ''} ${isPending && 'text-gray-500'}`}
                        >
                          {note.title}
                        </li>
                      )}
                    </NavLink>
                  ))
                }
              </Await>
            </Suspense>
          </nav>

          <div className='flex flex-1 items-center justify-center' x-chunk='dashboard-02-chunk-1'>
            <div className='flex flex-col items-center gap-1 text-start w-full'>
              <Outlet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
