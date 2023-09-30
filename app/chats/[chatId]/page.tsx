import getChatById from '@/app/helpers/getChatById';
import getMessages from '@/app/helpers/getMessages';

import ChatHeader from './components/ChatHeader';
import DateBuckets from './components/DateBuckets';
import MessageFactory from './components/MessageFactory';
import BlankChat from '@/app/components/BlankChat';

interface IParams {
  chatId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
  const chat = await getChatById(params.chatId);
  const messages = await getMessages(params.chatId);

  if (!chat) {
    return (
      <div className='lg:pl-80 h-full'>
        <div className='h-full flex flex-col'>
          <BlankChat />
        </div>
      </div>
    );
  }

  return (
    <div className='lg:pl-80 h-full'>
      <div className='h-full flex flex-col'>
        <ChatHeader chat={chat} />
        <DateBuckets initialMessages={messages} />
        <MessageFactory />
      </div>
    </div>
  );
};

export default ChatId;
