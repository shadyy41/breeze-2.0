import PlaylistCard from '@/components/playlist-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getUploadedSongs, getUserPlaylists } from '@/app/actions';
import { auth } from '@/lib/auth';
import { Suspense } from 'react';
import { PlaylistCardSkeleton } from '@/components/playlist-card';

const Page = async () => {
  const uploads = await getUploadedSongs();

  if (!uploads) {
    return (
      <div className='h-full w-full p-7'>
        <h2 className='text-xl font-medium'>Nothing to show here</h2>
      </div>
    );
  }

  return (
    <ScrollArea className='h-full w-full p-6'>
      <h2 className='mb-4 text-2xl font-medium'>Your Library</h2>
      <div className='flex w-full'>
        {uploads && (
          <Suspense fallback={<PlaylistCardSkeleton />}>
            <PlaylistCard playlist={uploads} isUpload />
          </Suspense>
        )}
      </div>
    </ScrollArea>
  );
};

export default Page;
