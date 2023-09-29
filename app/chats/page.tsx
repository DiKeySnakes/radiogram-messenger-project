'use client';

import clsx from 'clsx';

import useChat from '@/app/hooks/useChat';
import BlankChat from '@/app/components/BlankChat';

const Home = () => {
  const { chatIsActive } = useChat();

  return (
    <div
      className={clsx(
        'lg:pl-80 h-full lg:block',
        chatIsActive ? 'block' : 'hidden'
      )}>
      <BlankChat />
    </div>
  );
};

export default Home;
