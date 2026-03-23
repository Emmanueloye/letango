const FormError = ({ message }: { message: string }) => {
  return (
    <div>
      <ul className='bg-amber-700 text-slate-50 p-1 m-2 text-[14px] list-disc rounded-md'>
        {message?.split('. ')?.map((msg, index) => (
          <li className='ml-4' key={index}>
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormError;
