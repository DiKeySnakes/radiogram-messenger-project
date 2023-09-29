'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { HiUserGroup } from 'react-icons/hi2';
import clsx from 'clsx';
import { find, uniq } from 'lodash';

import useChat from '@/app/hooks/useChat';
import { pusherClient } from '@/app/libs/pusher';
import GroupChatModal from '@/app/components/modals/GroupChatModal';
import ChatBox from '@/app/chats/components/ChatBox';
import { FullChatType } from '@/app/types';

interface IChatListProps {
  initialItems: FullChatType[];
  users: User[];
  title?: string;
}

const ChatList: React.FC<IChatListProps> = ({ initialItems, users }) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  const { chatId, chatIsActive } = useChat();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) {
      return;
    }

    pusherClient.subscribe(pusherKey);

    const updateHandler = (chat: FullChatType) => {
      setItems((current) =>
        current.map((currentChat) => {
          if (currentChat.id === chat.id) {
            return {
              ...currentChat,
              messages: chat.messages,
            };
          }

          return currentChat;
        })
      );
    };

    const newHandler = (chat: FullChatType) => {
      setItems((current) => {
        if (find(current, { id: chat.id })) {
          return current;
        }

        return [chat, ...current];
      });
    };

    const removeHandler = (chat: FullChatType) => {
      setItems((current) => {
        return [...current.filter((item) => item.id !== chat.id)];
      });
    };

    pusherClient.bind('chat:update', updateHandler);
    pusherClient.bind('chat:new', newHandler);
    pusherClient.bind('chat:remove', removeHandler);
  }, [pusherKey, router]);

  return (
    <>
      <GroupChatModal users={users} />
      <aside
        className={clsx(
          `
          fixed
          inset-y-0
          pb-20
          lg:pb-0
          lg:left-20
          lg:w-80
          lg:block
          overflow-y-auto
          border-r
          border-neutral
          `,
          chatIsActive ? 'hidden' : 'block w-full left-0'
        )}>
        <div className='px-5'>
          <div className='flex justify-between items-center mb-4 pt-4'>
            <div className='text-3xl font-bold'>Chats</div>
            <button
              className='btn btn-circle btn-ghost border-neutral'
              onClick={() =>
                (
                  document.getElementById('group_chat_modal') as HTMLFormElement
                ).showModal()
              }>
              <HiUserGroup size={32} />
            </button>
          </div>
          {items.map((item) => (
            <ChatBox key={item.id} data={item} selected={chatId === item.id} />
          ))}
        </div>
      </aside>
    </>
  );
};

export default ChatList;
