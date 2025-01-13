import { NextResponse } from 'next/server';
import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single opportunity
export async function GET(req, { params }) {
  try {
    await connectMongo();
    const opportunity = await Opportunity.findById(params.id);
    
    if (!opportunity) {
      return new NextResponse(
        JSON.stringify({ message: 'Opportunity not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify(opportunity),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error fetching opportunity' }),
      { status: 500 }
    );
  }
}

// UPDATE opportunity
export async function PUT(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const data = await req.json();
    await connectMongo();

    const opportunity = await Opportunity.findByIdAndUpdate(
      params.id,
      { 
        ...data,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      return new NextResponse(
        JSON.stringify({ message: 'Opportunity not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify(opportunity),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating opportunity:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error updating opportunity' }),
      { status: 500 }
    );
  }
}

// DELETE opportunity
export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    await connectMongo();
    const opportunity = await Opportunity.findByIdAndDelete(params.id);

    if (!opportunity) {
      return new NextResponse(
        JSON.stringify({ message: 'Opportunity not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: 'Opportunity deleted successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error deleting opportunity' }),
      { status: 500 }
    );
  }
}

// PATCH opportunity (for status updates)
export async function PATCH(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ message: 'Unauthorized' }),
        { status: 401 }
      );
    }

    const data = await req.json();
    await connectMongo();

    const opportunity = await Opportunity.findByIdAndUpdate(
      params.id,
      { 
        $set: { 
          status: data.status,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!opportunity) {
      return new NextResponse(
        JSON.stringify({ message: 'Opportunity not found' }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify(opportunity),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating opportunity status:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Error updating opportunity status' }),
      { status: 500 }
    );
  }
}
