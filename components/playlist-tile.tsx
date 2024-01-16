'use client';

import { Playlist } from '@/types/types';
import PlaylistIcon from './playlist-icon';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { useState, MouseEvent, useMemo } from 'react';
import { PiPlayFill, PiPauseFill } from 'react-icons/pi';
import usePlayerStore from '@/lib/store';

export const PlaylistTileSkeleton = () => {
  return (
    <div className='flex h-14 w-full items-center gap-2 rounded rounded-l-md bg-zinc-900 pr-2'>
      <Skeleton className='aspect-square h-full flex-shrink-0' />
      <Skeleton className='h-8 flex-grow' />
    </div>
  );
};

const PlaylistTile = ({
  playlist,
  is_upload,
}: {
  playlist: Playlist;
  is_upload: boolean;
}) => {
  const play_playlist = usePlayerStore((s) => s.play_playlist);
  const queue = usePlayerStore((s) => s.queue);
  const playing = usePlayerStore((s) => s.playing);
  const current_song = usePlayerStore((s) => s.current_song);
  const audio = usePlayerStore((s) => s.audio);

  const isCurrentPlaying = useMemo(() => {
    if (!playing || !(queue.playlist?.id === playlist.id)) return false;

    for (let x of playlist.songs) {
      if (x.id === current_song?.id) return true;
    }

    return false;
  }, [current_song, playing, queue.playlist, playlist.id, playlist.songs]);

  const handlePlay = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isCurrentPlaying) audio?.pause();
    else {
      if (queue.playlist?.id === playlist.id) audio?.play();
      else play_playlist(playlist, 0);
    }
  };

  return (
    <Link
      href={is_upload ? '/library/uploads' : `/playlist/${playlist.id}`}
      className='group flex h-14 w-full items-center justify-between gap-2 rounded rounded-l-md bg-zinc-900 pr-2 ring-offset-zinc-950 transition-colors hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
    >
      <div className='flex h-full w-full items-center justify-start gap-2 hover:max-w-[calc(100%-44px)]'>
        <div className='aspect-square h-full flex-shrink-0 overflow-hidden rounded-l shadow-sm'>
          <PlaylistIcon songs={playlist.songs} />
        </div>
        <p className='truncate text-sm font-medium'>{playlist.name}</p>
      </div>
      <button
        onClick={handlePlay}
        className='hidden flex-shrink-0 transform items-center justify-center rounded-full bg-zinc-200 p-2 text-lg text-black ring-offset-zinc-950 transition-all  duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 active:flex active:scale-95 group-hover:flex'
      >
        {isCurrentPlaying ? <PiPauseFill /> : <PiPlayFill />}
      </button>
    </Link>
  );
};

export default PlaylistTile;
