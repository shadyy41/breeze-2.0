import UploadButton from './upload-button';
const BottomMenu: React.FC<{
  expanded: boolean;
}> = ({ expanded }) => {
  return (
    <div className='flex flex-grow flex-col gap-5 rounded-md border border-zinc-800 bg-zinc-950 px-5 py-5 font-medium'>
      <UploadButton expanded={expanded} />
    </div>
  );
};

export default BottomMenu;
