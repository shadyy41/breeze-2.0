import { PlaylistTileSkeleton } from '@/components/playlist-tile';
import { GreetingSkeleton } from '@/components/greeting';

const Loading = () => {
  return (
    <div className='flex h-full w-full flex-col gap-3 bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(39,39,42,0.6),rgba(255,255,255,0))] p-4 sm:gap-4 sm:p-5 md:gap-6 md:p-7'>
      <GreetingSkeleton />
      <div className='grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3'>
        <PlaylistTileSkeleton />
        <PlaylistTileSkeleton />
        <PlaylistTileSkeleton />
      </div>
    </div>
  );
};

export default Loading;
