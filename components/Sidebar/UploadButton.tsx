import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { PiUploadSimpleFill } from 'react-icons/pi';
import DropZone from './DropZone';
import { useCallback, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

const UploadButton: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const maxSizeInBytes: number = 6291456;
  const acceptedAudioPrefix: string = 'audio/';
  const { data: session } = useSession();
  const { toast } = useToast();

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !session) return;
    const { supabaseAccessToken } = session;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${supabaseAccessToken}`,
          },
        },
      }
    );

    const { data, error } = await supabase.storage
      .from('songs')
      .upload(`${Math.random()}`, selectedFile);
    if (error) {
      console.log('Upload failed :)', error);
    } else {
      console.log('File Uploaded Successfully.', data);
    }
  }, [selectedFile, session]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        toast({
          description: 'File size exceeds the limit.',
          variant: 'destructive',
        });
        return;
      }
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith(acceptedAudioPrefix)) {
          console.log(`Type: `, file.type);
          setSelectedFile(file);
        } else {
          toast({
            description: 'Wrong file type.',
            variant: 'destructive',
          });
        }
      });
    },
    [toast]
  );

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
          <PiUploadSimpleFill className='flex-shrink-0 text-2xl' />
          {expanded && 'Upload Song'}
        </Button>
      </footer>
    );
  }

  return (
    <footer className='w-full'>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={'skeleton'}
            size={'skeleton'}
            className='gap-4 transition-colors hover:text-zinc-100'
          >
            <PiUploadSimpleFill className='flex-shrink-0 text-2xl' />
            {expanded && 'Upload Song'}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Song</DialogTitle>
          </DialogHeader>
          <DropZone onDrop={onDrop} maxSizeInBytes={maxSizeInBytes} />
          <div className='text-sm'>
            {selectedFile ? (
              <p>
                Selected File:{' '}
                <span className='text-pink-700'>{selectedFile.name}</span>
              </p>
            ) : (
              <p>No files selected.</p>
            )}
          </div>
          <Button
            onClick={handleUpload}
            variant={'pink'}
            disabled={!selectedFile}
          >
            Upload
          </Button>
          {selectedFile && (
            <Button onClick={() => setSelectedFile(null)} variant={'outline'}>
              Cancel
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default UploadButton;
