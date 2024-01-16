import { ScrollArea } from '@/components/ui/scroll-area';
import { getCachedUserPlaylists, getCachedUserUploads } from '@/app/actions';

import { auth } from '@/lib/auth';
import { Separator } from '@/components/ui/separator';
import PlaylistTile from '@/components/playlist-tile';
import Greeting from '@/components/greeting';

const Home = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Nothing to show here</h2>
      </div>
    );
  }

  const uploads = await getCachedUserUploads(session.user.id);
  const playlists = await getCachedUserPlaylists(session.user.id);

  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(39,39,42,0.6),rgba(255,255,255,0))]'>
      <div className='flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 md:gap-6 md:p-7'>
        <Greeting />
        <div className='grid w-full grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4'>
          {uploads && <PlaylistTile playlist={uploads} is_upload={true} />}
          {playlists &&
            playlists.map((e, idx) => {
              if (idx >= 5) return;
              return <PlaylistTile playlist={e} is_upload={false} key={e.id} />;
            })}
        </div>
        <div>
          <h3 className='mb-3 text-xl font-medium'>Explore NCS</h3>
        </div>
        <Separator />
        <div>
          <h3 className='mb-3 text-xl font-medium'>Recently Played</h3>
        </div>
      </div>
    </ScrollArea>
  );
};

export default Home;
