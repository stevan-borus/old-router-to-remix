import {
  Form,
  Link,
  LoaderFunctionArgs,
  NavLink,
  Outlet,
  redirect,
  useLoaderData,
} from 'react-router-dom';
import { useUserStore } from '../store/user';
import { Button } from '@/components/ui/button';
import { notesSchema } from '@/model/note';

export const rootAction = async () => {
  useUserStore.getState().signOut();

  throw redirect('/auth');
};

export const rootLoader = async ({ request }: LoaderFunctionArgs) => {
  let user = useUserStore.getState().user;

  if (!user) {
    let params = new URLSearchParams();
    params.set('from', new URL(request.url).pathname);
    throw redirect('/auth?' + params.toString());
  }

  try {
    let response = await fetch(`/notes/${user}`);

    let notes = await response.json();

    return notesSchema.safeParse(notes);
  } catch (error) {
    throw new Error(`Error fetching notes - ${error}`);
  }
};

export const Root = () => {
  let data = useLoaderData() as Awaited<ReturnType<typeof rootLoader>>;

  let notesContent = (() => {
    if (!data.success) {
      return <h2>Notes error</h2>;
    }

    return data.data.map(note => (
      <NavLink key={note.id} to={`/note/${note.id}`}>
        {({ isActive, isPending }) => (
          <li className={`${isActive ? 'text-blue-500' : ''} ${isPending && 'text-gray-500'}`}>
            {note.title}
          </li>
        )}
      </NavLink>
    ));
  })();

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
        <div className='mx-auto w-full max-w-6xl gap-2 flex justify-between'>
          <h1 className='text-3xl font-semibold'>Notes</h1>

          <Form method='POST' replace>
            <Button type='submit'>Logout</Button>
          </Form>
        </div>
        <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
          <nav className='grid gap-4 text-sm text-muted-foreground' x-chunk='dashboard-04-chunk-0'>
            <Button asChild>
              <Link to='new-note'>Create Note</Link>
            </Button>

            {notesContent}
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
};
