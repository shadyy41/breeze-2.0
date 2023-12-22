import { PiPlaylistFill } from 'react-icons/pi';
import { Button } from '../ui/button';
import UploadButton from './UploadButton';

const Library: React.FC<{
  expand: () => void;
  expanded: boolean;
}> = ({ expand, expanded }) => {
  return (
    <div className='flex flex-grow flex-col gap-5 rounded-md border border-zinc-800 bg-zinc-950 px-5 py-5 font-medium'>
      <header className='w-full'>
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
      <UploadButton expanded={expanded} />
    </div>
  );
};

export default Library;
