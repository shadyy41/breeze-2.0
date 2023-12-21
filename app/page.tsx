import { ScrollArea } from '@/components/ui/scroll-area';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  // console.log(session)
  // if(!session) redirect('/api/auth/signin')
  return (
    <ScrollArea className='w-full flex-grow p-4'>
      <h2 className='text-2xl'>Welcome Back!</h2>
    </ScrollArea>
  );
}
