import { useDropzone, FileRejection } from 'react-dropzone';

const DropZone: React.FC<{
  onDrop: (acceptedFiles: File[], rejectedFiles: FileRejection[]) => void;
  maxSizeInBytes: number;
  innerText: string;
}> = ({ onDrop, maxSizeInBytes, innerText }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: maxSizeInBytes,
  });

  return (
    <div
      {...getRootProps()}
      className={`${
        isDragActive ? 'active' : ''
      } flex w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-pink-800 p-4 transition-colors hover:cursor-pointer hover:border-pink-600 focus-visible:border-pink-600 focus-visible:outline-none active:border-pink-600`}
    >
      <input {...getInputProps()} />
      <p className='break-all text-center text-xs'>{innerText}</p>
    </div>
  );
};

export default DropZone;
