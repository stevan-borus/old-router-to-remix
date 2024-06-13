import {
  Form,
  isRouteErrorResponse,
  redirect,
  useActionData,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { ActionFunctionArgs } from '@remix-run/node';
import { z } from 'zod';
import invariant from 'tiny-invariant';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/store/user';
import { noteSchema } from '@/model/note';

const newNoteSchema = z.object({
  title: z.string().min(1, 'Required'),
  message: z.string().min(1, 'Required'),
  user: z.string(),
});

export const clientAction = async ({ request }: ActionFunctionArgs) => {
  let formData = await request.formData();

  let data = Object.fromEntries(formData);

  let parsed = newNoteSchema.safeParse(data);

  if (!parsed.success) {
    return parsed.error.format();
  }

  let { user, title, message } = parsed.data;

  let response = await fetch(`/note`, {
    method: 'POST',
    body: JSON.stringify({ user, title, message }),
  });

  let note = await response.json();

  let noteParsed = noteSchema.parse(note);

  throw redirect(`/note/${noteParsed.id}`);
};

export const clientLoader = async () => {
  let user = useUserStore.getState().user;

  invariant(user, 'User not found');

  return user;
};

export default function NewNote() {
  let user = useLoaderData<typeof clientLoader>();

  let actionData = useActionData<typeof clientAction>();

  return (
    <Card className='w-full' x-chunk='dashboard-07-chunk-0'>
      <Form method='POST'>
        <CardHeader>
          <CardTitle>Add note</CardTitle>
        </CardHeader>
        <CardContent>
          <Input type='hidden' name='user' value={user} />
          <div className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='title'>Title</Label>
              <Input id='title' name='title' type='text' className='w-full' />
              {actionData && actionData.title && (
                <p className='text-red-500 text-sm'>{actionData.title._errors[0]}</p>
              )}
            </div>
            <div className='grid gap-3'>
              <Label htmlFor='message'>Message</Label>
              <Textarea id='message' name='message' className='min-h-32' />
              {actionData && actionData.message && (
                <p className='text-red-500 text-sm'>{actionData.message._errors[0]}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full' type='submit'>
            Add
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();

  let errorMessage = '';

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2 py-8'>
      <h1>Oops!</h1>

      <p>Sorry, an unexpected error has occurred</p>

      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}