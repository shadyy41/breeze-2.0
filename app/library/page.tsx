import { ScrollArea } from '@/components/ui/scroll-area';
import {
  getCachedUserUploads,
  getCachedUserPlaylists,
  getCachedUploadCount,
  getCachedPlaylistCount,
} from '@/app/actions';
import { auth } from '@/lib/auth';
import ButtonsGrid from '@/components/library/buttons-grid';
import { Providers } from '@/components/providers';
import PlaylistTile from '@/components/playlist-tile';

const Page = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>
          Sign in to create playlists and upload songs.
        </h2>
      </div>
    );
  }

  const uploads = await getCachedUserUploads(session.user.id);
  const playlists = await getCachedUserPlaylists(session.user.id);
  const upload_count = await getCachedUploadCount(session.user.id);
  const playlist_count = await getCachedPlaylistCount(session.user.id);

  if (!uploads) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Nothing to show here</h2>
      </div>
    );
  }

  return (
    <Providers session={session}>
      <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(39,39,42,0.6),rgba(255,255,255,0))]'>
        <div className='flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 md:gap-6 md:p-7'>
          <h2 className='text-xl font-medium'>Your Library</h2>
          <ButtonsGrid
            uploads={uploads}
            upload_count={upload_count}
            playlist_count={playlist_count}
          />
          <h3 className='text-xl font-medium'>Playlists</h3>
          <div className='grid w-full grid-cols-1 gap-2 md:grid-cols-3'>
            {playlists.map((p, idx) => {
              return <PlaylistTile playlist={p} is_upload={false} key={p.id} />;
            })}
            {!playlists.length && (
              <p className='text-sm text-zinc-400'>
                Your playlists will be displayed here.
              </p>
            )}
          </div>
        </div>
      </ScrollArea>
    </Providers>
  );
};

export default Page;
