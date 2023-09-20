import * as yup from 'yup';
import getCurrentUser from '@/app/helpers/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import { pusherServer } from '@/app/libs/pusher';
import { User } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 400 });
    }

    const body = await request.json();
    await validateBody(body);

    const { userId, isGroup, members, name } = body;

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    if (isGroup) {
      const existingChat = await prisma.chat.findFirst({
        where: {
          userIds: {
            hasEvery: [currentUser.id, ...members],
          },
        },
      });
      if (existingChat) {
        return NextResponse.json(existingChat);
      }
      const newChat = await createGroupChat(currentUser, members, name);
      updateConnections(newChat);
      return NextResponse.json(newChat);
    }

    if (userId === currentUser.id) {
      return new NextResponse('Invalid data', { status: 400 });
    }

    const singleChat = await prisma.chat.findFirst({
      where: {
        userIds: {
          hasEvery: [currentUser.id, userId],
        },
      },
    });

    if (singleChat) {
      return NextResponse.json(singleChat);
    }

    const newChat = await createSingleChat(currentUser, userId);
    updateConnections(newChat);

    return NextResponse.json(newChat);
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
}

async function validateBody(body: any) {
  const bodySchema = yup.object().shape({
    userId: yup.string().required(),
    isGroup: yup.boolean().required(),
    members: yup.array().of(yup.string()).min(2).required(),
    name: yup.string().required(),
  });

  try {
    await bodySchema.validate(body);
  } catch (error) {
    throw new Error('Invalid data');
  }
}

type Member = {
  value: string;
};

async function createGroupChat(
  currentUser: User,
  members: Member[],
  name: string
) {
  // Check if the chat name already exists
  const existingChat = await prisma.chat.findFirst({
    where: {
      name: name,
    },
  });

  if (existingChat) {
    throw new Error('Chat name already exists');
  }

  // Create a new chat
  const newChat = await prisma.chat.create({
    data: {
      name,
      isGroup: true,
      users: {
        connect: [
          ...members.map((member: Member) => ({
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

  return newChat;
}

async function createSingleChat(currentUser: User, userId: string) {
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

  return newChat;
}

async function findExistingChat(currentUser: User, userId: string) {
  const existingChat = await prisma.chat.findFirst({
    where: {
      userIds: {
        hasSome: [currentUser.id, userId],
      },
    },
  });

  return existingChat || null;
}

async function triggerPusherServer(
  email: string,
  event: string,
  data: any
): Promise<void> {
  try {
    await pusherServer.trigger(email, event, data);
  } catch (error) {
    return Promise.reject(error);
  }
}

function updateConnections(newChat: any): void {
  // Check if newChat and newChat.users are not null or undefined
  if (newChat && newChat.users) {
    // Iterate over each user in newChat.users
    newChat.users.forEach((user: any) => {
      // Check if user has an email property
      if (user.email) {
        // Call triggerPusherServer function with
        // user's email, 'chat:new', and newChat as arguments
        triggerPusherServer(user.email, 'chat:new', newChat);
      }
    });
  }
}
