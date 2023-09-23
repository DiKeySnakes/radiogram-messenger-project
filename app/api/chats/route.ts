import getCurrentUser from '@/app/helpers/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      const newChat = await prisma.chat.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              {
                id: currentUser.id,
              },
            ],
          },
        },
        include: {
          users: true,
        },
      });

      // Update all connections with new conversation
      newChat.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'chat:new', newChat);
        }
      });

      return NextResponse.json(newChat);
    }

    const existingChats = await prisma.chat.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });

    const singleChat = existingChats[0];

    if (singleChat) {
      return NextResponse.json(singleChat);
    }

    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });

    // Update all connections with new conversation
    newChat.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newChat);
      }
    });

    return NextResponse.json(newChat);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}
