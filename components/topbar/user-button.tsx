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
import toast from 'react-hot-toast';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Button } from '../ui/button';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

const UserButton: React.FC<{ user: { image: string; name: string } }> = ({
  user,
}) => {
  const [open, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={'skeleton'}
            size={'skeleton'}
            className='relative aspect-square h-8 flex-shrink-0 overflow-hidden rounded-full'
          >
            <Image
              src={user.image}
              alt='User image'
              sizes='2rem'
              fill
              priority
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent collisionPadding={24}>
          <DropdownMenuItem
            onSelect={() => toast.error('Feature not implemented yet.')}
          >
            Edit Name
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/library'>Your Library</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={open} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button onClick={() => signOut()} variant={'pink'}>
              Sign Out
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserButton;
