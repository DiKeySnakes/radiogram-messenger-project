import bcrypt from 'bcrypt';

import prisma from '@/app/libs/prismadb';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      create: {
        email,
        name,
        hashedPassword,
      },
      update: {},
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User with the same email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'An error occurred while creating the user.' },
      { status: 500 }
    );
  }
}
