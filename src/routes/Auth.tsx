import {
  Form,
  LoaderFunctionArgs,
  redirect,
  useActionData,
  useLocation,
  useNavigation,
} from 'react-router-dom';
import { z } from 'zod';

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
import { fakeAuthProvider } from '@/backend/auth';
import { useUserStore } from '@/store/user';

const authSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
});

export const loginAction = async ({ request }: LoaderFunctionArgs) => {
  let formPayload = await request.formData();

  let data = Object.fromEntries(formPayload);

  let parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return parsed.error.format();
  }

  let { email, password } = parsed.data;

  let isSignedIn = await fakeAuthProvider.signin(email, password);

  if (isSignedIn) {
    useUserStore.getState().signIn(email!);

    let redirectTo = formPayload.get('redirectTo') as string | null;
    throw redirect(redirectTo || '/');
  }

  return null;
};

export const loginLoader = async () => {
  let user = useUserStore.getState().user;

  if (user) {
    throw redirect('/');
  }

  return null;
};

export const Auth = () => {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get('from') || '/';

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get('email') != null;

  let actionData = useActionData() as Awaited<ReturnType<typeof loginAction>>;

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center'>
      <Form method='POST' replace>
        <Card className='w-full max-w-sm'>
          <CardHeader>
            <CardTitle className='text-2xl'>Login</CardTitle>
            <CardDescription>Enter your email below to login to your account.</CardDescription>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <div className='grid gap-2'>
              <Input type='hidden' name='redirectTo' value={from} />
              <Label htmlFor='email'>Email</Label>
              <Input id='email' name='email' />
              {actionData && actionData.email && (
                <p className='text-red-500 text-sm'>{actionData.email._errors[0]}</p>
              )}
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' name='password' />
              {actionData && actionData.password && (
                <p className='text-red-500 text-sm'>{actionData.password._errors[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className='w-full' type='submit' disabled={isLoggingIn}>
              Sign in
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
};
