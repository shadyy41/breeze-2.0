'use client';

import {
  PiMusicNotesPlusFill,
  PiUploadSimpleFill,
  PiUsersThreeFill,
} from 'react-icons/pi';
import { useSession } from 'next-auth/react';
import CreatePlaylistModal from '../sidebar/create-playlist-modal';
import { useState } from 'react';
import toast from 'react-hot-toast';
import UploadSongModal from '../sidebar/upload-song-modal';
import { Playlist } from '@/types/types';
import PlaylistTile from '../playlist-tile';
import { PLAYLIST_COUNT_LIMIT, UPLOAD_COUNT_LIMIT } from '@/lib/limits';

const ButtonsGrid = ({
  uploads,
  upload_count,
  playlist_count,
}: {
  uploads: Playlist;
  playlist_count: number;
  upload_count: number;
}) => {
  const { data: session } = useSession();
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState<boolean>(false);
  const [uploadSongOpen, setUploadSongOpen] = useState<boolean>(false);

  const handleCreatePlaylist = () => {
    if (!session) {
      toast.error('You must be signed in to create playlists.');
    } else if (playlist_count >= PLAYLIST_COUNT_LIMIT) {
      toast.error(
        `You can only create upto ${PLAYLIST_COUNT_LIMIT} playlists.`
      );
    } else {
      setCreatePlaylistOpen(true);
    }
  };

  const handleUploadSong = () => {
    if (!session) {
      toast.error('You must be signed in to upload songs.');
    } else if (!session.user.admin && upload_count >= UPLOAD_COUNT_LIMIT) {
      toast.error(`You can only upload upto ${UPLOAD_COUNT_LIMIT} songs.`);
    } else {
      setUploadSongOpen(true);
    }
  };

  return (
    <div className='grid grid-cols-2 gap-2 lg:grid-cols-4'>
      <button
        className='flex h-14 w-full items-center justify-between gap-2 rounded rounded-l-md bg-zinc-900 pr-2 ring-offset-zinc-950 transition-colors hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
        onClick={handleCreatePlaylist}
      >
        <div className={`flex h-full w-full items-center justify-start gap-2`}>
          <div className='flex aspect-square h-full flex-shrink-0 items-center justify-center overflow-hidden rounded-l bg-zinc-800 text-2xl text-zinc-400 shadow-sm'>
            <PiMusicNotesPlusFill />
          </div>
          <p className='truncate text-sm font-medium'>Create Playlist</p>
        </div>
      </button>
      <button
        className='flex h-14 w-full items-center justify-between gap-2 rounded rounded-l-md bg-zinc-900 pr-2 ring-offset-zinc-950 transition-colors hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'
        onClick={handleUploadSong}
      >
        <div className={`flex h-full w-full items-center justify-start gap-2`}>
          <div className='flex aspect-square h-full flex-shrink-0 items-center justify-center overflow-hidden rounded-l bg-zinc-800 text-2xl text-zinc-400 shadow-sm'>
            <PiUploadSimpleFill />
          </div>
          <p className='truncate text-sm font-medium'>Upload Song</p>
        </div>
      </button>
      <button className='flex h-14 w-full items-center justify-between gap-2 rounded rounded-l-md bg-zinc-900 pr-2 ring-offset-zinc-950 transition-colors hover:bg-zinc-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'>
        <div className={`flex h-full w-full items-center justify-start gap-2`}>
          <div className='flex aspect-square h-full flex-shrink-0 items-center justify-center overflow-hidden rounded-l bg-zinc-800 text-2xl text-zinc-400 shadow-sm'>
            <PiUsersThreeFill />
          </div>
          <p className='truncate text-sm font-medium'>Create Room</p>
        </div>
      </button>
      <PlaylistTile playlist={uploads} is_upload />
      <CreatePlaylistModal
        open={createPlaylistOpen}
        setOpen={setCreatePlaylistOpen}
      />
      <UploadSongModal open={uploadSongOpen} setOpen={setUploadSongOpen} />
    </div>
  );
};

export default ButtonsGrid;
