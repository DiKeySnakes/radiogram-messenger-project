import axios from 'axios';
import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@prisma/client';

import Avatar from '@/app/components/Avatar';

interface IUserBoxProps {
  data: User;
}

const UserBox: React.FC<IUserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(() => {
    setIsLoading(true);

    axios
      .post('/api/chats', { userId: data.id })
      .then((data) => {
        router.push(`/chats/${data.data.id}`);
      })
      .finally(() => setIsLoading(false));
  }, [data, router]);

  return (
    <>
      <div
        onClick={handleClick}
        className='
          w-full
          relative
          flex
          items-center
          space-x-3
          p-3
          hover:bg-neutral
          rounded-lg
          transition
          cursor-pointer
        '>
        <Avatar user={data} />
        <div className='min-w-0 flex-1'>
          <div className='focus:outline-none'>
            <span className='absolute inset-0' aria-hidden='true' />
            <div className='flex justify-between items-center mb-1'>
              <p className='text-sm font-medium'>{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
