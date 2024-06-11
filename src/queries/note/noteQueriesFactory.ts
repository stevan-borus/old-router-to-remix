import { NoteType } from '@/model/note';
import { queryOptions } from '@tanstack/react-query';

export const noteQueries = {
  all: ['noteQueries'],
  list: (user: string) =>
    queryOptions({
      queryKey: [...noteQueries.all, 'list', user],
      queryFn: async () => {
        let response = await fetch(`/notes/${user}`);

        return (await response.json()) as NoteType[];
      },
    }),
  note: (user: string, noteId?: string) =>
    queryOptions({
      queryKey: [...noteQueries.all, 'note', user, noteId],
      queryFn: async () => {
        let response = await fetch(`/note/${user}/${noteId}`);

        return (await response.json()) as NoteType;
      },
      enabled: Boolean(noteId),
    }),
} as const;
