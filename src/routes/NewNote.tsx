import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserStore } from '@/store/user';
import useAddNote from '@/queries/note/useAddNote';

const NewNote = () => {
  const user = useUserStore(state => state.user);

  const navigate = useNavigate();

  const { mutate: addNote } = useAddNote();

  const addNoteHandler = async (values: { title: string; message: string }) => {
    if (user) {
      addNote(
        { user, ...values },
        {
          onSuccess: data => navigate(`/note/${data.id}`),
          onError: error => console.log(error),
        },
      );
    }
  };

  const {
    values: { title, message },
    errors,
    touched,
    setFieldValue,
    handleSubmit,
  } = useFormik<{ title: string; message: string }>({
    initialValues: { title: '', message: '' },
    validationSchema: Yup.object().shape({
      title: Yup.string().required('Required'),
      message: Yup.string().required('Required'),
    }),
    onSubmit: values => addNoteHandler(values),
  });

  return (
    <Card className='w-full' x-chunk='dashboard-07-chunk-0'>
      <CardHeader>
        <CardTitle>Add note</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='grid gap-6'>
          <div className='grid gap-3'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              type='text'
              name='title'
              className='w-full'
              value={title}
              onChange={event => setFieldValue('title', event.target.value)}
            />
            {errors.title && touched.title && (
              <p className='text-red-500 text-sm'>{errors.title}</p>
            )}
          </div>
          <div className='grid gap-3'>
            <Label htmlFor='message'>Message</Label>
            <Textarea
              id='message'
              name='message'
              value={message}
              className='min-h-32'
              onChange={event => setFieldValue('message', event.target.value)}
            />
            {errors.message && touched.message && (
              <p className='text-red-500 text-sm'>{errors.message}</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className='w-full' type='button' onClick={() => handleSubmit()}>
          Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewNote;
