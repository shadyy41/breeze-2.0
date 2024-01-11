import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { PiUploadSimpleFill } from 'react-icons/pi';
import DropZone from './drop-zone';
import { useCallback, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { createSong } from '@/app/actions';
import { v4 as uuidv4 } from 'uuid';

const UploadButton: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  const [selectedSongFile, setSelectedSongFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [songName, setSongName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const maxSongSizeInBytes: number = 6291456;
  const maxImageSizeInBytes: number = 1048576;
  const acceptedAudioPrefix: string = 'audio/';
  const acceptedImagePrefix: string = 'image/';

  const { data: session } = useSession();
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSongName(e.target.value);
  };

  const handleUpload = useCallback(async () => {
    if (!selectedSongFile || !session || !selectedImageFile) return;

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

    try {
      setUploading(true);

      const uniqueSongName = songName + uuidv4().toString();

      const { data: songData, error: songError } = await supabase.storage
        .from('songs')
        .upload(`${session.user.id}/songs/${uniqueSongName}`, selectedSongFile);

      if (songError) {
        handleError(songError, 'Song');
        return;
      }

      // Upload Image
      const { data: imageData, error: imageError } = await supabase.storage
        .from('songs')
        .upload(
          `${session.user.id}/thumbs/${uniqueSongName}`,
          selectedImageFile
        );

      if (imageError) {
        handleError(imageError, 'Image');
        // Rollback song upload on image upload failure
        await supabase.storage.from('songs').remove([songData.path]);
        return;
      }

      // Create Song
      const success: boolean = await createSong({
        name: songName,
        song_path: songData.path,
        thumb_path: imageData.path,
        private: isPrivate,
      });

      if (success) {
        toast({
          description: 'Song uploaded successfully.',
          variant: 'default',
        });
        setDialogOpen(false);
      } else {
        // Rollback on song creation failure
        await supabase.storage.from('songs').remove([songData.path]);
        await supabase.storage.from('songs').remove([imageData.path]);
        toast({
          description: 'Upload failed.',
          variant: 'destructive',
        });
      }
    } catch (uploadError) {
      toast({
        description: 'Unexpected error during upload.',
        variant: 'destructive',
      });
    } finally {
      handleCancel();
      setUploading(false);
    }

    function handleError(error: any, fileType: string) {
      if (error.message === 'The resource already exists') {
        toast({
          description: `${fileType} with the same name already exists.`,
          variant: 'destructive',
        });
      } else {
        toast({
          description: `Upload failed for ${fileType.toLowerCase()}.`,
          variant: 'destructive',
        });
      }
    }
  }, [
    selectedSongFile,
    session,
    songName,
    toast,
    selectedImageFile,
    setUploading,
    isPrivate,
  ]);

  const handleCancel = () => {
    setSelectedSongFile(null);
    setSelectedImageFile(null);
    setSongName('');
  };

  const onDropSong = useCallback(
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
          setSelectedSongFile(file);
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

  const onDropImage = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        toast({
          description: 'File size exceeds the limit.',
          variant: 'destructive',
        });
        return;
      }
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith(acceptedImagePrefix)) {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            if (aspectRatio === 1 / 1) {
              setSelectedImageFile(file);
            } else {
              toast({
                description: 'Wrong aspect ratio.',
                variant: 'destructive',
              });
            }
            URL.revokeObjectURL(img.src);
          };
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
      <div className='full'>
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
      </div>
    );
  }

  if (!session.user.admin && session.user.upload_count >= 4) {
    return (
      <div className='full'>
        <Button
          variant={'skeleton'}
          size={'skeleton'}
          className='gap-4 transition-colors hover:text-zinc-100'
          onClick={() => {
            toast({
              description: 'You can only upload upto 4 songs.',
              variant: 'destructive',
            });
          }}
        >
          <PiUploadSimpleFill className='flex-shrink-0 text-2xl' />
          {expanded && 'Upload Song'}
        </Button>
      </div>
    );
  }

  return (
    <div className='w-full'>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
          <Input
            type='text'
            placeholder='Song name'
            value={songName}
            onChange={handleInputChange}
          />
          <DropZone
            onDrop={onDropSong}
            maxSizeInBytes={maxSongSizeInBytes}
            innerText={`${
              selectedSongFile
                ? `Selected File: ${selectedSongFile.name}`
                : 'Drag & drop a song, or click to select (limit: 6 MB)'
            }`}
          />
          <DropZone
            onDrop={onDropImage}
            maxSizeInBytes={maxImageSizeInBytes}
            innerText={`${
              selectedImageFile
                ? `Selected File: ${selectedImageFile.name}`
                : 'Drag & drop an image, or click to select (limit: 6 MB, ratio: 1/1)'
            }`}
          />

          <Button
            onClick={handleUpload}
            variant={'pink'}
            disabled={
              !selectedSongFile || !songName || uploading || !selectedImageFile
            }
          >
            {uploading ? 'Uploading' : 'Upload'}
          </Button>

          {(selectedSongFile || selectedImageFile) && (
            <Button
              onClick={handleCancel}
              variant={'outline'}
              disabled={uploading}
            >
              Cancel
            </Button>
          )}

          {session.user.admin && (
            <div className='flex flex-col items-start gap-2 rounded-md border border-zinc-800 p-4'>
              <p className='text-xs'>
                Admin Only - {isPrivate ? 'Private Song' : 'Public Song'}
              </p>
              <Switch
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                className=''
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadButton;
