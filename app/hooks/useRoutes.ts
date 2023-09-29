import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { HiChat } from 'react-icons/hi';
import { HiUsers } from 'react-icons/hi2';
import { RiLogoutCircleFill } from 'react-icons/ri';
import { signOut } from 'next-auth/react';
import useChat from './useChat';

const useRoutes = () => {
  const pathname = usePathname();
  const { chatId } = useChat();

  const routes = useMemo(
    () => [
      {
        label: 'Chats',
        href: '/chats',
        icon: HiChat,
        active: pathname === '/chats' || !!chatId,
      },
      {
        label: 'Contacts',
        href: '/users',
        icon: HiUsers,
        active: pathname === '/users',
      },
      {
        label: 'Logout',
        onClick: () => signOut(),
        href: '#',
        icon: RiLogoutCircleFill,
      },
    ],
    [pathname, chatId]
  );

  return routes;
};

export default useRoutes;
