import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import type { Note } from '../model/note';
import { useUserActions, useUserStore } from '../store/user';
import { Button } from '@/components/ui/button';

const Root = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const user = useUserStore(state => state.user);

  const { signOut } = useUserActions();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch(`/notes/${user}`);

        const notes = await response.json();

        setNotes(notes);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotes();
  }, [user]);

  const logoutHandler = () => {
    signOut();

    navigate('/auth');
  };

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

            {loading ? (
              <h2>Loading...</h2>
            ) : (
              notes.map(note => (
                <li key={note.id}>
                  <Link to={`/note/${note.id}`}>{note.title}</Link>
                </li>
              ))
            )}
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
