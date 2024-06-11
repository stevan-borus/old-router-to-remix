import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noteQueries } from './noteQueriesFactory';

const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      title,
      message,
    }: {
      user: string;
      title: string;
      message: string;
    }) => {
      const response = await fetch(`/note`, {
        method: 'POST',
        body: JSON.stringify({ user, title, message }),
      });

      return response.json();
    },
    onSuccess: (_, { user }) =>
      queryClient.invalidateQueries({
        queryKey: noteQueries.list(user).queryKey,
      }),
  });
};

export default useAddNote;
