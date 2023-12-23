import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ChangeEvent } from 'react';
import { Button } from '../ui/button';
import { PiUploadSimpleFill } from 'react-icons/pi';
import DropZone from './DropZone';
import { useCallback, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { createSong } from '@/app/actions';

interface SongData {
  name: string;
  songPath: string;
  imagePath: string;
}
export type { SongData };

const UploadButton: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  const [selectedSongFile, setSelectedSongFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const [songName, setSongName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const maxSongSizeInBytes: number = 6291456;
  const maxImageSizeInBytes: number = 1048576;
  const acceptedAudioPrefix: string = 'audio/';
  const acceptedImagePrefix: string = 'image/';

  const { data: session } = useSession();
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSongName(e.target.value);
  };

  // const handleUpload = useCallback(async () => {
  //   if (!selectedSongFile || !session || !selectedImageFile) return;
  //   const { supabaseAccessToken } = session;

  //   const supabase = createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? '',
  //     process.env.NEXT_PUBLIC_SUPABASE_API_KEY ?? '',
  //     {
  //       global: {
  //         headers: {
  //           Authorization: `Bearer ${supabaseAccessToken}`,
  //         },
  //       },
  //     }
  //   );

  //   setUploading(true);

  //   const { data, error } = await supabase.storage
  //     .from('songs')
  //     .upload(`${session.user.id}/songs/${songName}`, selectedSongFile);
  //   if (error) {
  //     console.log(error);
  //     if (error.message === 'The resource already exists') {
  //       toast({
  //         description: 'Song with the same name already exists.',
  //         variant: 'destructive',
  //       });
  //     } else {
  //       toast({
  //         description: 'Upload failed.',
  //         variant: 'destructive',
  //       });
  //     }
  //   } else {
  //     const songData: SongData = {
  //       name: songName,
  //       path: data.path,
  //     };

  //     const result2 = await supabase.storage
  //       .from('songs')
  //       .upload(`${session.user.id}/thumbs/${songName}`, selectedImageFile);

  //     const success: boolean = await createSong(songData);

  //     if (success) {
  //       toast({
  //         description: 'File uploaded successfully.',
  //         variant: 'default',
  //       });
  //     } else {
  //       /* Further error handling is ram bharose 🤞 */
  //       const { data, error } = await supabase.storage.from('songs').remove([songData.path])
  //       toast({
  //         description: 'Upload failed.',
  //         variant: 'destructive',
  //       });
  //     }
  //   }

  //   setUploading(false);
  // }, [selectedSongFile, session, songName, toast, selectedImageFile]);

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

      // Upload Song
      const { data: songData, error: songError } = await supabase.storage
        .from('songs')
        .upload(`${session.user.id}/songs/${songName}`, selectedSongFile);

      if (songError) {
        handleError(songError, 'Song');
        return;
      }

      // Upload Image
      const { data: imageData, error: imageError } = await supabase.storage
        .from('songs')
        .upload(`${session.user.id}/thumbs/${songName}`, selectedImageFile);

      if (imageError) {
        handleError(imageError, 'Image');
        // Rollback song upload on image upload failure
        await supabase.storage.from('songs').remove([songData.path]);
        return;
      }

      // Create Song
      const success: boolean = await createSong({
        name: songName,
        songPath: songData.path,
        imagePath: imageData.path,
      });

      if (success) {
        toast({
          description: 'File uploaded successfully.',
          variant: 'default',
        });
        handleCancel();
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
      console.error('Unexpected error during upload:', uploadError);
      toast({
        description: 'Unexpected error during upload.',
        variant: 'destructive',
      });
    } finally {
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
          console.log(file);
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
          <Input
            type='text'
            placeholder='Song name'
            value={songName}
            onChange={handleInputChange}
          />
          <DropZone
            onDrop={onDropSong}
            maxSizeInBytes={maxSongSizeInBytes}
            innerText='Drag & drop a song, or click to select (limit: 6 MB)'
          />
          <div className='text-sm'>
            {selectedSongFile ? (
              <p>
                Selected File:{' '}
                <span className='text-pink-700'>{selectedSongFile.name}</span>
              </p>
            ) : (
              <p>No song file selected.</p>
            )}
          </div>
          <DropZone
            onDrop={onDropImage}
            maxSizeInBytes={maxImageSizeInBytes}
            innerText='Drag & drop an image file, or click to select (limit: 1MB, aspect-ratio: 1/1)'
          />
          <div className='text-sm'>
            {selectedImageFile ? (
              <p>
                Selected File:{' '}
                <span className='text-pink-700'>{selectedImageFile.name}</span>
              </p>
            ) : (
              <p>No image file selected.</p>
            )}
          </div>
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
            <Button onClick={handleCancel} variant={'outline'}>
              Cancel
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default UploadButton;
