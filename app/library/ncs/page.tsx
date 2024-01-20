import { getCachedPublicSongs, getCachedUserUploads } from '@/app/actions';
import Playlist from '@/components/playlist/playlist';
import { Providers } from '@/components/providers';
import { auth } from '@/lib/auth';

const Page = async () => {
  const session = await auth();

  const public_songs = await getCachedPublicSongs();

  if (!public_songs)
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium text-zinc-400'>
          An error occured while fetching songs
        </h2>
      </div>
    );

  return (
    <Providers session={session}>
      <Playlist playlist={public_songs} is_upload={false} is_public={true} />;
    </Providers>
  );
};

export default Page;
