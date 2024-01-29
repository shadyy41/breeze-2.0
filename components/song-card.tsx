'use client';

import PlaylistIcon from './playlist-icon';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Song } from '@/types/types';
import { PiPlayFill, PiPauseFill } from 'react-icons/pi';
import usePlayerStore from '@/lib/store';
import { MouseEvent } from 'react';

export function SongCardSkeleton() {
  return (
    <Link
      href={'/library/ncs'}
      className='group w-full max-w-[14rem] rounded-md bg-zinc-950 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
    >
      <div className='flex w-full flex-col gap-2 rounded-md border border-zinc-800 p-4 transition-colors hover:border-zinc-700'>
        <div className='relative aspect-square w-full overflow-hidden rounded-md'>
          <Skeleton className='h-full w-full' />
        </div>
        <Skeleton className='h-12 w-full' />
      </div>
    </Link>
  );
}

const SongCard = ({ song }: { song: Song }) => {
  const play_song = usePlayerStore((s) => s.play_song);
  const playing = usePlayerStore((s) => s.playing);
  const current_song = usePlayerStore((s) => s.current_song);
  const audio = usePlayerStore((s) => s.audio);

  const isCurrentPlaying =
    current_song?.id === song.id && current_song.playlist_id === 'public_songs';

  const handlePlay = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isCurrentPlaying && !playing) audio?.play();
    else if (isCurrentPlaying && playing) audio?.pause();
    else play_song({ ...song, playlist_id: 'public_songs' });
  };

  return (
    <Link
      href={'/library/ncs'}
      className='group w-full max-w-[14rem] rounded-md bg-zinc-950 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
    >
      <div className='flex w-full flex-col gap-2 rounded-md border border-zinc-800 p-4 transition-colors hover:border-zinc-700'>
        <div className='relative aspect-square w-full overflow-hidden rounded-md border border-zinc-800'>
          <PlaylistIcon songs={[song]} />
          <button
            onClick={handlePlay}
            className={`flex-shrink-0 transform items-center justify-center rounded-full bg-zinc-200 p-2 text-lg text-black ring-offset-zinc-950 transition-all  duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 active:flex active:scale-95 ${
              isCurrentPlaying ? '' : 'hidden group-hover:flex'
            } absolute bottom-2 right-2`}
          >
            {isCurrentPlaying && playing ? <PiPauseFill /> : <PiPlayFill />}
          </button>
        </div>
        <p className='truncate text-base'>{song.name}</p>
        <p className='text-sm text-zinc-400'>by NCS</p>
      </div>
    </Link>
  );
};

export default SongCard;
