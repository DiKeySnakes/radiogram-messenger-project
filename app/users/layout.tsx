import getUsers from '../helpers/getUsers';
import Sidebar from '../components/sidebars/Sidebar';
import UserList from './components/UserList';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <Sidebar>
      <div className='h-full'>
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
