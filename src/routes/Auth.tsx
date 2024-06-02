import * as Yup from 'yup';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import { fakeAuthProvider } from '@/backend/auth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserActions, useUserStore } from '@/store/user';

type LocationState = {
  from?: Location;
};

const Auth = () => {
  const user = useUserStore(state => state.user);

  const { signIn } = useUserActions();

  const navigate = useNavigate();

  const locationState = useLocation().state as LocationState;

  const from = locationState && locationState.from ? locationState.from.pathname : '/';

  const loginHandler = (values: { email: string; password: string }) => {
    fakeAuthProvider
      .signin(values.email, values.password)
      .then(() => {
        signIn(values.email);
        navigate(from, { replace: true });
      })
      .catch(error => console.error(error));
  };

  const {
    values: { email, password },
    errors,
    touched,
    setFieldValue,
    handleSubmit,
  } = useFormik<{ email: string; password: string }>({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: values => loginHandler(values),
  });

  if (user) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              name='email'
              required
              value={email}
              onChange={event => setFieldValue('email', event.target.value)}
            />
            {errors.email && touched.email && (
              <p className='text-red-500 text-sm'>{errors.email}</p>
            )}
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              name='password'
              required
              value={password}
              onChange={event => setFieldValue('password', event.target.value)}
            />
            {errors.password && touched.password && (
              <p className='text-red-500 text-sm'>{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className='w-full' type='button' onClick={() => handleSubmit()}>
            Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
