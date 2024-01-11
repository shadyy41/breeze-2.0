import { PiMusicNotesFill } from 'react-icons/pi';
import Image from 'next/image';
import { Song } from '@/types/types';

const PlaylistIcon = ({ songs }: { songs: Song[] }) => {
  const { length } = songs;
  if (!length)
    return (
      <div
        aria-hidden='true'
        className='flex aspect-square h-full flex-shrink-0 items-center justify-center bg-zinc-800 text-3xl text-zinc-400'
      >
        <PiMusicNotesFill />
      </div>
    );

  if (length < 4) {
    return (
      <div className='relative aspect-square h-full flex-shrink-0 bg-zinc-900'>
        <Image
          src={songs[0].thumb_path}
          alt='Playlist Icon'
          fill
          sizes='max-width: 238px'
        />
      </div>
    );
  }
  return (
    <div className='relative grid aspect-square h-full flex-shrink-0 grid-cols-2 gap-0 bg-zinc-900'>
      {songs.map((song, idx) => {
        if (idx >= 4) return;
        return (
          <div className='relative' key={song.id}>
            <Image
              src={song.thumb_path}
              alt='Playlist Icon'
              fill
              sizes='max-width: 120px'
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistIcon;
