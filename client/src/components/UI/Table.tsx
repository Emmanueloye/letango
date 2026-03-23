const Table = ({
  columns,
  headers,
  children,
}: {
  columns: string;
  headers: string[];
  children: React.ReactNode;
}) => {
  return (
    // Table headers
    <div className='mt-2'>
      <div
        className='grid uppercase text-sm font-600 *:py-2 *:px-2 bg-[#dcfce7] dark:text-primary-500 w-full'
        style={{ gridTemplateColumns: columns }}
      >
        {headers.map((item) => (
          <p key={item} className='border border-[#d1d5dc]'>
            {item}
          </p>
        ))}
      </div>
      {/* Table rows */}
      <div className='*:even:bg-[#f1f5f9] *:dark:even:bg-[#314158]'>
        <div
          className='grid grid-cols-4 items-stretch capitalize text-sm font-400 font-poppins *:py-1 *:px-2 even:bg-[#f1f5f9] *:dark:even:bg-[#314158]'
          style={{ gridTemplateColumns: columns }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Table;
