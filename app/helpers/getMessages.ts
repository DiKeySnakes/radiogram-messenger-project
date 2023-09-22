import prisma from '@/app/libs/prismadb';

const getMessages = async (chatId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId: chatId,
      },
      include: {
        sender: true,
        read: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;
