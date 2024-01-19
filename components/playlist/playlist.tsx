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
import { useEffect, useState } from 'react';
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
import Image from 'next/image';
import toast from 'react-hot-toast';

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
        <Playbar playlist={playlist} is_upload={is_upload} />
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

  const current_playing =
    current_song?.playlist_id === playlist.id && current_song?.id === song.id;

  const play = () => {
    if (current_song?.id === song.id) audio?.play();
    else play_playlist(playlist, idx);
  };

  const handleClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();

    if (playing && current_playing) {
      audio?.pause();
    } else {
      play();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleClick(e);
    }
  };

  return (
    <div
      className='group flex h-14 w-full items-center justify-start gap-4 rounded-md px-2 py-1 text-sm ring-offset-zinc-800 transition-colors hover:bg-zinc-800 hover:bg-zinc-800/50 focus:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 md:h-16 md:px-4 md:py-2'
      onClick={handleClick}
      role='button'
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div className='flex w-6 flex-shrink-0 items-center justify-center truncate'>
        <button
          onClick={handleClick}
          className={`flex-shrink-0 items-center justify-center rounded-full text-zinc-400 ring-offset-zinc-950 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2 ${
            current_playing ? 'flex' : 'hidden group-hover:flex'
          }`}
        >
          <PiPauseFill
            className={`${playing && current_playing ? 'flex' : 'hidden'}`}
          />
          <PiPlayFill
            className={`${!(playing && current_playing) ? 'flex' : 'hidden'}`}
          />
        </button>
        {!current_playing && (
          <p className='truncate group-hover:invisible'>{idx + 1}</p>
        )}
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
  const cascade_song_remove = usePlayerStore((s) => s.cascade_song_remove);
  const cascade_song_delete = usePlayerStore((s) => s.cascade_song_delete);
  const current_song = usePlayerStore((s) => s.current_song);

  const push = usePlayerStore((s) => s.push_song);

  const handlePush = (e: Event) => {
    e.stopPropagation();
    push(song);
    toast.success(`${song.name} added to the queue`);
  };

  const handleDelete = async () => {
    const toast_id = toast.loading('Deleting song');
    setDeleting(true);
    try {
      const { id } = song;
      if (id === current_song?.id) {
        toast.error('This song is currently being played.', { id: toast_id });
        return;
      }
      const res = await deleteSong(id);
      if (!res) {
        toast.error('An error occured.', { id: toast_id });
      } else {
        cascade_song_delete(id);
        toast.success('Song deleted.', { id: toast_id });
      }
    } catch (error) {
      toast.error('An error occured.', { id: toast_id });
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const handleRemove = async () => {
    const toast_id = toast.loading('Removing song');
    setDeleting(true);
    try {
      const { id: song_id, playlist_id } = song;
      const res = await removeSong(playlist_id, song_id);
      if (!res) {
        toast.error('An error occured.', { id: toast_id });
      } else {
        cascade_song_remove(song_id, playlist_id);
        toast.success('Song removed from playlist.', { id: toast_id });
      }
    } catch (error) {
      toast.error('An error occured.', { id: toast_id });
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
          <button className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xl text-zinc-400 ring-offset-zinc-100/0 transition-colors hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 focus-visible:ring-offset-2'>
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
        song={song}
      />
    </div>
  );
};

export default Playlist;
