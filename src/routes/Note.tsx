import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
  useNavigation,
} from 'react-router-dom';
import invariant from 'tiny-invariant';
import { Trash } from 'lucide-react';
import { useUserStore } from '../store/user';
import { Button } from '@/components/ui/button';
import NotFound from '@/components/NotFound';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { QueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { noteQueries } from '@/queries/note/noteQueriesFactory';

export const noteAction =
  (queryClient: QueryClient) =>
  async ({ request, params }: ActionFunctionArgs) => {
    let formData = await request.formData();

    let user = formData.get('user') as string | null;

    invariant(user, 'User not found');
    invariant(params.noteId, 'Note id not found');

    await fetch(`/note/${user}/${params.noteId}`, {
      method: 'DELETE',
    });

    queryClient.removeQueries({ queryKey: noteQueries.note(user, params.noteId).queryKey });
    await queryClient.invalidateQueries({ queryKey: noteQueries.list(user).queryKey });

    throw redirect('/new-note');
  };

export const noteLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    let user = useUserStore.getState().user;

    invariant(user, 'User not found');
    invariant(params.noteId, 'Note id not found');

    try {
      await queryClient.ensureQueryData(noteQueries.note(user, params.noteId));

      return { user, noteId: params.noteId };
    } catch (error) {
      throw new Error(`Error fetching notes - ${error}`);
    }
  };

export const Note = () => {
  let { user, noteId } = useLoaderData() as Awaited<ReturnType<ReturnType<typeof noteLoader>>>;

  const { data: note } = useSuspenseQuery(noteQueries.note(user, noteId));

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
            <Input type='hidden' name='user' value={user} />
            <Button type='submit' size='icon' variant='outline' className='h-8 w-8'>
              <Trash className='h-3.5 w-3.5' />
              <span className='sr-only'>Delete</span>
            </Button>
          </Form>
        </div>
      </CardHeader>
    </Card>
  );
};
