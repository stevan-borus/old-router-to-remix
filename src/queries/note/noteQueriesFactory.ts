import { Note } from '@/model/note';
import { queryOptions } from '@tanstack/react-query';

export const noteQueries = {
  all: ['noteQueries'],
  list: (user: string) =>
    queryOptions({
      queryKey: [...noteQueries.all, 'list', user],
      queryFn: async () => {
        const response = await fetch(`/notes/${user}`);

        return (await response.json()) as Note[];
      },
    }),
  note: (user: string, noteId?: string) =>
    queryOptions({
      queryKey: [...noteQueries.all, 'note', user, noteId],
      queryFn: async () => {
        const response = await fetch(`/note/${user}/${noteId}`);

        return (await response.json()) as Note;
      },
      enabled: Boolean(noteId),
    }),
} as const;
