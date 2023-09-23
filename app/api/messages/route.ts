import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/helpers/getCurrentUser';
import { pusherServer } from '@/app/libs/pusher';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, chatId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const newMessage = await prisma.message.create({
      include: {
        read: true,
        sender: true,
      },
      data: {
        body: message,
        image: image,
        chat: {
          connect: { id: chatId },
        },
        sender: {
          connect: { id: currentUser.id },
        },
        read: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    const updatedChat = await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessageAt: new Date(),
        messages: {
          connect: {
            id: newMessage.id,
          },
        },
      },
      include: {
        users: true,
        messages: {
          include: {
            read: true,
          },
        },
      },
    });

    await pusherServer.trigger(chatId, 'messages:new', newMessage);

    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

    updatedChat.users.map((user) => {
      pusherServer.trigger(user.email!, 'chat:update', {
        id: chatId,
        messages: [lastMessage],
      });
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.log('ERROR_MESSAGES:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
