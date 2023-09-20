import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { data } from 'autoprefixer';

class GetSessionError extends Error {
  statusCode: number;
  data: any;
  timestamp: Date;

  /**
   * Creates a new instance of GetSessionError.
   * @param message - The error message.
   * @param statusCode - The HTTP status code associated with the error.
   * @param data - Additional data associated with the error.
   */
  constructor(message: string, statusCode: number, data: any) {
    super(message);
    this.name = 'GetSessionError';
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date();
  }
}

export default async function getSession() {
  try {
    return await getServerSession(authOptions);
  } catch (error) {
    console.error('Error getting session:', error);
    throw new GetSessionError('Failed to get session', 500, data);
  }
}
