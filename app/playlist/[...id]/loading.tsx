import { Skeleton } from '@/components/ui/skeleton';

const Loading = () => {
  return (
    <div className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(39,39,42,0.5),rgba(255,255,255,0))]'>
      <div className='flex w-full flex-col gap-2 p-3 md:gap-4 md:p-5'>
        <header className='flex h-28 w-full gap-6 p-2 md:h-64'>
          <Skeleton className='aspect-square h-full flex-shrink-0' />
          <div className='flex flex-grow flex-col justify-center gap-2'>
            <Skeleton className='h-5 w-14' />
            <Skeleton className='h-16 w-full' />
          </div>
        </header>
        <Skeleton className='h-12 w-24' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
      </div>
    </div>
  );
};

export default Loading;
