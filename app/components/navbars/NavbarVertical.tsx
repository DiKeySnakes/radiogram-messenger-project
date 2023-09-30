'use client';

import MenuItemVertical from './MenuItemVertical';
import useRoutes from '@/app/hooks/useRoutes';
import UserProfileModal from './UserProfileModal';
import Avatar from '../Avatar';
import { User } from '@prisma/client';

interface INavbarVerticalProps {
  currentUser: User;
}

const NavbarVertical: React.FC<INavbarVerticalProps> = ({ currentUser }) => {
  const routes = useRoutes();

  console.log('CURRENT_USER:', { currentUser });

  return (
    <>
      <UserProfileModal currentUser={currentUser} />
      <div className='navbarVertical'>
        <ul className='menu bg-base-200 rounded-box'>
          {routes.map((item) => (
            <MenuItemVertical
              key={item.label}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.active}
              onClick={item.onClick}
            />
          ))}
        </ul>

        <div className='mt-4 pt-2 flex flex-col justify-between items-center'>
          <div
            onClick={() =>
              (
                document.getElementById('user_profile_modal') as HTMLFormElement
              ).showModal()
            }
            className='cursor-pointer hover:opacity-75 transition'>
            <Avatar user={currentUser} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarVertical;
