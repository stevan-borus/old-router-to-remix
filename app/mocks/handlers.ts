import { createNote, deleteNote, getNote, getNotes } from '@/backend/notes';
import { NoteType } from '@/model/note';
import { delay, http, HttpResponse } from 'msw';

export const handlers = [
  http.get<{ user: string }, null, NoteType[], 'http://localhost:3000/notes/:user'>(
    'http://localhost:3000/notes/:user',
    async ({ params }) => {
      const { user } = params;

      await delay(1000);

      const notes = getNotes(user);

      return HttpResponse.json(notes);
    },
  ),
  http.get<
    { user: string; id: string },
    { user: string },
    NoteType,
    'http://localhost:3000/note/:user/:id'
  >('http://localhost:3000/note/:user/:id', async ({ params }) => {
    const { user, id } = params;

    await delay(500);

    const note = getNote(user, id);

    if (!note) {
      return HttpResponse.json(note, { status: 404 });
    }

    return HttpResponse.json(note);
  }),
  http.post<
    never,
    { user: string; title: string; message: string },
    NoteType,
    'http://localhost:3000/note'
  >('http://localhost:3000/note', async ({ request }) => {
    const data = await request.json();

    await delay();

    const newNote = createNote(data);

    return HttpResponse.json(newNote, { status: 201 });
  }),
  http.delete<{ user: string; id: string }, null, never, 'http://localhost:3000/note/:user/:id'>(
    'http://localhost:3000/note/:user/:id',
    async ({ params }) => {
      const { user, id } = params;

      await delay();

      const isNoteDeleted = deleteNote(user, id);

      if (!isNoteDeleted) {
        return new HttpResponse(null, { status: 404 });
      }

      return HttpResponse.json(null, { status: 200 });
    },
  ),
];
