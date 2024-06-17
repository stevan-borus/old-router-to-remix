import { NoteType } from '../model/note';

let notes: NoteType[] = [
  { id: '1', title: 'ss', message: 'mss', user: 'admin@admin.com' },
  { id: '2', title: 'dsad', message: 'mszxcxzs', user: 'admin@admin.com' },
  { id: '3', title: 'fbvdfbvd', message: 'asdsada', user: 'admin@admin.com' },
];

export function getNotes(user: string) {
  return notes.filter(note => note.user === user);
}

export function createNote({
  user,
  title,
  message,
}: {
  user: string;
  title: string;
  message: string;
}) {
  const id = Math.random().toString(36).substring(2, 9);
  const note = { id, title, message, user };
  notes.unshift(note);
  return note;
}

export function getNote(user: string, id: string) {
  if (notes) {
    const note = notes.find(note => note.id === id && note.user === user);
    return note ?? null;
  }

  return null;
}

export function deleteNote(user: string, id: string) {
  if (notes) {
    const index = notes.findIndex(note => note.id === id && note.user === user);

    if (index > -1) {
      notes.splice(index, 1);
      return true;
    }

    return false;
  }

  return false;
}
