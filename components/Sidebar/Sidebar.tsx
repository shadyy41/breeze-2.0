'use client';
import { useState, useEffect, useRef } from 'react';
import TopMenu from './top-menu';
import BottomMenu from './bottom-menu';
import { ActionResponse, Playlist } from '@/types/types';

const Sidebar = ({
  playlists,
  uploads,
}: {
  playlists: Playlist[];
  uploads: Playlist | null;
}) => {
  const minWidth: number = 72,
    maxWidth: number = 275;
  const [expanded, setExpanded] = useState<boolean>(true);

  const expand = () => {
    setExpanded((e) => !e);
  };

  return (
    <aside
      className='hidden flex-shrink-0 md:flex'
      style={{
        width: `${expanded ? `${maxWidth / 16}rem` : `${minWidth / 16}rem`}`,
      }}
    >
      <div className='flex h-full w-full flex-col gap-2'>
        <TopMenu expanded={expanded} expand={expand} />
        <BottomMenu
          expanded={expanded}
          expand={expand}
          playlists={playlists}
          uploads={uploads}
        />
      </div>
    </aside>
  );
};

export default Sidebar;
