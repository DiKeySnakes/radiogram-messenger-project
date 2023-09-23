import { NextResponse } from 'next/server';

import getCurrentUser from '@/app/helpers/getCurrentUser';
import { pusherServer } from '@/app/libs/pusher';
import prisma from '@/app/libs/prismadb';

interface IParams {
  chatId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { chatId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Find existing conversation
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          include: {
            read: true,
          },
        },
        users: true,
      },
    });

    if (!chat) {
      return new NextResponse('Invalid ID', { status: 400 });
    }

    // Find last message
    const lastMessage = chat.messages[chat.messages.length - 1];

    if (!lastMessage) {
      return NextResponse.json(chat);
    }

    // Update read status of last message
    const updatedMessage = await prisma.message.update({
      where: {
        id: lastMessage.id,
      },
      include: {
        sender: true,
        read: true,
      },
      data: {
        read: {
          connect: {
            id: currentUser.id,
          },
        },
      },
    });

    // Update all connections with new seen
    await pusherServer.trigger(currentUser.email, 'chat:update', {
      id: chatId,
      messages: [updatedMessage],
    });

    // If user has already read the message, no need to go further
    if (lastMessage.readIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(chat);
    }

    // Update last message read status
    await pusherServer.trigger(chatId!, 'message:update', updatedMessage);

    return new NextResponse('Success');
  } catch (error) {
    console.log('ERROR_MESSAGES_READ:', error);
    return new NextResponse('Error', { status: 500 });
  }
}
