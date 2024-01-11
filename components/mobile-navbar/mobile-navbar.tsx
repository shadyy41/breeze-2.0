'use client';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  PiHouse,
  PiHouseFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
  PiPlaylistFill,
  PiPlaylist,
} from 'react-icons/pi';

const MobileNavbar = () => {
  const path = usePathname();

  return (
    <nav className='flex w-full flex-shrink-0 items-center justify-evenly border-t border-zinc-800 bg-black p-3 md:hidden'>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/'}
          className={`flex flex-col items-center justify-start gap-1 transition-colors hover:text-zinc-100 ${
            path === '/' && 'text-zinc-100'
          }`}
        >
          {path === '/' ? (
            <PiHouseFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiHouse className='flex-shrink-0 text-2xl' />
          )}
          <p className='text-xs'>Home</p>
        </Link>
      </Button>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/search'}
          className={`flex flex-col items-center justify-start gap-1 transition-colors hover:text-zinc-100 ${
            path === '/search' && 'text-zinc-100'
          }`}
        >
          {path === '/search' ? (
            <PiMagnifyingGlassFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiMagnifyingGlass className='flex-shrink-0 text-2xl' />
          )}
          <p className='text-xs'>Search</p>
        </Link>
      </Button>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/library'}
          className={`flex flex-col items-center justify-start gap-1 transition-colors hover:text-zinc-100 ${
            path === '/library' && 'text-zinc-100'
          }`}
        >
          {path === '/library' ? (
            <PiPlaylistFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiPlaylist className='flex-shrink-0 text-2xl' />
          )}
          <p className='text-xs'>Your Library</p>
        </Link>
      </Button>
    </nav>
  );
};

export default MobileNavbar;
