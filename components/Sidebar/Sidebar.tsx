'use client';
import { useState, useEffect, useRef } from 'react';
import TopMenu from './top-menu';
import BottomMenu from './bottom-menu';

const Sidebar = () => {
  const minWidth: number = 64,
    maxWidth: number = 275;
  const [expanded, setExpanded] = useState<boolean>(false);

  const expand = () => {
    setExpanded((e) => !e);
  };

  return (
    <aside
      className='flex flex-shrink-0'
      style={{
        width: `${expanded ? `${maxWidth / 16}rem` : `${minWidth / 16}rem`}`,
        transition: 'width 0.3s ease',
      }}
    >
      <div className='flex h-full w-full flex-col gap-2'>
        <TopMenu expanded={expanded} expand={expand} />
        <BottomMenu expanded={expanded} />
      </div>
    </aside>
  );
};

export default Sidebar;
