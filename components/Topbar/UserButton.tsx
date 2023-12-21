'use client';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '../ui/button';

import { signOut } from 'next-auth/react';

const UserButton: React.FC<{ user: { image: string; name: string } }> = ({
  user,
}) => {
  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'skeleton'}
            size={'skeleton'}
            className='relative aspect-square h-8 flex-shrink-0 overflow-hidden rounded-full'
          >
            <Image src={user.image} alt='User image' sizes='2rem' fill />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <DialogTrigger asChild>
              <Button
                className='text-sm font-normal'
                variant={'skeleton'}
                size={'skeleton'}
              >
                Sign Out
              </Button>
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-xl'>Are you sure?</DialogTitle>
        </DialogHeader>
        <Button onClick={() => signOut()} variant={'pink'}>
          Sign Out
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UserButton;
