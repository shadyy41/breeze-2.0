import UserButton from './user-button';
import Navigation from './navigation';
import { auth } from '@/lib/auth';
import SignInButton from './signin-button';

const Topbar = async () => {
  const session = await auth();

  return (
    <div className='flex h-16 w-full flex-shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 md:rounded-md md:border'>
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
