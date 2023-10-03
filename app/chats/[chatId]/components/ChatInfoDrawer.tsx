'use client';

import { useMemo } from 'react';
import { IoTrash } from 'react-icons/io5';
import { Chat, User } from '@prisma/client';
import { format } from 'date-fns';

import useChatCompanion from '@/app/hooks/useChatCompanion';
import useActiveList from '@/app/hooks/useActiveList';

import Avatar from '@/app/components/Avatar';
import AvatarGroup from '@/app/components/AvatarGroup';
import DeleteChatModal from './DeleteChatModal';

import { RiArchiveDrawerFill } from 'react-icons/ri';

interface IChatInfoDrawerProps {
  data: Chat & {
    users: User[];
  };
}

const ChatInfoDrawer: React.FC<IChatInfoDrawerProps> = ({ data }) => {
  const chatCompanion = useChatCompanion(data);

  const joinedDate = useMemo(() => {
    return format(new Date(chatCompanion.createdAt), 'PP');
  }, [chatCompanion.createdAt]);

  const title = useMemo(() => {
    return data.name || chatCompanion.name;
  }, [data.name, chatCompanion.name]);

  const { members } = useActiveList();
  const isActive = members.indexOf(chatCompanion?.email!) !== -1;

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }

    return isActive ? 'Active' : 'Offline';
  }, [data, isActive]);

  return (
    <>
      <DeleteChatModal />

      <div className='drawer drawer-end relative z-50'>
        <input id='my-drawer' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content'>{/* Page content here */}</div>

        <div className='drawer-side'>
          <label htmlFor='my-drawer' className='drawer-overlay'></label>
          <div className='menu p-4 w-80 min-h-full bg-base-200 text-base-content'>
            {/* Sidebar content here */}
            <div className='flex flex-col mt-4 items-center'>
              <div className='mb-2'>
                {data.isGroup ? (
                  <AvatarGroup users={data.users} />
                ) : (
                  <Avatar user={chatCompanion} />
                )}
              </div>
              <div className='text-2xl'>{title}</div>
              <div className='text-sm text-opacity-30'>{statusText}</div>
            </div>
            <div className='flex flex-col my-8 items-center'>
              <button
                onClick={() =>
                  (
                    document.getElementById(
                      'delete_chat_modal'
                    ) as HTMLFormElement
                  ).showModal()
                }
                className='btn btn-wide btn-outline btn-error'>
                <IoTrash size={24} />
                Delete Chat
              </button>
            </div>
            <div className='w-full pb-5 pt-5 sm:px-0 sm:pt-0'>
              <dl className='space-y-8 px-4 sm:space-y-6 sm:px-6'>
                {data.isGroup && (
                  <div>
                    <dt className='text-sm font-medium sm:w-40 sm:flex-shrink-0'>
                      Emails
                    </dt>
                    <dd className='mt-1 text-sm sm:col-span-2'>
                      {data.users.map((user) => user.email).join(', ')}
                    </dd>
                  </div>
                )}
                {!data.isGroup && (
                  <div>
                    <dt className='text-sm font-medium sm:w-40 sm:flex-shrink-0'>
                      Email
                    </dt>
                    <dd className='mt-1 text-sm sm:col-span-2'>
                      {chatCompanion.email}
                    </dd>
                  </div>
                )}
                {!data.isGroup && (
                  <>
                    <div className='divider'></div>
                    <div>
                      <dt className='text-sm font-medium sm:w-40 sm:flex-shrink-0'>
                        Joined
                      </dt>
                      <dd className='mt-1 text-sm sm:col-span-2'>
                        <time dateTime={joinedDate}>{joinedDate}</time>
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </div>
            <div className='flex justify-center fixed bottom-8 left-[45%]'>
              <label
                htmlFor='my-drawer'
                className='btn btn-circle btn-ghost border border-base-300 shadow-lg'>
                <RiArchiveDrawerFill size={32} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInfoDrawer;
