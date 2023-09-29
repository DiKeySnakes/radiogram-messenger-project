'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { FullMessageType } from '@/app/types';

import Avatar from '@/app/components/Avatar';
import ImageModal from './ImageModal';

import { BsCheckAll } from 'react-icons/bs';

interface IMessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<IMessageBoxProps> = ({ data, isLast }) => {
  const session = useSession();

  const isOwn = session.data?.user?.email === data?.sender?.email;
  const readList = (data.read || [])
    .filter((user) => user.email !== data?.sender?.email)
    .map((user) => user.name)
    .join(', ');

  return (
    <div className={clsx('chat p-4', isOwn ? 'chat-end' : 'chat-start')}>
      <div className='chat-image avatar'>
        <Avatar user={data.sender} />
      </div>
      <div className='chat-header'>
        {data.sender.name}
        <time className='text-xs opacity-50'>
          {' '}
          {format(new Date(data.createdAt), 'p')}
        </time>
      </div>
      <div
        className={clsx(
          'chat-bubble',
          isOwn ? 'chat-bubble-success' : 'chat-bubble-info',
          data.image ? 'chat-bubble p-2 w-72 h-auto ' : 'chat-bubble'
        )}>
        <ImageModal src={data.image} />
        {data.image ? (
          <Image
            width='288'
            height='288'
            priority={true}
            alt='Image'
            onClick={() =>
              (
                document.getElementById(`${data.image}`) as HTMLFormElement
              ).showModal()
            }
            src={data.image}
            className='object-cover cursor-pointer rounded-2xl'
          />
        ) : (
          <div>{data.body}</div>
        )}
      </div>
      {isLast && isOwn && readList.length > 0 && (
        <div className='chat-footer opacity-50'>
          <div className='flex flex-row items-center'>
            {`Read by ${readList}`}
            <span className='ml-2 text-2xl text-success'>
              <BsCheckAll />
            </span>
          </div>
        </div>
      )}
      {!isLast && isOwn && readList.length > 0 && (
        <div className='chat-footer opacity-70 text-2xl text-success'>
          <BsCheckAll />
        </div>
      )}
    </div>
  );
};

export default MessageBox;
