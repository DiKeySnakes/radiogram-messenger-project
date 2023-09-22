import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getChatById = async (chatId: string) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new Error('Current user not found');
  }

  const chat = await prisma.chat.findUnique({
    where: {
      id: chatId,
      users: {
        some: {
          id: currentUser.id,
        },
      },
    },
  });

  if (!chat) {
    throw new Error('Chat not found');
  }

  return chat;
};

export default getChatById;
