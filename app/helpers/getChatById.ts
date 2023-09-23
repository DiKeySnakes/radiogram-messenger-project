import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getChatById = async (chatId: string) => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.email) {
      return null;
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        users: true,
      },
    });

    return chat;
  } catch (error: any) {
    console.log('SERVER_ERROR:', error);
    return null;
  }
};

export default getChatById;
