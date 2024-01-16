import { Skeleton } from '@/components/ui/skeleton';

const PlaylistLoader = () => {
  return (
    <div className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(39,39,42,0.5),rgba(255,255,255,0))]'>
      <div className='grid w-full grid-cols-1 gap-2 p-3 pb-32 md:gap-4 md:p-5 md:pb-5'>
        <header className='flex h-fit w-full flex-col items-center gap-4 p-2 md:h-64 md:flex-row md:gap-6'>
          <Skeleton className='aspect-square h-full w-3/4 max-w-xs flex-shrink-0 overflow-hidden rounded shadow md:w-fit' />
          <div className='flex w-full flex-col justify-center gap-2 md:max-w-[calc(100%-296px)]'>
            <Skeleton className='h-5 w-14' />
            <Skeleton className='h-16 w-full' />
          </div>
        </header>
        <div className='flex w-full items-center gap-4 px-2'>
          <Skeleton className='h-12 w-24' />
        </div>
        <div className='flex flex-col gap-2 pb-10 text-sm md:gap-4'>
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
          <Skeleton className='h-12 w-full' />
        </div>
      </div>
    </div>
  );
};

export default PlaylistLoader;
