import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import Link from 'next/link';
import {
  PiArrowLineRightFill,
  PiPlaylistFill,
  PiPlaylist,
} from 'react-icons/pi';
import { usePathname } from 'next/navigation';
import { ScrollArea } from '../ui/scroll-area';
import Playlist from '../playlist/playlist';
import Image from 'next/image';
import PlaylistIcon from '../playlist-icon';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

const BottomMenu = ({
  expanded,
  expand,
  playlists,
  uploads,
}: {
  expanded: boolean;
  expand: () => void;
  playlists: Playlist[];
  uploads: Playlist | null;
}) => {
  const { data: session } = useSession();

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
        onClick={expand}
      >
        {expanded ? (
          <PiPlaylistFill className='flex-shrink-0 text-2xl' />
        ) : (
          <PiPlaylist className='flex-shrink-0 text-2xl' />
        )}
        {expanded && 'Your Library'}
      </Button>
    </div>;
  }

  return (
    <div className='flex flex-grow flex-col gap-5 overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 py-5 font-medium'>
      <div className='w-full px-6'>
        <Button
          variant={'skeleton'}
          size={'skeleton'}
          className='hidden gap-4 transition-colors hover:text-zinc-100 md:flex'
          onClick={expand}
        >
          {expanded ? (
            <PiPlaylistFill className='flex-shrink-0 text-2xl' />
          ) : (
            <PiPlaylist className='flex-shrink-0 text-2xl' />
          )}
          {expanded && 'Your Library'}
        </Button>
      </div>
      <ScrollArea className={`h-full w-full ${expanded ? 'px-4' : 'px-3'}`}>
        <div
          className={`grid h-full w-full grid-cols-1 ${
            expanded ? 'gap-3' : 'gap-2'
          } pb-5`}
        >
          {all_playlists.map((p, idx) => {
            return (
              <Link
                href={
                  p.id === 'uploaded_songs' ? '/library' : `/playlist/${p.id}`
                }
                className={`flex w-full items-center gap-2 ${
                  expanded ? 'justify-start' : 'justify-center'
                } rounded-md transition-colors hover:bg-zinc-800/50`}
                key={p.id}
              >
                <div
                  className={`aspect relative aspect-square ${
                    expanded ? 'h-14' : 'w-full'
                  } flex-shrink-0 overflow-hidden rounded`}
                >
                  <PlaylistIcon songs={p.songs} />
                </div>
                {expanded && (
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
