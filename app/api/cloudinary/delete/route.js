import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const { publicId } = await req.json();
    if (!publicId) {
      return new NextResponse(
        JSON.stringify({ message: 'Public ID is required' }),
        { status: 400 }
      );
    }

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      throw new Error('Failed to delete image from Cloudinary');
    }

    return new NextResponse(
      JSON.stringify({ message: 'Image deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting image:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error deleting image' }),
      { status: 500 }
    );
  }
}
