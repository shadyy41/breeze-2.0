import UserButton from './UserButton';
import Navigation from './Navigation';
import { auth } from '@/lib/auth';
import SignInButton from './SignInButton';

const Topbar = async () => {
  const session = await auth();

  return (
    <div className='flex h-16 w-full flex-shrink-0 items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-6'>
      <Navigation />
      {session ? (
        <UserButton
          user={{ name: session.user.name, image: session.user.image }}
        />
      ) : (
        <SignInButton />
      )}
    </div>
  );
};

export default Topbar;
