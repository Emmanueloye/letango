const Title = ({ title }: { title: string }) => {
  return (
    <h3 className='border-b-2 py-1 mb-8 font-600 uppercase text-center border-b-green-500'>
      {title}
    </h3>
  );
};

export default Title;
