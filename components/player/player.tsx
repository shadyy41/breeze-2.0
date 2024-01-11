'use client';
import usePlayerStore from '@/lib/store';
import { useState, useEffect, useRef } from 'react';
import {
  PiPlayFill,
  PiPauseFill,
  PiFastForwardFill,
  PiSpeakerSimpleHighFill,
  PiSpeakerSimpleNoneFill,
  PiShuffleAngular,
  PiRepeatFill,
  PiRepeatOnceFill,
  PiQueue,
  PiQueueFill,
} from 'react-icons/pi';
import CustomProgress from './custom-progress';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const Player = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const volumeBarRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();
  const path = usePathname();

  const current_song = usePlayerStore((s) => s.current_song);
  const queue = usePlayerStore((s) => s.queue);
  const playing = usePlayerStore((s) => s.playing);
  const audio = usePlayerStore((s) => s.audio);
  const next = usePlayerStore((s) => s.next);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const setAudio = usePlayerStore((s) => s.setAudio);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}`;
  };

  useEffect(() => {
    setAudio(new Audio());
  }, []);

  useEffect(() => {
    if (!audio || !current_song) return;
    audio.src = current_song?.song_path;
    audio.play();
  }, [current_song, audio]);

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (queue.repeat) audio.play();
      else next();
    };

    const handlePause = () => {
      setPlaying(false);
    };

    const handlePlay = () => {
      setPlaying(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audio, queue.repeat]);

  const togglePlay = () => {
    if (!audio || audio.src == '') return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio || audio.src == '') return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (!audio) return;

    setIsMuted((m) => {
      audio.volume = m ? volume : 0;
      return !m;
    });
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audio) return;

    const new_volume = parseFloat(e.target.value);

    if (new_volume != 0) {
      audio.volume = new_volume;
      setVolume(new_volume);
      if (isMuted) setIsMuted(false);
    } else {
      setIsMuted(true);
      audio.volume = 0;
      setVolume(0);
    }
  };

  const handleNext = () => {
    if (!audio || audio.src == '') return;

    audio.currentTime = audio.duration;
  };

  const openQueue = () => {
    if (path !== '/library/queue') router.push('/library/queue');
    else router.back();
  };

  return (
    <>
      <div className='hidden h-24 w-full flex-shrink-0 grid-cols-2 p-2 px-4 text-sm md:flex'>
        <div className='flex flex-1 justify-start'>
          <div className='flex flex-1 items-center justify-start gap-3'>
            <div className='relative aspect-square h-full shrink-0 overflow-hidden rounded-md'>
              {current_song ? (
                <Image
                  src={current_song.thumb_path}
                  alt='song thumbnail'
                  fill
                  sizes='(max-width: 960px) 80px, 58px'
                />
              ) : (
                <div className='h-full w-full bg-zinc-900'></div>
              )}
            </div>
            <div className=''>{current_song && <p>{current_song.name}</p>}</div>
          </div>
        </div>
        <div className='min-w-sm flex h-full max-w-md flex-1 flex-col items-center justify-center gap-2'>
          <div className='flex items-center justify-center gap-4 text-2xl'>
            <button
              onClick={toggleMute}
              className='flex flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
            >
              <PiShuffleAngular />
            </button>
            <button
              onClick={toggleMute}
              className='flex flex-shrink-0 rotate-180 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
            >
              <PiFastForwardFill />
            </button>
            <button
              onClick={togglePlay}
              className='flex flex-shrink-0 transform items-center justify-center rounded-full bg-zinc-200 p-2 text-xl text-black  ring-offset-zinc-950 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 active:scale-95'
            >
              {playing ? <PiPauseFill /> : <PiPlayFill />}
            </button>
            <button
              onClick={handleNext}
              className='flex flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
            >
              <PiFastForwardFill />
            </button>
            <button
              onClick={() => toggleRepeat()}
              className={`flex flex-shrink-0 items-center justify-center rounded-full ${
                queue.repeat ? 'text-zinc-200' : 'text-zinc-400'
              } relative ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2`}
            >
              {queue.repeat ? <PiRepeatOnceFill /> : <PiRepeatFill />}
            </button>
          </div>
          <div className='flex w-full items-center justify-center gap-2 text-xs text-zinc-500'>
            <div className='w-10'>{formatTime(currentTime)}</div>
            <CustomProgress
              currentValue={currentTime}
              maxValue={duration}
              handleChange={handleSeek}
              width={audio ? (audio.currentTime / audio.duration) * 100 : 0}
              progressBarRef={progressBarRef}
              step={1}
            />
            <div className='w-10'>{formatTime(duration)}</div>
          </div>
        </div>
        <div className='flex flex-1 justify-end'>
          <div className='flex max-w-[128px] shrink-0 items-center justify-center gap-3 text-xl'>
            <button
              onClick={openQueue}
              className='flex flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
            >
              {path === '/library/queue' ? <PiQueueFill /> : <PiQueue />}
            </button>
            <button
              onClick={toggleMute}
              className='flex flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
            >
              {isMuted || !volume ? (
                <PiSpeakerSimpleNoneFill />
              ) : (
                <PiSpeakerSimpleHighFill />
              )}
            </button>
            <CustomProgress
              currentValue={isMuted ? 0 : volume}
              maxValue={1}
              step={0.01}
              handleChange={handleVolumeChange}
              progressBarRef={volumeBarRef}
              width={isMuted ? 0 : volume * 100}
            />
          </div>
        </div>
      </div>
      <div className='block h-24 flex-shrink-0 py-2 md:hidden'>
        <div className='relative flex h-full w-full flex-shrink-0 grid-cols-2 rounded-md border border-zinc-800 bg-zinc-950 p-2 pb-3 text-sm'>
          <div className='flex flex-1 justify-between'>
            <div className='flex flex-1 items-center justify-start gap-3'>
              <div className='relative aspect-square h-full shrink-0 overflow-hidden rounded-md'>
                {current_song ? (
                  <Image
                    src={current_song.thumb_path}
                    alt='song thumbnail'
                    fill
                  />
                ) : (
                  <div className='h-full w-full bg-zinc-900'></div>
                )}
              </div>
              {current_song && <p className='truncate'>{current_song.name}</p>}
            </div>
            <div className='flex flex-1 items-center justify-end gap-4 pr-4 text-xl'>
              <button
                onClick={toggleMute}
                className='flex flex-shrink-0 rotate-180 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
              >
                <PiFastForwardFill />
              </button>
              <button
                onClick={togglePlay}
                className='flex flex-shrink-0 transform items-center justify-center rounded-full text-2xl text-zinc-400 ring-offset-zinc-950 transition-all duration-300 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 active:scale-90'
              >
                {playing ? <PiPauseFill /> : <PiPlayFill />}
              </button>
              <button
                onClick={toggleMute}
                className='flex flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
              >
                <PiFastForwardFill />
              </button>
            </div>
          </div>
          <div className='absolute bottom-0 left-0 h-fit w-full px-2 '>
            <div className='w-full'>
              <CustomProgress
                currentValue={currentTime}
                maxValue={duration}
                handleChange={handleSeek}
                width={audio ? (audio.currentTime / audio.duration) * 100 : 0}
                progressBarRef={progressBarRef}
                step={1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Player;
