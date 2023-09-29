import getUsers from '../helpers/getUsers';
import Navbar from '../components/navbars/Navbar';
import UserList from './components/UserList';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <Navbar>
      <div className='h-full'>
        <UserList items={users} />
        {children}
      </div>
    </Navbar>
  );
}
