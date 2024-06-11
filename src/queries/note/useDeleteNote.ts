import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteQueries } from './noteQueriesFactory';

const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, noteId }: { user: string; noteId: string }) => {
      const response = await fetch(`/note/${user}/${noteId}`, {
        method: 'DELETE',
      });

      return response.json();
    },
    onSuccess: (_, { user }) =>
      queryClient.invalidateQueries({
        queryKey: noteQueries.list(user).queryKey,
      }),
  });
};

export default useDeleteNote;
