import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Only allow this route in development or if called by an existing admin
    if (process.env.NODE_ENV !== 'development' && (!session?.user?.role || session.user.role !== 'admin')) {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const { email } = await req.json();
    if (!email) {
      return new NextResponse(
        JSON.stringify({ message: 'Email is required' }),
        { status: 400 }
      );
    }

    await connectMongo();
    
    const user = await User.findOne({ email });
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: 'User not found' }),
        { status: 404 }
      );
    }

    user.role = 'admin';
    await user.save();

    return new NextResponse(
      JSON.stringify({ message: 'User promoted to admin successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error promoting user:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error promoting user' }),
      { status: 500 }
    );
  }
}
