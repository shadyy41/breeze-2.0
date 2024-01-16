import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  PiArrowLineRightFill,
  PiArrowRightBold,
  PiPlaylistFill,
  PiPlaylist,
} from 'react-icons/pi';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import { Playlist } from '@/types/types';
import PlaylistIcon from '../playlist-icon';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import usePlayerStore from '@/lib/store';

const BottomMenu = ({
  playlists,
  uploads,
}: {
  playlists: Playlist[];
  uploads: Playlist | null;
}) => {
  const { data: session } = useSession();
  const path = usePathname();
  const sidebar_expanded = usePlayerStore((s) => s.sidebar_expanded);
  const toggle_sidebar = usePlayerStore((s) => s.toggle_sidebar);

  const [all_playlists] = useState<Playlist[]>(() => {
    if (!uploads) return [...playlists];
    return [uploads, ...playlists];
  });

  if (!session) {
    <div className='flex flex-grow flex-col gap-5 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 px-6 py-5 font-medium'>
      <Button
        variant={'skeleton'}
        size={'skeleton'}
        className='hidden gap-4 transition-colors hover:text-zinc-100 md:flex'
        onClick={toggle_sidebar}
      >
        {sidebar_expanded ? (
          <PiPlaylistFill className='flex-shrink-0 text-2xl' />
        ) : (
          <PiPlaylist className='flex-shrink-0 text-2xl' />
        )}
        {sidebar_expanded && 'Your Library'}
      </Button>
    </div>;
  }

  return (
    <div className='flex flex-grow flex-col gap-5 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 py-5 font-medium'>
      <div className='flex w-full items-center justify-between px-6'>
        <Button
          variant={'skeleton'}
          size={'skeleton'}
          className='hidden gap-4 transition-colors hover:text-zinc-100 md:flex'
          onClick={toggle_sidebar}
        >
          {sidebar_expanded || path === '/library' ? (
            <PiPlaylistFill className='flex-shrink-0 text-2xl' />
          ) : (
            <PiPlaylist className='flex-shrink-0 text-2xl' />
          )}
          {sidebar_expanded && 'Your Library'}
        </Button>
        {sidebar_expanded && (
          <Button
            variant={'skeleton'}
            size={'skeleton'}
            className='hidden gap-4 text-lg transition-colors hover:text-zinc-100 md:flex'
            asChild
          >
            <Link href={'/library'} className='hover:text-zinc-100'>
              <PiArrowRightBold />
            </Link>
          </Button>
        )}
      </div>
      <ScrollArea
        className={`h-full w-full ${sidebar_expanded ? 'px-4' : 'px-1'}`}
      >
        <div
          className={`grid h-full w-full grid-cols-1 ${
            sidebar_expanded ? 'gap-3 px-1 pt-2' : 'gap-2 px-1 pt-1'
          } pb-5`}
        >
          {all_playlists.map((p, idx) => {
            return (
              <Link
                href={
                  p.id === 'uploaded_songs'
                    ? '/library/uploads'
                    : `/playlist/${p.id}`
                }
                className={`flex w-full items-center gap-2 ${
                  sidebar_expanded ? 'justify-start' : 'justify-center'
                } rounded-md ring-offset-zinc-950 transition-colors hover:bg-zinc-800/50 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2`}
                key={p.id}
              >
                <div
                  className={`aspect relative aspect-square ${
                    sidebar_expanded ? 'h-14' : 'w-full'
                  } flex-shrink-0 overflow-hidden rounded`}
                >
                  <PlaylistIcon songs={p.songs} key={p.songs.length} />
                </div>
                {sidebar_expanded && (
                  <div className='grid w-full grid-cols-1 gap-1'>
                    <p className='truncate text-sm font-normal'>{p.name}</p>
                    <p className='truncate text-sm font-normal text-zinc-400'>
                      {session?.user.name}
                    </p>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BottomMenu;
