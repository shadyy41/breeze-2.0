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
import { useToast } from '../ui/use-toast';
import { useRouter } from 'next/navigation';
import usePlayerStore from '@/lib/store';
import { Playlist, Song } from '@/types/types';

const Playbar = ({ playlist }: { playlist: Playlist }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();
  const play_playlist = usePlayerStore((s) => s.play_playlist);
  const queue = usePlayerStore((s) => s.queue);
  const push_song = usePlayerStore((s) => s.push_song);
  const playing = usePlayerStore((s) => s.playing);
  const current_song = usePlayerStore((s) => s.current_song);
  const audio = usePlayerStore((s) => s.audio);

  const isCurrentPlaying = useMemo(() => {
    if (!playing || !(queue.playlist?.id === playlist.id)) return false;

    for (let x of playlist.songs) {
      if (x.id === current_song?.id) return true;
    }

    return false;
  }, [current_song, playing, queue.playlist]);

  const handlePlay = () => {
    if (isCurrentPlaying) audio?.pause();
    else {
      if (queue.playlist?.id === playlist.id) audio?.play();
      else play_playlist(playlist, 0);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deletePlaylist(playlist.id);
      if (!res) {
        toast({
          description: 'An error occured.',
          variant: 'destructive',
        });
      } else {
        router.replace('/');
        toast({ description: `Playlist deleted.` });
      }
    } catch (error) {
      toast({
        description: 'An error occured.',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const addToQueue = () => {
    for (const song of playlist.songs) {
      push_song({ ...song, playlist_id: playlist.id });
    }
    toast({ description: 'Added playlist to the queue.' });
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
          <DropdownMenuItem
            onSelect={() =>
              toast({ description: 'Feature not implemented yet :)' })
            }
          >
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={addToQueue}>
            Add To Queue
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
            Delete Playlist
          </DropdownMenuItem>
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
