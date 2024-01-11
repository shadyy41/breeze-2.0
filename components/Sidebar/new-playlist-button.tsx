import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { PiMusicNotesPlusFill } from 'react-icons/pi';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { createPlaylist } from '@/app/actions';

const NewPlaylistButton: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [playlistName, setPlaylistName] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const { data: session } = useSession();
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlaylistName(e.target.value);
  };

  const handleCreate = async () => {
    if (!session) return;
    setCreating(true);

    const success = await createPlaylist(playlistName);

    if (success) {
      toast({
        description: 'Playlist created successfully.',
        variant: 'default',
      });
      setOpen(false);
    } else
      toast({
        description: 'Failed to create playlist.',
        variant: 'destructive',
      });

    setCreating(false);
  };

  if (!session) {
    return (
      <footer className='full'>
        <Button
          variant={'skeleton'}
          size={'skeleton'}
          className='gap-4 transition-colors hover:text-zinc-100'
          onClick={() => {
            toast({
              description: 'You must be signed in to upload songs.',
              variant: 'destructive',
            });
          }}
        >
          <PiMusicNotesPlusFill className='flex-shrink-0 text-2xl' />
          {expanded && 'Upload Song'}
        </Button>
      </footer>
    );
  }

  return (
    <footer className='w-full'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={'skeleton'}
            size={'skeleton'}
            className='gap-4 transition-colors hover:text-zinc-100'
          >
            <PiMusicNotesPlusFill className='flex-shrink-0 text-2xl' />
            {expanded && 'Create Playlist'}
          </Button>
        </DialogTrigger>
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
    </footer>
  );
};

export default NewPlaylistButton;
