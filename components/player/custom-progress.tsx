import { ChangeEvent, useState } from 'react';

const CustomProgress: React.FC<{
  currentValue: number;
  maxValue: number;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  step: number;
  progressBarRef: React.RefObject<HTMLInputElement>;
  width: number;
}> = ({
  currentValue,
  maxValue,
  handleChange,
  step,
  progressBarRef,
  width,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleMouseDown = () => {
    setIsActive(true);
  };

  const handleMouseUp = () => {
    setIsActive(false);
  };
  return (
    <div className='relative flex h-1 w-full items-center justify-center'>
      <input
        type='range'
        value={currentValue}
        max={maxValue}
        onChange={handleChange}
        step={step}
        className='h-1 w-full appearance-none rounded-full bg-zinc-800 ring-offset-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2  [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-200 [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:transition-opacity hover:[&::-webkit-slider-thumb]:opacity-100 focus:[&::-webkit-slider-thumb]:opacity-100 active:[&::-webkit-slider-thumb]:opacity-100'
        ref={progressBarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleMouseEnter}
        onTouchEnd={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        title=''
      />
      <div
        className={`pointer-events-none absolute left-0 top-0 z-0 rounded-full ${
          isActive || isFocused || isHovered ? 'bg-pink-600' : 'bg-zinc-200'
        } transition-colors`}
        aria-hidden
        style={{
          width: `${width}%`,
          height: '4px',
        }}
      ></div>
    </div>
  );
};

export default CustomProgress;
