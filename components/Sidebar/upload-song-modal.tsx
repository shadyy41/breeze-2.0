import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { ChangeEvent, Dispatch, SetStateAction, useEffect } from 'react';
import { Button } from '../ui/button';
import DropZone from './drop-zone';
import { useCallback, useState } from 'react';
import { FileRejection } from 'react-dropzone';
import { useSession } from 'next-auth/react';
import { createClient } from '@supabase/supabase-js';
import { Input } from '@/components/ui/input';
import { createSong } from '@/app/actions';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

const UploadSongModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [selectedSongFile, setSelectedSongFile] = useState<File | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [songName, setSongName] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(true);

  const maxSongSizeInBytes: number = 6291456;
  const maxImageSizeInBytes: number = 1048576;
  const acceptedAudioPrefix: string = 'audio/';
  const acceptedImagePrefix: string = 'image/';

  const { data: session } = useSession();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSongName(e.target.value);
  };

  const handleUpload = useCallback(async () => {
    const toast_id = toast.loading('Uploading song');

    try {
      setUploading(true);

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
        toast.success('Song uploaded successfully.', { id: toast_id });
        handleCancel();
        setOpen(false);
      } else {
        // Rollback on song creation failure
        await supabase.storage.from('songs').remove([songData.path]);
        await supabase.storage.from('songs').remove([imageData.path]);
        toast.error('Upload failed.', { id: toast_id });
      }
    } catch (uploadError) {
      toast.error('Unexpected error during upload.', { id: toast_id });
    } finally {
      handleCancel();
      setUploading(false);
    }

    function handleError(error: any, fileType: string) {
      if (error.message === 'The resource already exists') {
        toast.error(`${fileType} with the same name already exists.`, {
          id: toast_id,
        });
      } else {
        toast.error(`Upload failed for ${fileType.toLowerCase()}.`, {
          id: toast_id,
        });
      }
    }
  }, [
    selectedSongFile,
    session,
    songName,
    selectedImageFile,
    setUploading,
    isPrivate,
    setOpen,
  ]);

  const handleCancel = () => {
    setSelectedSongFile(null);
    setSelectedImageFile(null);
    setSongName('');
  };

  const onDropSong = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        toast.error('File size exceeds the limit.');
        return;
      }
      acceptedFiles.forEach((file) => {
        if (file.type.startsWith(acceptedAudioPrefix)) {
          setSelectedSongFile(file);
        } else {
          toast.error('Wrong file type.');
        }
      });
    },
    []
  );

  const onDropImage = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (rejectedFiles.length > 0) {
        toast.error('File size exceeds the limit.');
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
              toast.error('Wrong aspect ratio.');
            }
            URL.revokeObjectURL(img.src);
          };
        } else {
          toast.error('Wrong file type.');
        }
      });
    },
    []
  );

  if (!session) return <></>;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <p className='text-xs'>
          Admin Only - {isPrivate ? 'Private Song' : 'Public Song'}
        </p>
        <Switch
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
          className=''
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadSongModal;
