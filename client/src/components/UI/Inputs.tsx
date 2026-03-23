const Inputs = ({
  defaultValue = '',
  label,
  id,
  name,
  type = 'text',
  isRequired = true,
  capitalized = true,
  disable = false,
}: {
  defaultValue?: string | number;
  label: string;
  id: string;
  name: string;
  type: string;
  isRequired?: boolean;
  capitalized?: boolean;
  disable?: boolean;
}) => {
  const className = isRequired
    ? `after:text-red-500 after:content-['*']`
    : undefined;
  return (
    <div className='mb-3'>
      <label htmlFor={id} className={`${className} after:font-700`}>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        defaultValue={defaultValue}
        autoComplete='off'
        className={capitalized ? 'capitalize' : 'lowercase'}
        disabled={disable}
        required={isRequired}
      />
    </div>
  );
};

export default Inputs;
