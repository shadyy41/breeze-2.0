import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PiHouse,
  PiHouseFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
} from 'react-icons/pi';

const TopMenu: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  const path = usePathname();
  return (
    <div className='flex flex-col gap-5 rounded-md border border-zinc-800 bg-zinc-950 px-7 py-5 font-medium'>
      <Link
        href={'/'}
        className='flex items-center justify-start gap-4 transition-colors hover:text-zinc-100'
      >
        {path === '/' ? (
          <PiHouseFill className='text-2xl' />
        ) : (
          <PiHouse className='text-2xl' />
        )}
        {expanded && 'Home'}
      </Link>
      <Link
        href={'/search'}
        className='flex items-center justify-start gap-4 transition-colors hover:text-zinc-100'
      >
        {path === '/search' ? (
          <PiMagnifyingGlassFill className='text-2xl' />
        ) : (
          <PiMagnifyingGlass className='text-2xl' />
        )}
        {expanded && 'Search'}
      </Link>
    </div>
  );
};

export default TopMenu;
