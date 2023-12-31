'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';

import Avatar from '@/app/components/Avatar';
import useChatCompanion from '@/app/hooks/useChatCompanion';
import AvatarGroup from '@/app/components/AvatarGroup';
import { FullChatType } from '@/app/types';

interface IChatBoxProps {
  data: FullChatType;
  selected?: boolean;
}

const ChatBox: React.FC<IChatBoxProps> = ({ data, selected }) => {
  const chatCompanion = useChatCompanion(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/chats/${data.id}`);
  }, [data, router]);

  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1];
  }, [data.messages]);

  const userEmail = useMemo(
    () => session.data?.user?.email,
    [session.data?.user?.email]
  );

  const hasRead = useMemo(() => {
    if (!lastMessage) {
      return false;
    }

    const readArray = lastMessage.read || [];

    if (!userEmail) {
      return false;
    }

    return readArray.filter((user) => user.email === userEmail).length !== 0;
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    if (lastMessage?.image) {
      return 'Sent an image';
    }

    if (lastMessage?.body) {
      return lastMessage?.body;
    }

    return 'Started new chat';
  }, [lastMessage]);

  return (
    <div
      onClick={handleClick}
      className={clsx(
        `
        w-full
        relative
        flex
        items-center
        space-x-3
        p-3
        mb-2
        hover:bg-base-300
        rounded-lg
        transition
        cursor-pointer
        `,
        selected
          ? 'bg-base-200 border border-base-300 shadow-lg'
          : 'bg-base-100 border border-base-300'
      )}>
      {data.isGroup ? (
        <AvatarGroup users={data.users} />
      ) : (
        <Avatar user={chatCompanion} />
      )}
      <div className='min-w-0 flex-1'>
        <div className='focus:outline-none'>
          <span className='absolute inset-0' aria-hidden='true' />
          <div className='flex justify-between items-center mb-1'>
            <p className='text-md font-medium'>
              {data.name || chatCompanion.name}
            </p>
            {lastMessage?.createdAt && (
              <p className='text-xs font-light'>
                {format(new Date(lastMessage.createdAt), 'HH:mm')}
              </p>
            )}
          </div>
          <p
            className={clsx(
              'truncate text-sm',
              hasRead ? 'text-success' : 'text-info'
            )}>
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
