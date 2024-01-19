import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PiHouse,
  PiHouseFill,
  PiMagnifyingGlass,
  PiMagnifyingGlassFill,
  PiMusicNotesPlusFill,
  PiUploadSimpleFill,
} from 'react-icons/pi';
import { Button } from '../ui/button';
import UploadSongModal from './upload-song-modal';
import CreatePlaylistModal from './create-playlist-modal';
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import usePlayerStore from '@/lib/store';
import { PLAYLIST_COUNT_LIMIT, UPLOAD_COUNT_LIMIT } from '@/lib/limits';

const TopMenu = ({
  upload_count,
  playlist_count,
}: {
  playlist_count: number;
  upload_count: number;
}) => {
  const path = usePathname();
  const { data: session } = useSession();
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState<boolean>(false);
  const [uploadSongOpen, setUploadSongOpen] = useState<boolean>(false);
  const sidebar_expanded = usePlayerStore((s) => s.sidebar_expanded);

  const handleCreatePlaylist = async () => {
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
    <div className='flex flex-col gap-5 rounded-md border border-zinc-800 bg-zinc-950 px-6 py-5 font-medium'>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/'}
          className={`flex items-center justify-start gap-4 transition-colors hover:text-zinc-100 ${
            path === '/' && 'text-zinc-100'
          }`}
        >
          {path === '/' ? (
            <PiHouseFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiHouse className='flex-shrink-0 text-2xl' />
          )}
          {sidebar_expanded && 'Home'}
        </Link>
      </Button>
      <Button variant={'skeleton'} size={'skeleton'} asChild>
        <Link
          href={'/search'}
          className={`flex items-center justify-start gap-4 transition-colors hover:text-zinc-100 ${
            path === '/search' && 'text-zinc-100'
          }`}
        >
          {path === '/search' ? (
            <PiMagnifyingGlassFill className='flex-shrink-0 text-2xl text-zinc-100' />
          ) : (
            <PiMagnifyingGlass className='flex-shrink-0 text-2xl' />
          )}
          {sidebar_expanded && 'Search'}
        </Link>
      </Button>
      <Separator />
      <Button
        variant={'skeleton'}
        size={'skeleton'}
        className='gap-4 transition-colors hover:text-zinc-100'
        onClick={handleCreatePlaylist}
      >
        <PiMusicNotesPlusFill className='flex-shrink-0 text-2xl' />
        {sidebar_expanded && 'Create Playlist'}
      </Button>
      <Button
        variant={'skeleton'}
        size={'skeleton'}
        className='gap-4 transition-colors hover:text-zinc-100'
        onClick={handleUploadSong}
      >
        <PiUploadSimpleFill className='flex-shrink-0 text-2xl' />
        {sidebar_expanded && 'Upload Song'}
      </Button>

      <CreatePlaylistModal
        open={createPlaylistOpen}
        setOpen={setCreatePlaylistOpen}
      />
      <UploadSongModal open={uploadSongOpen} setOpen={setUploadSongOpen} />
    </div>
  );
};

export default TopMenu;
