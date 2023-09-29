import getCurrentUser from '@/app/helpers/getCurrentUser';

import NavbarVertical from './NavbarVertical';
import NavbarHorizontal from './NavbarHorizontal';

async function Navbar({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <div className='h-full'>
      <NavbarVertical currentUser={currentUser!} />
      <NavbarHorizontal currentUser={currentUser!} />
      <main className='lg:pl-20 h-full'>{children}</main>
    </div>
  );
}

export default Navbar;
