const RejectBox = () => {
  return (
    <div
      id='rejectBox'
      popover='manual'
      className='popover bg-white/20 p-4 rounded-md shadow-lg w-full h-full relative'
    >
      <div className='absolute left-1/2 top-[340px] -translate-x-1/2 lg:-translate-x-1/3 -translate-y-1/2 w-1/2'>
        <form className='dark:bg-slate-600 bg-slate-50 p-3 w-full flex flex-col'>
          <div className='mb-2 divInput'>Reject</div>
          <div className='mb-2'>
            <textarea />
          </div>
          <div className='flex mb-2'>
            <button className='text-center bg-green-500 w-full rounded-md p-1 text-slate-50 mr-2'>
              Reject
            </button>
            <button className='text-center bg-slate-500 w-full rounded-md p-1 text-slate-50'>
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RejectBox;
