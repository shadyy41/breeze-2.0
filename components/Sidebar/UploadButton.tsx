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
import { uploadFile } from '@/lib/supabase';

const UploadButton: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const maxSizeInBytes: number = 6291456;
  const acceptedAudioPrefix: string = 'audio/';

  const handleUpload = useCallback(async() => {
    console.log("??")
    if(!selectedFile) return
    const res = await uploadFile(selectedFile)
  }, [selectedFile]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        console.log(`File size exceeds the limit.`);
      } else {
        acceptedFiles.forEach((file) => {
          if (file.type.startsWith(acceptedAudioPrefix)) {
            console.log(`Type: `, file.type);
            setSelectedFile(file);
          } else {
            console.log('Wrong file type.');
          }
        });
      }
    },
    []
  );

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
            <DialogTitle className='text-xl'>Upload Song</DialogTitle>
          </DialogHeader>
          <DropZone onDrop={onDrop} maxSizeInBytes={maxSizeInBytes} />
          <Button onClick={handleUpload} variant={'pink'} disabled={!selectedFile}>
            Upload
          </Button>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default UploadButton;
