import LinkBtn from './LinkBtn';

const BackBtn = ({ url }: { url: string }) => {
  return (
    <div className='flex justify-end mb-2'>
      <LinkBtn btnText='back' url={url} />
    </div>
  );
};

export default BackBtn;
