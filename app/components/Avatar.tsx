'use client';

import clsx from 'clsx';

import { User } from '@prisma/client';

import useActiveList from '../hooks/useActiveList';
import Image from 'next/image';

interface IAvatarProps {
  user?: User;
}

const Avatar: React.FC<IAvatarProps> = ({ user }) => {
  const { members } = useActiveList();
  const isActive = members.indexOf(user?.email!) !== -1;

  return (
    <div className={clsx('avatar', isActive && 'avatar online')}>
      <div className='w-9 md:w-11 rounded-full relative'>
        <Image
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          src={user?.image || '/images/placeholder.jpg'}
          alt='Avatar'
        />
      </div>
    </div>
  );
};

export default Avatar;
