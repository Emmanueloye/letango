const Button = ({
  btnText,
  btnType,
  bg = 'green-600',
  color = 'text-white',
  disabled = false,
  onTrigger,
}: {
  btnText: string;
  btnType: 'submit' | 'button' | 'reset';
  bg?: string;
  color?: string;
  disabled?: boolean;
  onTrigger?: () => void;
}) => {
  return (
    <button
      onClick={() => onTrigger?.()}
      type={btnType}
      disabled={disabled}
      className={`bg-${bg} hover:bg-green-400 px-3 py-2 rounded-md w-full capitalize ${color} font-600 cursor-pointer disabled:bg-gray-400`}
    >
      {btnText}
    </button>
  );
};

export default Button;
