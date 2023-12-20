import { PiPlaylistFill } from 'react-icons/pi';

const Library: React.FC<{
  expand: () => void;
  expanded: boolean;
}> = ({ expand, expanded }) => {
  return (
    <div className='flex h-full flex-col gap-2 rounded-md border border-zinc-800 bg-zinc-950 font-medium'>
      <button
        className='flex items-center justify-start gap-4 px-7 py-5 transition-colors hover:text-zinc-100'
        onClick={expand}
      >
        <PiPlaylistFill className='text-2xl' />
        {expanded && 'Your Library'}
      </button>
    </div>
  );
};

export default Library;
