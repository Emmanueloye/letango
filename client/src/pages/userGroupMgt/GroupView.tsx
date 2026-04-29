/* eslint-disable react-refresh/only-export-components */
import { MdChat } from 'react-icons/md';
import GroupBanner from '../../components/DashboardComponents/GroupBanner';
import LinkBtn from '../../components/UI/LinkBtn';
import { useState } from 'react';
import {
  Form,
  LoaderFunctionArgs,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import Button from '../../components/UI/Button';
import ChatBox from '../../components/DashboardComponents/ChatBox';
import TransactionBox from '../../components/UI/TransactionBox';
import { chatMessages } from '../../assets/tempData/chatData';
import { FaCopy, FaTimesCircle } from 'react-icons/fa';
import { queryClient } from '../../helperFunc.ts/apiRequest';
import {
  fetchContribution,
  fetchData,
} from '../../helperFunc.ts/contributionsRequest';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import BackBtn from '../../components/UI/BackBtn';
import {
  formatDateWD,
  formatNumber,
  formatTime,
} from '../../helperFunc.ts/utilsFunc';
import { User } from '../../dtos/usersDto';
import { TRANSACTION_LIMIT } from '../../dtos/constant';
import {
  Contribution,
  ContributionTransaction,
} from '../../dtos/contributionDto';

const GroupView = () => {
  const [showChat, setShowChat] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { user, inviteLink } = useOutletContext() as {
    user: User;
    contribution: Contribution;
    inviteLink: string;
  };

  const params = useParams();

  const { data: contributionData } = useQuery({
    queryKey: ['contribution', params.groupId],
    queryFn: () => fetchContribution(params.groupId as string),
  });

  const contribution = contributionData?.contribution;

  // To get contribution transactions
  const url = `/contribution-transactions?groupRef=${params.groupId}&limit=${TRANSACTION_LIMIT}&sort=-paidAt`;

  const { data } = useQuery({
    queryKey: ['contribution-transactions', params.groupId],
    queryFn: () => fetchData(url),
  });

  const isAdmin = contribution?.admins?.includes(user._id);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsOpen(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 1000);
      toast.success('Invite link copied to clipboard.');
    } catch (error) {
      setIsOpen(true);
      toast.error(
        (error as Error).message || 'Invite link not copied. Try again.',
      );
    }
  };

  return (
    <section>
      <h2 className='capitalize text-center mb-2'>
        Hi, &nbsp;{user?.surname} {user?.otherNames?.split(' ')[0]}
      </h2>
      <BackBtn url='/account/manage-group' />

      {/* Group banner */}
      <GroupBanner contribution={contribution} />
      {/* Balance & report line */}
      <div className='bg-gray-100 dark:bg-slate-800 flex justify-between items-center flex-wrap mt-0.5 p-1.5 border-b-2 border-t-2 border-green-600'>
        <div>
          <div className='font-poppins text-sm'>
            <span className='font-500'>Account Balance: </span>
            <span className='font-600 text-green-600'>
              &#8358;{formatNumber(contribution?.balance ?? 0)}
            </span>
          </div>
          <div className='font-poppins text-sm mt-2'>
            <span className='font-500'>Effective Balance: </span>
            <span className='font-600 text-amber-600'>
              &#8358;{formatNumber(contribution?.effectiveBalance ?? 0)}
            </span>
          </div>
        </div>

        <LinkBtn
          btnText='report'
          url={`/account/manage-group/view/${contribution?.ref}/reports`}
        />
      </div>

      {/* Group action buttons/links */}

      <div className='flex flex-wrap gap-3 mt-4 text-sm'>
        {/* Contribution link */}
        <LinkBtn
          btnText='contribute'
          url={`/account/manage-group/view/${contribution?.ref}/contribute`}
        />
        {/* Invite member button */}
        <div>
          <Button
            btnText='invite members'
            btnType='button'
            onTrigger={() => setIsOpen(!isOpen)}
          />
        </div>
        {/* Member details link */}
        <LinkBtn
          btnText='members'
          url={`/account/manage-group/view/${contribution?.ref}/members`}
        />
        {isAdmin && (
          <LinkBtn
            btnText='Withdraw'
            url={`/account/manage-group/view/${contribution?.ref}/withdraw`}
          />
        )}
        <LinkBtn
          btnText='my transactions'
          url={`/account/manage-group/view/${contribution?.ref}/transactions`}
        />
      </div>

      {/* invitation link box */}

      {isOpen && (
        <div className='relative cursor-pointer' onClick={handleCopy}>
          <div className='border-1 p-2 rounded-sm mt-2 inset font-poppins text-sm '>
            {inviteLink}
          </div>
          <span
            className='absolute top-2.5 right-2'
            title='Click to copy'
            onClick={handleCopy}
          >
            <FaCopy />
          </span>
        </div>
      )}

      {/* Main body */}
      <div className='lg:flex lg:gap-3 relative mt-6'>
        <main className='lg:basis-3/5 basis-full'>
          <div className='flex justify-between flex-wrap items-center'>
            <h3 className='font-600'>Recent Transactions</h3>
            <MdChat
              className='text-primary-500 dark:text-slate-100 text-2xl cursor-pointer lg:hidden'
              title='Show chat'
              onClick={() => setShowChat(!showChat)}
            />
          </div>
          {/* Recent transactions */}
          <div>
            {data?.transactions?.map((transaction: ContributionTransaction) => {
              // Contributor's name
              const name = `${transaction?.contributedBy?.surname} ${transaction?.contributedBy?.otherNames.split(' ')[0]} `;

              // Transaction description
              const description =
                transaction?.transactionType === 'contribution'
                  ? `${transaction?.transactionType} from ${name} - ${transaction?.description} `
                  : `${transaction?.transactionType} for ${name} - ${transaction?.description}`;

              return (
                <TransactionBox
                  key={transaction?._id}
                  description={description}
                  date={formatDateWD(new Date(transaction?.paidAt))}
                  time={formatTime(new Date(transaction?.paidAt))}
                  amount={transaction?.amount}
                />
              );
            })}
          </div>
        </main>
        {/* Group chat */}
        <aside
          className={`bg-gray-100 dark:bg-slate-800 basis-full w-full lg:basis-2/5 absolute ${
            showChat ? 'block' : 'hidden'
          } lg:block top-0 lg:sticky lg:top-0 h-screen overflow-y-auto aside transition-all duration-500 ease-in-out`}
        >
          <div>
            {/* Chat text box */}

            <div className='sticky top-0 z-10 bg-gray-100 dark:bg-slate-600 p-2'>
              <div className='flex justify-between items-center border-b-2 border-green-600 mb-3'>
                <h3 className='font-600 '>Group conversation</h3>
                <FaTimesCircle
                  className='text-2xl block lg:hidden'
                  onClick={() => setShowChat(false)}
                />
              </div>
              <Form id='chatForm' className='relative'>
                <textarea
                  name='chat'
                  id='message'
                  placeholder='Type your message here...'
                  className='placeholder:text-sm mb-2 resize'
                ></textarea>
                <Button btnText='send' btnType='submit' />
              </Form>
            </div>
            {/* Chat card */}
            <article className='p-2 *:odd:ml-3'>
              {chatMessages.map((item) => {
                return (
                  <ChatBox key={item.id} chatMsg={item} bgColor='bg-gray-50' />
                );
              })}
            </article>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default GroupView;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  await queryClient.ensureQueryData({
    queryKey: ['contribution', params.groupId],
    queryFn: () => fetchContribution(params.groupId as string),
  });

  const url = `/contribution-transactions?groupRef=${params.groupId}&limit=${TRANSACTION_LIMIT}&sort=-paidAt`;

  return queryClient.ensureQueryData({
    queryKey: ['contribution-transactions', params.groupId],
    queryFn: () => fetchData(url),
  });
};
