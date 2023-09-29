'use client';

import MenuItemHorizontal from './MenuItemHorizontal';
import useRoutes from '@/app/hooks/useRoutes';
import SettingsModal from './SettingsModal';
import useChat from '@/app/hooks/useChat';
import Avatar from '../Avatar';
import { User } from '@prisma/client';

interface INavbarHorizontalProps {
  currentUser: User;
}

const NavbarHorizontal: React.FC<INavbarHorizontalProps> = ({
  currentUser,
}) => {
  const routes = useRoutes();

  const { chatIsActive } = useChat();
  if (chatIsActive) {
    return null;
  }

  console.log('CURRENT_USER:', { currentUser });

  return (
    <>
      <SettingsModal currentUser={currentUser} />
      <div className='navbarHorizontal'>
        <div className='pt-2 flex flex-col justify-between items-center'>
          <div
            onClick={() =>
              (
                document.getElementById('settings_modal') as HTMLFormElement
              ).showModal()
            }
            className='cursor-pointer hover:opacity-75 transition'>
            <Avatar user={currentUser} />
          </div>
        </div>

        <ul className='menu menu-horizontal bg-base-200 rounded-box'>
          {routes.map((item) => (
            <MenuItemHorizontal
              key={item.label}
              href={item.href}
              label={item.label}
              active={item.active}
              icon={item.icon}
              onClick={item.onClick}
            />
          ))}
        </ul>
      </div>
    </>
  );
};

export default NavbarHorizontal;
