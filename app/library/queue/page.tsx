'use client';

import { ScrollArea } from "@/components/ui/scroll-area";
import usePlayerStore, { CurrentSong } from "@/lib/store";
import { Playlist, Song } from "@/types/types";
import {
  PiPauseFill,
  PiPlayFill,
  PiDotsThreeOutlineFill,
} from 'react-icons/pi';
import Image from "next/image";

const Page = () => {
  const queue = usePlayerStore((s) => s.queue);
  const current_song = usePlayerStore((s)=> s.current_song)
  

  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(39,39,42,0.8),rgba(255,255,255,0))]'>
      <div className='grid w-full grid-cols-1 gap-2 p-3 md:gap-4 md:p-5'>
        <h2 className='text-2xl font-medium'>Queue</h2>

        { current_song ? <><h3 className='text-base font-medium text-zinc-400 truncate'>Now Playing</h3>
        <div className="w-full flex flex-col items-center justify-center">
        <MyTableRow song={current_song} idx={0}/></div></> : <p className="text-sm text-zinc-400">Queue is empty.</p> }

        {queue.songs.length>0 && <>
          <h3 className="text-base font-medium text-zinc-400 truncate">Next in queue</h3>
          <div className="w-full flex flex-col items-center justify-center">
            {queue.songs.map((song, idx)=><MyTableRow song={song} idx={1 + idx} key={song.id} p_idx={idx}/>)}
          </div>
        </>}

        {queue.playlist && <>
          <h3 className="text-base font-medium text-zinc-400 truncate">Next from: {queue.playlist.name}</h3>
          <div className="w-full flex flex-col items-center justify-center">
            { queue.playlist.songs.map((song, idx)=>{
              if(idx>=queue.playlist!.idx) return <MyTableRow song={{...song, playlist_id: queue.playlist!.id}} idx={1 + queue.songs.length + idx - queue.playlist!.idx} p_idx={idx} key={song.id}/>
            }) }
          </div>
        </>}
        
      </div>
    </ScrollArea>
  )
}

const MyTableRow = ({
  song,
  p_idx,
  idx,
}: {
  song: CurrentSong;
  idx: number;
  p_idx?: number;
}) => {
  const play_song = usePlayerStore((s) => s.play_song);
  const play_playlist = usePlayerStore((s) => s.play_playlist);
  const play_from_queue = usePlayerStore((s) => s.play_from_queue);

  const current_song = usePlayerStore((s) => s.current_song);
  const queue = usePlayerStore((s) => s.queue);
  const audio = usePlayerStore((s) => s.audio);
  const playing = usePlayerStore((s) => s.playing);

  const play = () => {
    if (current_song?.id === song.id) audio?.play();
    else{
      if(song.playlist_id===queue.playlist?.id){
        play_playlist(queue.playlist, p_idx!)
      }
      else play_from_queue(song, p_idx!)
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (playing && current_song?.id === song.id) {
      audio?.pause();
    } else {
      play();
    }
  };

  return (
    <div
      className='group flex h-12 w-full items-center justify-start gap-4 rounded-md px-2 py-1 text-sm hover:bg-zinc-800 md:h-16 md:px-4 md:py-2'
      onClick={handleClick}
    >
      <div className='flex w-6 flex-shrink-0 items-center justify-center'>
        <button
          onClick={handleClick}
          className='hidden flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 group-hover:flex'
        >
          {playing && current_song?.id === song.id ? (
            <PiPauseFill />
          ) : (
            <PiPlayFill />
          )}
        </button>
        <p className='truncate group-hover:invisible'>{idx + 1}</p>
      </div>
      <div className='flex h-full w-full items-center gap-2'>
        <div className='relative aspect-square h-full flex-shrink-0 overflow-hidden rounded'>
          <Image src={song.thumb_path} alt='Song thumb' fill sizes='48px' />
        </div>
        <p className='truncate'>{song.name}</p>
      </div>
    </div>
  );
};

export default Page