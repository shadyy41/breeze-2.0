'use client';
import { useState, useEffect, useRef } from 'react';
import TopMenu from './TopMenu';
import Library from './Library';

const Sidebar = () => {
  const [width, setWidth] = useState<number>(350);
  const [isClicked, setClicked] = useState<boolean>(false);
  const actualWidth = useRef<number>(350);
  const minWidth: number = 85,
    maxWidth: number = 520,
    trigger: number = 275;

  useEffect(() => {
    const handleMousemove = (e: MouseEvent) => {
      /* 
      
      EXPECTED BEHAVIOUR
      While incraesing the width, if the sidebar was collapsed previously, size should start increasing after
      the trigger.
      While decreasing the width, if the sidebar was expanded previously, size should stop dcreasing after
      the trigger until minwidth is hit.

      width is the user state and actualWidth is the width without trigger behaviour.
      
      */
      if (!isClicked) return;
      setWidth((w) => {
        const updated = actualWidth.current + e.movementX;

        if (updated > actualWidth.current) {
          /* increasing */
          if (w === minWidth) {
            /* apply trigger behaviour */
            if (updated > trigger) {
              actualWidth.current = trigger;
              return actualWidth.current;
            } else {
              actualWidth.current = updated;
              return w;
            }
          } else {
            actualWidth.current = Math.min(updated, maxWidth);
            return actualWidth.current;
          }
        } else {
          /* decreasing */
          if (updated > trigger) {
            /* collapse trigger not hit */
            actualWidth.current = updated;
            return actualWidth.current;
          } else {
            actualWidth.current = Math.max(minWidth, updated);
            if (actualWidth.current == minWidth) return actualWidth.current;
            else return w;
          }
        }
      });
    };

    const handleHover = () => {
      setClicked(false);
    };

    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleHover);

    return () => {
      window.removeEventListener('mousemove', handleMousemove);
      window.removeEventListener('mouseup', handleHover);
    };
  }, [isClicked]);

  const expand = () => {
    if (width == minWidth) {
      setWidth(trigger);
      actualWidth.current = trigger;
    } else {
      setWidth(minWidth);
      actualWidth.current = minWidth;
    }
  };

  return (
    <aside
      className='flex flex-shrink-0'
      style={{
        width: `${width / 16}rem`,
        maxWidth: `${maxWidth}px`,
        minWidth: `${minWidth}px`,
      }}
    >
      <div className='flex h-full w-full flex-col gap-2'>
        <TopMenu expanded={width !== minWidth} />
        <Library expand={expand} expanded={width !== minWidth} />
      </div>
      <div
        className={`h-full w-0.5 ${
          isClicked && 'bg-pink-600'
        } transition-colors hover:cursor-col-resize hover:bg-pink-600`}
        onMouseDown={() => setClicked(true)}
      ></div>
    </aside>
  );
};

export default Sidebar;
