import prisma from '@/app/libs/prismadb';
import getSession from './getSession';

const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session) {
      throw new Error('Invalid session');
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user?.email as string,
      },
    });

    return currentUser || null;
  } catch (error: any) {
    console.error('Error getting current user:', error);
    throw new Error(`Failed to get current user: ${error.message}`);
  }
};

export default getCurrentUser;
