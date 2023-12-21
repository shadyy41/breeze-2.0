'use client';
import { PiCaretRightBold, PiCaretLeftBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

const Navigation = () => {
  const router = useRouter();

  return (
    <nav className='flex gap-2'>
      <Button
        variant={'secondary'}
        size={'icon'}
        className='rounded-full'
        onClick={() => router.back()}
      >
        <PiCaretLeftBold className='text-lg' />
      </Button>
      <Button
        variant={'secondary'}
        size={'icon'}
        className='rounded-full'
        onClick={() => router.forward()}
      >
        <PiCaretRightBold className='text-lg' />
      </Button>
    </nav>
  );
};

export default Navigation;
