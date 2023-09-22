import prisma from '@/app/libs/prismadb';
import getCurrentUser from './getCurrentUser';

const getChats = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    return [];
  }

  try {
    const chats = await prisma.chat.findMany({
      orderBy: {
        lastMessageAt: 'desc',
      },
      where: {
        userIds: {
          has: currentUser.id,
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            sender: true,
            read: true,
          },
        },
      },
    });

    return chats;
  } catch (error: any) {
    return [];
  }
};

export default getChats;
