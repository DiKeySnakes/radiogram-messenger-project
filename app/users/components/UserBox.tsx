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

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: data.id }),
      });

      if (response.ok) {
        const responseData = await response.json();
        router.push(`/chats/${responseData.id}`);
      } else {
        // Handle the error here
        console.error('Failed to create chat:', response.status);
      }
    } catch (error) {
      // Handle any network or other errors here
      console.error('Error creating chat:', error);
    } finally {
      setIsLoading(false);
    }
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
          mb-2
          hover:bg-base-300
          rounded-lg
          transition
          cursor-pointer
          border
          border-base-300
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
