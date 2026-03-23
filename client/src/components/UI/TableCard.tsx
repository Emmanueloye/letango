import TableAction from './TableAction';

const TableCard = ({
  children,
  className,
  showAction,
  editUrl,
  viewUrl,
}: {
  children: React.ReactNode;
  className?: string;
  showAction?: boolean;
  editUrl?: string;
  viewUrl?: string;
}) => {
  return (
    <div className='dark:bg-slate-800 shadow-md py-2 px-4 mb-4 rounded-2xl'>
      <div
        className={`flex justify-between flex-wrap gap-2 bg-grey-100  text-center text-sm mb-3 ${className}`}
      >
        {children}
      </div>
      {showAction && (
        <TableAction
          editUrl={editUrl || ''}
          viewUrl={viewUrl || ''}
          showUserAction
          className='border-0 border-t-2 justify-between pt-2 flex-wrap'
        />
      )}
    </div>
  );
};

export default TableCard;
