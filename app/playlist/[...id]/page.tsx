import { getPlaylist } from '@/app/actions';
import Playlist from '@/components/playlist/playlist';

const Page = async ({ params }: { params: { id: string } }) => {
  const playlist = await getPlaylist(params.id);

  if (!playlist)
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Playlist not found</h2>
      </div>
    );

  return <Playlist playlist={playlist} is_upload={false} />;
};

export default Page;
