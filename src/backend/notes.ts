import localforage from 'localforage';
import { Note } from '../model/note';

export async function getNotes(user: string) {
  let notes = await localforage.getItem<Note[]>('notes');
  if (!notes) notes = [];
  return notes.filter(note => note.user === user);
}

export async function createNote({
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
  const notes = await getNotes(user);
  notes.unshift(note);
  await set(notes);
  return note;
}

export async function getNote(user: string, id: string) {
  const notes = await localforage.getItem<Note[]>('notes');

  if (notes) {
    const note = notes.find(note => note.id === id && note.user === user);
    return note ?? null;
  }

  return null;
}

export async function deleteNote(user: string, id: string) {
  const notes = await localforage.getItem<Note[]>('notes');

  if (notes) {
    const index = notes.findIndex(note => note.id === id && note.user === user);

    if (index > -1) {
      notes.splice(index, 1);
      await set(notes);
      return true;
    }

    return false;
  }

  return false;
}

function set(notes: Note[]) {
  return localforage.setItem('notes', notes);
}
