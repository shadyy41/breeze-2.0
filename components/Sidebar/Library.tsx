import { PiPlaylistFill } from 'react-icons/pi';
import { Button } from '../ui/button';

const Library: React.FC<{
  expand: () => void;
  expanded: boolean;
}> = ({ expand, expanded }) => {
  return (
    <div className='flex h-full w-full flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-950 font-medium'>
      <header className='w-full px-5 py-5'>
        <Button
          variant={'skeleton'}
          size={'skeleton'}
          className='gap-4 transition-colors hover:text-zinc-100'
          onClick={expand}
        >
          <PiPlaylistFill className='flex-shrink-0 text-2xl' />
          {expanded && 'Your Library'}
        </Button>
      </header>
    </div>
  );
};

export default Library;
