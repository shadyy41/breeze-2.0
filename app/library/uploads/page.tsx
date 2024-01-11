import { getUploadedSongs } from '@/app/actions';
import Playlist from '@/components/playlist/playlist';

const Page = async () => {
  const uploads = await getUploadedSongs();

  if (!uploads)
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Nothing to show here</h2>
      </div>
    );

  return <Playlist playlist={uploads} is_upload={true} />;
};

export default Page;
