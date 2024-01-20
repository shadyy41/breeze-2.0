'use client';
import {
  PiPauseFill,
  PiPlayFill,
  PiDotsThreeOutlineFill,
} from 'react-icons/pi';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '../ui/button';
import { deletePlaylist } from '@/app/actions';
import { useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import usePlayerStore from '@/lib/store';
import { Playlist, Song } from '@/types/types';

const Playbar = ({
  playlist,
  is_upload,
  is_public,
}: {
  playlist: Playlist;
  is_upload: boolean;
  is_public: boolean;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const router = useRouter();
  const play_playlist = usePlayerStore((s) => s.play_playlist);
  const queue = usePlayerStore((s) => s.queue);
  const push_song = usePlayerStore((s) => s.push_song);
  const playing = usePlayerStore((s) => s.playing);
  const current_song = usePlayerStore((s) => s.current_song);
  const audio = usePlayerStore((s) => s.audio);
  const cascade_playlist_delete = usePlayerStore(
    (s) => s.cascade_playlist_delete
  );

  const isCurrentPlaying = useMemo(() => {
    if (!playing || !(queue.playlist?.id === playlist.id)) return false;

    for (let x of playlist.songs) {
      if (x.id === current_song?.id) return true;
    }

    return false;
  }, [current_song, playing, queue.playlist, playlist.id, playlist.songs]);

  const handlePlay = () => {
    if (playlist.songs.length === 0) return;

    if (isCurrentPlaying) audio?.pause();
    else {
      if (queue.playlist?.id === playlist.id) audio?.play();
      else play_playlist(playlist, 0);
    }
  };

  const handleDelete = async () => {
    if (is_public) return;
    const toast_id = toast.loading('Deleting playlist');
    setDeleting(true);
    try {
      const { id } = playlist;
      const res = await deletePlaylist(id);
      if (!res) {
        toast.error('An error occured.', { id: toast_id });
      } else {
        cascade_playlist_delete(id);
        router.replace('/');
        toast.success('Playlist deleted.', { id: toast_id });
      }
    } catch (error) {
      toast.error('An error occured.', { id: toast_id });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const addToQueue = () => {
    if (playlist.songs.length === 0) return;
    for (const song of playlist.songs) {
      push_song({ ...song, playlist_id: playlist.id });
    }
    toast.success('Added playlist to the queue.');
  };

  return (
    <div className='flex w-full items-center gap-4 px-2'>
      <button
        onClick={handlePlay}
        className='flex flex-shrink-0 transform items-center justify-center rounded-full bg-zinc-300 p-3 text-2xl text-black  ring-offset-zinc-950 transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 active:scale-95'
      >
        {isCurrentPlaying ? <PiPauseFill /> : <PiPlayFill />}
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='flex flex-shrink-0 items-center justify-center rounded-full text-2xl text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'>
            <PiDotsThreeOutlineFill />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {!(is_upload || is_public) && (
            <DropdownMenuItem
              onSelect={() => toast.error('Feature not implemented yet.')}
            >
              Edit Details
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={addToQueue}>
            Add To Queue
          </DropdownMenuItem>
          {!(is_upload || is_public) && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
                Delete Playlist
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              onClick={handleDelete}
              variant={'destructive'}
              disabled={deleting}
            >
              {deleting ? 'Deleting' : 'Delete'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Playbar;
