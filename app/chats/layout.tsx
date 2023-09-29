import getChats from '@/app/helpers/getChats';
import getUsers from '@/app/helpers/getUsers';
import Navbar from '@/app/components/navbars/Navbar';
import ChatList from '@/app/chats/components/ChatList';

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();
  const users = await getUsers();

  return (
    <Navbar>
      <div className='h-full'>
        <ChatList users={users} title='Chats' initialItems={chats} />
        {children}
      </div>
    </Navbar>
  );
}
