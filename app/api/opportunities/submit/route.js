import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import User from '@/models/User';
import cloudinary from '@/utils/cloudinary';

export async function POST(req) {
  await connectMongo();

  const { institutionName, title, link, deadline, position, createdBy, description, type, image } = await req.json();

  try {
    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'opportunities',
      });
      imageUrl = result.secure_url;
    } else {
      // Use default image URL directly
      imageUrl = 'https://res.cloudinary.com/dq1uyidfy/image/upload/v1736844758/opp_yby0nw.svg';
    }

    const opportunity = new Opportunity({
      institution: institutionName || '',
      title: title || '',
      applyLink: link || '',
      applicationDeadline: deadline ? new Date(deadline) : null,
      position: position || '', 
      createdBy: createdBy || null,
      type: type || 'internship', 
      description: description || '', 
      status: 'pending',
      imageUrl,
    });

    await opportunity.save();

    return new Response(JSON.stringify(opportunity), { status: 201 });
  } catch (error) {
    console.error('Error saving opportunity:', error);
    return new Response(JSON.stringify({ message: 'Error submitting opportunity' }), { status: 500 });
  }
}