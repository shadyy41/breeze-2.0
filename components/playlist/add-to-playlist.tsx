import { addToPlaylist, getUserPlaylists } from '@/app/actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Playlist } from '@/types/types';
import { useEffect, useState } from 'react';
import { SetStateAction, Dispatch } from 'react';
import { useToast } from '../ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const AddToPlaylist = ({
  dialogOpen,
  setDialogOpen,
  songId,
}: {
  dialogOpen: boolean;
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
  songId: string;
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [adding, setAdding] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let data = await getUserPlaylists();
        data = data.filter((playlist) => {
          let hasSong = false;
          playlist.songs.map((song) => {
            if (song.id === songId) {
              hasSong = true;
            }
          });
          return !hasSong;
        });
        setPlaylists(data);
      } catch (error) {
        toast({
          description: 'An error occured.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    if (dialogOpen) fetchData();
  }, [dialogOpen]);

  const handleAdd = async (playlist_id: string, playlist_name: string) => {
    setAdding(true);
    try {
      const res = await addToPlaylist(playlist_id, songId);
      if (!res) {
        toast({
          description: 'An error occured.',
          variant: 'destructive',
        });
      } else {
        setPlaylists((playlists) =>
          playlists.filter((p) => p.id !== playlist_id)
        );
        toast({ description: `Song added to ${playlist_name}` });
      }
    } catch (error) {
      toast({
        description: 'An error occured.',
        variant: 'destructive',
      });
    } finally {
      setAdding(false);
      setDialogOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger />
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
                Add
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
