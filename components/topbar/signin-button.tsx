'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { signIn } from 'next-auth/react';
import { Button } from '../ui/button';

const SignInButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='rounded-full px-10' variant={'pink'}>
          Log In
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>Log In / Sign Up</DialogTitle>
        </DialogHeader>
        <Button onClick={() => signIn('google')} variant={'pink'}>
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default SignInButton;
