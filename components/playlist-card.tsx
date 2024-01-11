import PlaylistIcon from './playlist-icon';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Playlist } from '@/types/types';

export function PlaylistCardSkeleton() {
  return (
    <div className='m-1 flex w-56 flex-col gap-2 rounded-md border border-zinc-800 p-4'>
      <Skeleton className='aspect-square w-full' />
      <div className='flex w-full flex-col'>
        <Skeleton className='h-[52px] w-full' />
      </div>
    </div>
  );
}

const PlaylistCard = ({
  playlist,
  isUpload = false,
}: {
  playlist: Playlist;
  isUpload?: boolean;
}) => {
  return (
    <Link
      href={isUpload ? '/library/uploads' : `/playlist/${playlist.id}`}
      className='w-full rounded-md bg-zinc-950 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
    >
      <div className='flex w-full flex-col gap-2 rounded-md border border-zinc-800 p-4 transition-colors hover:border-zinc-700'>
        <div className='aspect-square w-full'>
          <PlaylistIcon songs={playlist.songs} />
        </div>
        <p className='truncate text-lg'>{playlist.name}</p>
      </div>
    </Link>
  );
};

export default PlaylistCard;
