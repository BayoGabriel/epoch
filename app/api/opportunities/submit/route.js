import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import User from '@/models/User';
import cloudinary from '@/utils/cloudinary';

export async function POST(req) {
  await connectMongo();

  const { institutionName, title, link, deadline, position, createdBy, description, type, image } = await req.json();

  if (!institutionName || !title || !link || !deadline || !position || !createdBy || !description || !type) {
    console.error('Missing required fields', {
      institutionName,
      title,
      link,
      deadline,
      position,
      createdBy,
      description,
      type
    });
    return new Response(JSON.stringify({ message: 'Missing required fields' }), { status: 400 });
  }

  try {
    // Upload image to Cloudinary if provided
    let imageUrl = null;
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: 'opportunities',
      });
      imageUrl = result.secure_url;
    } else {
      // If no image provided, upload the default image from public/opp.svg
      const defaultImage = await cloudinary.uploader.upload('public/opp.svg', {
        folder: 'opportunities',
        public_id: 'default_opportunity',
        overwrite: true,
      });
      imageUrl = defaultImage.secure_url;
    }

    const user = await User.findById(createdBy);
    const defaultStatus = user && user.role === 'admin' ? 'approved' : 'pending';

    const opportunity = new Opportunity({
      institution: institutionName,
      title,
      applyLink: link,
      applicationDeadline: new Date(deadline),
      position, 
      createdBy,
      type, 
      description, 
      status: defaultStatus,
      imageUrl, // Add the imageUrl field
    });

    await opportunity.save();

    return new Response(JSON.stringify(opportunity), { status: 201 });
  } catch (error) {
    console.error('Error saving opportunity:', error);
    return new Response(JSON.stringify({ message: 'Error submitting opportunity' }), { status: 500 });
  }
}