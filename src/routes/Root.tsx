import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUserActions, useUserStore } from '../store/user';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { noteQueries } from '@/queries/note/noteQueriesFactory';

const Root = () => {
  const user = useUserStore(state => state.user);

  const { data: notes, isLoading, isError } = useQuery(noteQueries.list(user!));

  const { signOut } = useUserActions();

  const navigate = useNavigate();

  const logoutHandler = () => {
    signOut();

    navigate('/auth');
  };

  const notesContent = (() => {
    if (isLoading) {
      return <h2>Loading...</h2>;
    }

    if (isError) {
      return <h2>Notes error</h2>;
    }

    return notes?.map(note => (
      <li key={note.id}>
        <Link to={`/note/${note.id}`}>{note.title}</Link>
      </li>
    ));
  })();

  return (
    <div className='flex min-h-screen w-full flex-col'>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10'>
        <div className='mx-auto w-full max-w-6xl gap-2 flex justify-between'>
          <h1 className='text-3xl font-semibold'>Notes</h1>

          <Button type='button' onClick={logoutHandler}>
            Logout
          </Button>
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

export default Root;
