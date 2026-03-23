import { Link } from 'react-router-dom';

const LinkBtn = ({
  btnText,
  url,
  bg = 'green-600',
  color = 'text-white',
}: {
  btnText: string;
  url: string;
  bg?: string;
  color?: string;
}) => {
  return (
    <Link
      to={url}
      className={`bg-${bg} flex items-center hover:bg-green-400 px-3 py-1 rounded-md capitalize ${color} font-600`}
    >
      {btnText}
    </Link>
  );
};

export default LinkBtn;
