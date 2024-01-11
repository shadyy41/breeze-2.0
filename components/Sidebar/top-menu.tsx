import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PiHouse,
  PiHouseFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
} from 'react-icons/pi';
import { Button } from '../ui/button';
import UploadButton from './upload-button';
import NewPlaylistButton from './new-playlist-button';
import { Separator } from '../ui/separator';

const TopMenu: React.FC<{
  expand: () => void;
  expanded: boolean;
}> = ({ expand, expanded }) => {
  const path = usePathname();
  return (
    <div className='flex flex-col gap-5 rounded-md border border-zinc-800 bg-zinc-950 px-6 py-5 font-medium'>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/'}
          className={`flex items-center justify-start gap-4 transition-colors hover:text-zinc-100 ${
            path === '/' && 'text-zinc-100'
          }`}
        >
          {path === '/' ? (
            <PiHouseFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiHouse className='flex-shrink-0 text-2xl' />
          )}
          {expanded && 'Home'}
        </Link>
      </Button>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/search'}
          className={`flex items-center justify-start gap-4 transition-colors hover:text-zinc-100 ${
            path === '/search' && 'text-zinc-100'
          }`}
        >
          {path === '/search' ? (
            <PiMagnifyingGlassFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiMagnifyingGlass className='flex-shrink-0 text-2xl' />
          )}
          {expanded && 'Search'}
        </Link>
      </Button>
      <Separator />
      <NewPlaylistButton expanded={expanded} />
      <UploadButton expanded={expanded} />
    </div>
  );
};

export default TopMenu;
