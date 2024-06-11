import { useNavigate, useParams } from 'react-router-dom';
import { Trash } from 'lucide-react';
import { useUserStore } from '../store/user';
import type { Note } from '../model/note';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/NotFound';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { noteQueries } from '@/queries/note/noteQueriesFactory';
import useDeleteNote from '@/queries/note/useDeleteNote';

const Note = () => {
  const user = useUserStore(state => state.user);

  const { noteId } = useParams();

  const { data: note, isLoading, isError } = useQuery(noteQueries.note(user!, noteId));

  const navigate = useNavigate();

  const { mutate: deleteNote } = useDeleteNote();

  const deleteNoteHandler = () => {
    if (user && noteId) {
      deleteNote(
        { user, noteId },
        {
          onSuccess: () => navigate('/new-note'),
          onError: error => console.log(error),
        },
      );
    }
  };

  if (isLoading) {
    return <h2>Loading note...</h2>;
  }

  if (isError) {
    return <h2>Note error</h2>;
  }

  if (!note) {
    return <NotFound resource='note' />;
  }

  return (
    <Card className='w-full overflow-hidden' x-chunk='dashboard-05-chunk-4'>
      <CardHeader className='flex flex-row items-start bg-muted/50'>
        <div className='grid gap-0.5'>
          <CardTitle className='group flex items-center gap-2 text-lg'>{note?.title}</CardTitle>
          <CardDescription>{note?.message}</CardDescription>
        </div>
        <div className='ml-auto flex items-center gap-1'>
          <Button
            type='button'
            size='icon'
            variant='outline'
            className='h-8 w-8'
            onClick={deleteNoteHandler}
          >
            <Trash className='h-3.5 w-3.5' />
            <span className='sr-only'>Delete</span>
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default Note;
