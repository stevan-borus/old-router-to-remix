import { createNote, deleteNote, getNote, getNotes } from '@/backend/notes';
import { Note } from '@/model/note';
import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get<{ user: string }, null, Note[], '/notes/:user'>('/notes/:user', async ({ params }) => {
    const { user } = params;

    await delay();

    const notes = await getNotes(user);

    return HttpResponse.json(notes);
  }),
  http.get<{ user: string; id: string }, { user: string }, Note, '/note/:user/:id'>(
    '/note/:user/:id',
    async ({ params }) => {
      const { user, id } = params;

      await delay();

      const note = await getNote(user, id);

      if (!note) {
        return HttpResponse.json(note, { status: 404 });
      }

      return HttpResponse.json(note);
    },
  ),
  http.post<never, { user: string; title: string; message: string }, Note>(
    '/note',
    async ({ request }) => {
      const data = await request.json();

      await delay();

      const newNote = await createNote(data);

      return HttpResponse.json(newNote, { status: 201 });
    },
  ),
  http.delete<{ user: string; id: string }, null, never, '/note/:user/:id'>(
    '/note/:user/:id',
    async ({ params }) => {
      const { user, id } = params;

      await delay();

      const isNoteDeleted = await deleteNote(user, id);

      if (!isNoteDeleted) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(null, { status: 200 });
    },
  ),
];
