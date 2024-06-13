import { noteSchema, notesSchema } from '@/model/note';
import { queryOptions } from '@tanstack/react-query';

export const noteQueries = {
  all: ['noteQueries'],
  list: (user: string) =>
    queryOptions({
      queryKey: [...noteQueries.all, 'list', user],
      queryFn: async () => {
        let response = await fetch(`/notes/${user}`);

        let notes = await response.json();

        return notesSchema.parse(notes);
      },
    }),
  note: (user: string, noteId: string) =>
    queryOptions({
      queryKey: [...noteQueries.all, 'note', user, noteId],
      queryFn: async () => {
        let response = await fetch(`/note/${user}/${noteId}`);

        let note = await response.json();

        return noteSchema.parse(note);
      },
      enabled: Boolean(noteId),
      staleTime: 60 * 1000 * 5,
    }),
} as const;
