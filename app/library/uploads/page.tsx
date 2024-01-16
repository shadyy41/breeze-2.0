import { getCachedUserUploads } from '@/app/actions';
import Playlist from '@/components/playlist/playlist';
import { Providers } from '@/components/providers';
import { auth } from '@/lib/auth';

const Page = async () => {
  const session = await auth();

  if (!session) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Nothing to show here</h2>
      </div>
    );
  }

  const uploads = await getCachedUserUploads(session.user.id);

  if (!uploads)
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Nothing to show here</h2>
      </div>
    );

  return (
    <Providers session={session}>
      <Playlist playlist={uploads} is_upload={true} />;
    </Providers>
  );
};

export default Page;
