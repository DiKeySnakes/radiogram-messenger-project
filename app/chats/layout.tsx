import getChats from '@/app/helpers/getChats';
import getUsers from '@/app/helpers/getUsers';
import Sidebar from '@/app/components/sidebars/Sidebar';
import ChatList from '@/app/chats/components/ChatList';

export default async function ChatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chats = await getChats();
  const users = await getUsers();

  return (
    <Sidebar>
      <div className='h-full'>
        <ChatList users={users} title='Messages' initialItems={chats} />
        {children}
      </div>
    </Sidebar>
  );
}
