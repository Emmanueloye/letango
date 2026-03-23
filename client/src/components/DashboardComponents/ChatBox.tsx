import { useRef } from 'react';
import { FaReply, FaThumbsUp } from 'react-icons/fa';

type ChatType = {
  id: number;
  message: string;
  likes: number;
  dislikes: number;
  reply: number;
};

const ChatBox = ({
  bgColor,
  ml,
  chatMsg,
  showFooter = true,
}: {
  bgColor: string;
  ml?: string;
  chatMsg: ChatType;
  showFooter?: boolean;
  //   setCurrentMsg: (data: string) => void;
}) => {
  const messageRef = useRef<HTMLParagraphElement>(null);

  //   const handleClick = () => {
  //     if (messageRef.current) {
  //       setCurrentMsg(messageRef.current.textContent as string);
  //     }
  //   };
  return (
    <div
      className={`${bgColor} ${ml} dark:bg-slate-700 px-4 py-2 mb-1 rounded-2xl text-[14px] font-500 shadow`}
    >
      <p className='pb-2 msgBox' ref={messageRef}>
        {chatMsg?.message}
      </p>
      {showFooter && (
        <div className='flex items-center justify-evenly border-t-2 gap-4 pt-3'>
          <div className='flex gap-2 font-poppins text-xs cursor-pointer'>
            <FaThumbsUp />
            <span>{chatMsg?.likes > 0 ? chatMsg?.likes : 0}</span>
          </div>
          <div className='flex gap-2 font-poppins text-xs cursor-pointer'>
            <FaThumbsUp className='rotate-180 mt-1' />
            <span>{chatMsg?.dislikes > 0 ? chatMsg?.dislikes : 0}</span>
          </div>

          <div
            className='flex gap-2 text-xs cursor-pointer replyBtn'
            // onClick={handleClick}
          >
            <FaReply className='replyBtn' />
            <span className='font-poppins replyBtn'>
              {chatMsg?.reply > 0 ? chatMsg?.reply : 0}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
