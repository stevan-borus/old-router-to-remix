import { Form, useActionData, useLocation, useNavigation } from '@remix-run/react';
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
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
import { authenticator } from '@/services/auth.server';

const authSchema = z.object({
  email: z.string().min(1, 'Required').email('Invalid email'),
  password: z.string().min(1, 'Required'),
  redirectTo: z.string().optional(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  let data = Object.fromEntries(await request.clone().formData());

  let parsed = authSchema.safeParse(data);

  if (!parsed.success) {
    return parsed.error.format();
  }

  return await authenticator.authenticate('user-pass', request, {
    successRedirect: parsed.data.redirectTo || '/',
    throwOnError: true,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  return null;
};

export default function Auth() {
  let location = useLocation();
  let params = new URLSearchParams(location.search);
  let from = params.get('from') || '/';

  let navigation = useNavigation();
  let isLoggingIn = navigation.formData?.get('email') != null;

  let actionData = useActionData<typeof action>();

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
}
