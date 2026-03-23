const SearchBox = ({
  searchField,
  setSearchField,
  isAdmin,
  searchValue,
  setSearchValue,
  selectOptions,
}: {
  searchField: string;
  setSearchField: (value: string) => void;
  isAdmin?: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  selectOptions: string[];
}) => {
  return (
    <div className='flex flex-wrap mt-3'>
      <select
        name='search'
        id='search'
        className='lg:w-2/6 w-full rounded-none rounded-l-md capitalize dark:bg-slate-600 bg-gray-300 border-slate-500'
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
      >
        {selectOptions.map((option, index) => (
          <option value={option} key={index}>
            {option}
          </option>
        ))}
        {isAdmin && <option value='email'>Email</option>}
      </select>
      <input
        name='value'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder='Search here...'
        className='rounded-none rounded-r-md lg:w-4/6 w-full border-slate-500 bg-gray-300 dark:bg-slate-600 text-slate-800 dark:text-slate-50 text-sm'
      />
    </div>
  );
};

export default SearchBox;
