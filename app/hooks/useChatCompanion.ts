import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { FullChatType } from '../types';
import { User } from '@prisma/client';

const useChatCompanion = (chat: FullChatType | { users: User[] }) => {
  const session = useSession();

  const chatCompanion = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    const chatCompanion = chat.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return chatCompanion[0];
  }, [session.data?.user?.email, chat.users]);

  return chatCompanion;
};

export default useChatCompanion;
