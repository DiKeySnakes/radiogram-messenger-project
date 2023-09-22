import getChatById from '@/app/helpers/getChatById';
import getMessages from '@/app/helpers/getMessages';

import Header from './components/Header';
import Body from './components/Body';
import Form from './components/Form';
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
        <Header chat={chat} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ChatId;
