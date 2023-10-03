'use client';

import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo } from 'react';
import Link from 'next/link';
import { Chat, User } from '@prisma/client';

import useChatCompanion from '@/app/hooks/useChatCompanion';
import useActiveList from '@/app/hooks/useActiveList';

import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import ChatInfoDrawer from './ChatInfoDrawer';

interface IChatHeaderProps {
  chat: Chat & {
    users: User[];
  };
}

const ChatHeader: React.FC<IChatHeaderProps> = ({ chat }) => {
  const chatCompanion = useChatCompanion(chat);

  const { members } = useActiveList();
  const isActive = members.indexOf(chatCompanion?.email!) !== -1;
  const statusText = useMemo(() => {
    if (chat.isGroup) {
      return `${chat.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [chat, isActive]);

  return (
    <>
      <ChatInfoDrawer data={chat} />
      <div className='navbar bg-base-200 justify-between border-b border-base-300 shadow-lg'>
        <div className='flex gap-3 items-center'>
          <Link href='/chats' className='lg:hidden block'>
            <button className='btn btn-circle btn-ghost'>
              <HiChevronLeft size={32} />
            </button>
          </Link>
          {chat.isGroup ? (
            <AvatarGroup users={chat.users} />
          ) : (
            <Avatar user={chatCompanion} />
          )}
          <div className='flex flex-col'>
            <div>{chat.name || chatCompanion.name}</div>
            <div className='text-sm font-light'>{statusText}</div>
          </div>
        </div>
        <div className='flex-none'>
          <label htmlFor='my-drawer' className='btn btn-circle btn-ghost'>
            <HiEllipsisHorizontal size={32} />
          </label>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;
