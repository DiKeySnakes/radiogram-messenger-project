'use client';

import { HiChevronLeft } from 'react-icons/hi';
import { HiEllipsisHorizontal } from 'react-icons/hi2';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Chat, User } from '@prisma/client';

import useChatCompanion from '@/app/hooks/useChatCompanion';
import useActiveList from '@/app/hooks/useActiveList';

import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import ProfileDrawer from './ProfileDrawer';

interface HeaderProps {
  chat: Chat & {
    users: User[];
  };
}

const Header: React.FC<HeaderProps> = ({ chat }) => {
  const chatCompanion = useChatCompanion(chat);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      <ProfileDrawer
        data={chat}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div
        className='
        bg-white
        w-full
        flex
        border-b-[1px]
        sm:px-4
        py-3
        px-4
        lg:px-6
        justify-between
        items-center
        shadow-sm
      '>
        <div className='flex gap-3 items-center'>
          <Link
            href='/conversations'
            className='
            lg:hidden
            block
            text-sky-500
            hover:text-sky-600
            transition
            cursor-pointer
          '>
            <HiChevronLeft size={32} />
          </Link>
          {chat.isGroup ? (
            <AvatarGroup users={chat.users} />
          ) : (
            <Avatar user={chatCompanion} />
          )}
          <div className='flex flex-col'>
            <div>{chat.name || chatCompanion.name}</div>
            <div className='text-sm font-light text-neutral-500'>
              {statusText}
            </div>
          </div>
        </div>
        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className='
          text-sky-500
          cursor-pointer
          hover:text-sky-600
          transition
        '
        />
      </div>
    </>
  );
};

export default Header;
