'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  PiPauseFill,
  PiPlayFill,
  PiDotsThreeOutlineFill,
  PiDotsThreeOutlineVerticalFill,
} from 'react-icons/pi';

import PlaylistIcon from '@/components/playlist-icon';
import { Badge } from '@/components/ui/badge';
import { Playlist, Song } from '@/types/types';
import Playbar from '@/components/playlist/playbar';
import usePlayerStore, { CurrentSong } from '@/lib/store';
import { useState } from 'react';
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

import AddToPlaylist from './add-to-playlist';
import { Button } from '../ui/button';
import { deleteSong, removeSong } from '@/app/actions';
import { useToast } from '../ui/use-toast';
import Image from 'next/image';

const Playlist = ({
  playlist,
  is_upload,
}: {
  playlist: Playlist;
  is_upload: boolean;
}) => {
  return (
    <ScrollArea className='h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(39,39,42,0.8),rgba(255,255,255,0))]'>
      <div className='grid w-full grid-cols-1 gap-2 p-3 pb-32 md:gap-4 md:p-5 md:pb-5'>
        <header className='flex h-fit w-full flex-col items-center gap-4 p-2 md:h-64 md:flex-row md:gap-6'>
          <div className='aspect-square h-full w-3/4 max-w-xs flex-shrink-0 overflow-hidden rounded shadow md:w-fit'>
            <PlaylistIcon songs={playlist.songs} />
          </div>
          <div className='flex w-full flex-col justify-center gap-2 md:max-w-[calc(100%-296px)]'>
            <Badge variant={'pink'}>Private</Badge>
            <h2 className='w-full truncate text-2xl font-medium md:text-5xl md:leading-relaxed'>
              {playlist.name}
            </h2>
          </div>
        </header>
        <Playbar playlist={playlist} />
        <div className='flex flex-col gap-2 pb-10 text-sm md:gap-4'>
          <div className='flex h-12 w-full items-center justify-start gap-4 border-b border-zinc-800 px-3 text-zinc-400 md:px-4'>
            <div className='flex w-6 flex-shrink-0 items-center justify-center truncate'>
              #
            </div>
            <div className='w-2/5 truncate'>Title</div>
            <div className='hidden w-2/5 truncate md:flex'>
              {is_upload ? 'Upload Date' : 'Date Added'}
            </div>
          </div>
          <div>
            {playlist.songs.map((song, idx) => (
              <MyTableRow
                song={song}
                playlist={playlist}
                idx={idx}
                is_upload={is_upload}
                key={song.id}
              />
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

const MyTableRow = ({
  song,
  playlist,
  idx,
  is_upload,
}: {
  song: Song;
  playlist: Playlist;
  idx: number;
  is_upload: boolean;
}) => {
  const play_playlist = usePlayerStore((s) => s.play_playlist);
  const current_song = usePlayerStore((s) => s.current_song);
  const audio = usePlayerStore((s) => s.audio);
  const playing = usePlayerStore((s) => s.playing);

  const play = () => {
    if (current_song?.id === song.id) audio?.play();
    else play_playlist(playlist, idx);
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
      className='group flex h-14 w-full items-center justify-start gap-4 rounded-md px-2 py-1 text-sm hover:bg-zinc-800 md:h-16 md:px-4 md:py-2'
      onClick={handleClick}
    >
      <div className='flex w-6 flex-shrink-0 items-center justify-center truncate'>
        <button
          onClick={handleClick}
          className='hidden flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 group-hover:flex'
        >
          {playing &&
          current_song?.playlist_id === playlist.id &&
          current_song?.id === song.id ? (
            <PiPauseFill />
          ) : (
            <PiPlayFill />
          )}
        </button>
        <p className='truncate group-hover:invisible'>{idx + 1}</p>
      </div>
      <div className='flex h-full w-full items-center gap-2 md:w-2/5'>
        <div className='relative aspect-square h-full flex-shrink-0 overflow-hidden rounded'>
          <Image src={song.thumb_path} alt='Song thumb' fill sizes='48px' />
        </div>
        <p className='truncate'>{song.name}</p>
      </div>
      <div className='hidden h-full w-2/5 items-center gap-3 md:flex'>
        <p className='truncate'>
          {is_upload ? song.created_at : song.date_added}
        </p>
        <TableDropdown
          song={{ ...song, playlist_id: playlist.id }}
          is_upload={is_upload}
        />
      </div>
      <div className='md:hidden'>
        <TableDropdown
          song={{ ...song, playlist_id: playlist.id }}
          is_upload={is_upload}
        />
      </div>
    </div>
  );
};

const TableDropdown = ({
  song,
  is_upload,
}: {
  song: CurrentSong;
  is_upload: boolean;
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  const push = usePlayerStore((s) => s.push_song);

  const { toast } = useToast();

  const handlePush = (e: Event) => {
    e.stopPropagation();
    push(song);
    toast({ description: `${song.name} added to the queue` });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteSong(song.id);
      if (!res) {
        toast({
          description: 'An error occured.',
          variant: 'destructive',
        });
      } else {
        toast({ description: `Song deleted.` });
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

  const handleRemove = async () => {
    setDeleting(true);
    try {
      const res = await removeSong(song.playlist_id, song.id);
      if (!res) {
        toast({
          description: 'An error occured.',
          variant: 'destructive',
        });
      } else {
        toast({ description: `Song removed from playlist.` });
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

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className='relative flex items-center' onClick={stopPropagation}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className='flex w-8 flex-shrink-0 items-center justify-center rounded-full text-xl text-zinc-400 ring-offset-zinc-800 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 md:invisible md:group-hover:visible'>
            <PiDotsThreeOutlineFill className='hidden md:flex' />
            <PiDotsThreeOutlineVerticalFill className='md:hidden' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setPlaylistDialogOpen(true)}>
            Add To Playlist
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handlePush}>
            Add To Queue
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
            {is_upload ? 'Delete Song' : 'Remove'}
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
              onClick={is_upload ? handleDelete : handleRemove}
              variant={'destructive'}
              disabled={deleting}
            >
              {is_upload
                ? deleting
                  ? 'Deleting'
                  : 'Delete'
                : deleting
                  ? 'Removing'
                  : 'Remove'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AddToPlaylist
        dialogOpen={playlistDialogOpen}
        setDialogOpen={setPlaylistDialogOpen}
        songId={song.id}
      />
    </div>
  );
};

export default Playlist;
