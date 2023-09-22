import { Chat, Message, User } from '@prisma/client';

export type FullMessageType = Message & {
  sender: User;
  read: User[];
};

export type FullChatType = Chat & {
  users: User[];
  messages: FullMessageType[];
};
