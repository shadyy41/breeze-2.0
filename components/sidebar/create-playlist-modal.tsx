import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { createPlaylist } from '@/app/actions';

const CreatePlaylistModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [playlistName, setPlaylistName] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const { data: session } = useSession();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(e.target.value);
  };

  const handleCreate = async () => {
    const toast_id = toast.loading('Creating playlist');

    try {
      if (!session) return;
      setCreating(true);
      const success = await createPlaylist(playlistName);
      if (success) {
        toast.success('Playlist created successfully.', { id: toast_id });
        setOpen(false);
      } else toast.error('Failed to create playlist.', { id: toast_id });
    } catch (error) {
      toast.error('Unexpected error during upload.');
    } finally {
      setPlaylistName('');
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Playlist</DialogTitle>
        </DialogHeader>
        <Input
          type='text'
          placeholder='Playlist name'
          value={playlistName}
          onChange={handleInputChange}
        />
        <Button
          onClick={handleCreate}
          variant={'pink'}
          disabled={!playlistName || creating}
        >
          {creating ? 'Creating playlist' : 'Create'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlaylistModal;
