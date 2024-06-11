import { z } from 'zod';

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  message: z.string(),
  user: z.string(),
});

export const notesSchema = z.array(noteSchema);

export type NoteType = z.infer<typeof noteSchema>;
