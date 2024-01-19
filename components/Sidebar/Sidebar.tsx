'use client';
import { useState, useEffect, useRef } from 'react';
import TopMenu from './top-menu';
import BottomMenu from './bottom-menu';
import { ActionResponse, Playlist } from '@/types/types';
import usePlayerStore from '@/lib/store';

const Sidebar = ({
  playlists,
  uploads,
  upload_count,
  playlist_count,
}: {
  playlists: Playlist[];
  uploads: Playlist | null;
  playlist_count: number;
  upload_count: number;
}) => {
  const sidebar_expanded = usePlayerStore((s) => s.sidebar_expanded);

  return (
    <aside
      className={`hidden flex-shrink-0 md:flex ${
        sidebar_expanded ? 'w-72' : 'w-[4.5rem]'
      }`}
    >
      <div className='flex h-full w-full flex-col gap-2'>
        <TopMenu playlist_count={playlist_count} upload_count={upload_count} />
        <BottomMenu playlists={playlists} uploads={uploads} />
      </div>
    </aside>
  );
};

export default Sidebar;
