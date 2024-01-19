import { ScrollArea } from '@radix-ui/react-scroll-area';

const Page = () => {
  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_70%_-20%,rgba(39,39,42,0.6),rgba(255,255,255,0))]'>
      <div className='flex flex-col gap-3 p-4 sm:gap-4 sm:p-5 md:gap-6 md:p-7'>
        <h2 className='text-xl font-medium text-zinc-400'>
          I will implement this later.
        </h2>
      </div>
    </ScrollArea>
  );
};

export default Page;
