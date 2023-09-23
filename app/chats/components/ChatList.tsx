'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineGroupAdd } from 'react-icons/md';
import clsx from 'clsx';
import { find, uniq } from 'lodash';

import useChat from '@/app/hooks/useChat';
import { pusherClient } from '@/app/libs/pusher';
import GroupChatModal from '@/app/components/modals/GroupChatModal';
import ChatBox from '@/app/chats/components/ChatBox';
import { FullChatType } from '@/app/types';

interface ChatListProps {
  initialItems: FullChatType[];
  users: User[];
  title?: string;
}

const ChatList: React.FC<ChatListProps> = ({ initialItems, users }) => {
  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const session = useSession();

  const { chatId, isOpen } = useChat();

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
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
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
        border-gray-200
        bg-white
      `,
          isOpen ? 'hidden' : 'block w-full left-0'
        )}>
        <div className='px-5'>
          <div className='flex justify-between mb-4 pt-4'>
            <div className='text-2xl font-bold text-neutral-800'>Messages</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className='
                rounded-full
                p-2
                bg-gray-100
                text-gray-600
                cursor-pointer
                hover:opacity-75
                transition
              '>
              <MdOutlineGroupAdd size={20} />
            </div>
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
