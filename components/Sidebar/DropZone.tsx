import { useDropzone, FileRejection } from 'react-dropzone';

const DropZone: React.FC<{
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  maxSizeInBytes: number;
}> = ({ onDrop, maxSizeInBytes }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSizeInBytes,
  });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${
        isDragActive ? 'active' : ''
      } flex flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-pink-800 p-4 transition-colors hover:cursor-pointer hover:border-pink-600 focus-visible:border-pink-600 focus-visible:outline-none active:border-pink-600`}
    >
      <input {...getInputProps()} />
      <p className='text-center text-sm font-light'>
        Drag & drop a file, or click to select a file (max size: 6 MB)
      </p>
    </div>
  );
};

export default DropZone;
