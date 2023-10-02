'use client';

import { useEffect, useRef, useState } from 'react';

import { pusherClient } from '@/app/libs/pusher';
import useChat from '@/app/hooks/useChat';
import MessageBox from './MessageBox';
import { FullMessageType } from '@/app/types';
import { find } from 'lodash';

interface IDateBucketsProps {
  initialMessages: FullMessageType[];
}

const groupMessagesByDate = (
  messages: FullMessageType[]
): Record<string, FullMessageType[]> => {
  const dateBuckets: Record<string, FullMessageType[]> = {};

  for (const message of messages) {
    const messageDate = new Date(message.createdAt).toDateString();

    if (!dateBuckets[messageDate]) {
      dateBuckets[messageDate] = [];
    }

    dateBuckets[messageDate].push(message);
  }

  return dateBuckets;
};

const DateBuckets: React.FC<IDateBucketsProps> = ({ initialMessages = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { chatId } = useChat();

  useEffect(() => {
    fetch(`/api/chats/${chatId}/read`, {
      method: 'POST',
    });
  }, [chatId]);

  useEffect(() => {
    pusherClient.subscribe(chatId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      fetch(`/api/chats/${chatId}/read`, {
        method: 'POST',
      });

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);
    };
  }, [chatId]);

  // Group messages by date
  const dateBuckets = groupMessagesByDate(messages);

  return (
    <div className='flex-1 overflow-y-auto'>
      {Object.entries(dateBuckets).map(([date, messagesInDate]) => (
        <div key={date}>
          <div className='flex justify-center my-8'>
            <div className='divider w-10/12'>{date}</div>
          </div>
          {messagesInDate.map((message) => (
            <MessageBox key={message.id} data={message} />
          ))}
        </div>
      ))}
      <div className='pt-24' ref={bottomRef} />
    </div>
  );
};

export default DateBuckets;
