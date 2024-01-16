import { getCachedPlaylist } from '@/app/actions';
import Playlist from '@/components/playlist/playlist';
import { Providers } from '@/components/providers';
import { auth } from '@/lib/auth';

const Page = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  if (!session) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Playlist not found</h2>
      </div>
    );
  }

  const playlist = await getCachedPlaylist(params.id, session.user.id);

  if (!playlist) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Playlist not found</h2>
      </div>
    );
  }

  return (
    <Providers session={session}>
      <Playlist playlist={playlist} is_upload={false} />;
    </Providers>
  );
};

export default Page;
