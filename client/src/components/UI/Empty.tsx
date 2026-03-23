const Empty = ({ message }: { message: string }) => {
  return (
    <article className='flex justify-center items-center bg-white dark:bg-slate-500 mt-4 min-h-40 text-center p-3'>
      {message}
    </article>
  );
};

export default Empty;
