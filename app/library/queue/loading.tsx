import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';

const Loading = () => {
  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(39,39,42,0.8),rgba(255,255,255,0))]'>
      <div className='grid w-full grid-cols-1 gap-2 p-3 md:gap-4 md:p-5'>
        <Skeleton className='h-8 w-1/2' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
        <Skeleton className='h-12 w-full' />
      </div>
    </ScrollArea>
  );
};

export default Loading;
