import { addToPlaylist, getCachedUserPlaylists } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Playlist, Song } from '@/types/types';
import { useEffect, useState } from 'react';
import { SetStateAction, Dispatch } from 'react';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useSession } from 'next-auth/react';
import usePlayerStore from '@/lib/store';

const AddToPlaylist = ({
  dialogOpen,
  setDialogOpen,
  song,
}: {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  song: Song;
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);
  const cascade_song_add = usePlayerStore((s) => s.cascade_song_add);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data = await getCachedUserPlaylists(session!.user.id);
        data = data.filter((playlist) => {
          let hasSong = false;
          playlist.songs.map((s) => {
            if (s.id === song.id) {
              hasSong = true;
            }
          });
          return !hasSong;
        });
        setPlaylists(data);
      } catch (error) {
        toast.error('An error occured.');
      } finally {
        setLoading(false);
      }
    };

    if (dialogOpen && session) fetchData();
  }, [dialogOpen, session, song.id]);

  const handleAdd = async (playlist_id: string, playlist_name: string) => {
    const toast_id = toast.loading(`Adding song to ${playlist_name}`);
    setAdding(true);
    try {
      const res = await addToPlaylist(playlist_id, song.id);
      if (!res) {
        toast.error('An error occured.');
      } else {
        setPlaylists((playlists) =>
          playlists.filter((p) => p.id !== playlist_id)
        );
        cascade_song_add(song, playlist_id);
        toast.success(`Song added to ${playlist_name}`, { id: toast_id });
      }
    } catch (error) {
      toast.error('An error occured.', { id: toast_id });
    } finally {
      setAdding(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add To Playlist</DialogTitle>
        </DialogHeader>
        <Separator />
        {loading && !playlists.length && (
          <>
            <Skeleton className='h-8 w-full rounded-md' />
            <Skeleton className='h-8 w-full rounded-md' />
            <Skeleton className='h-8 w-full rounded-md' />
          </>
        )}
        {playlists.map((e, idx) => {
          return (
            <div
              key={idx}
              className='item-center flex w-full justify-between text-sm'
            >
              <p className='flex items-center justify-start'>{e.name}</p>
              <Button
                variant={'outline'}
                className='h-fit'
                onClick={(x) => handleAdd(e.id, e.name)}
                disabled={adding}
              >
                {adding ? 'Adding' : 'Add'}
              </Button>
            </div>
          );
        })}
        {!loading && !playlists.length && (
          <p className='text-sm font-normal'>You do not have any playlists.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddToPlaylist;
