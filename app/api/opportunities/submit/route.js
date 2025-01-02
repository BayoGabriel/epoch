import connectMongo from '@/utils/mongodb';
import Opportunity from '@/models/opportunity';
import User from '@/models/User'; 

export async function POST(req) {
    await connectMongo(); 

    const { institutionName, title, link, deadline, position, createdBy, description, type } = await req.json();
  
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
      });
  
      await opportunity.save();
  
      return new Response(JSON.stringify(opportunity), { status: 201 });
    } catch (error) {
      console.error('Error saving opportunity:', error);
      return new Response(JSON.stringify({ message: 'Error submitting opportunity' }), { status: 500 });
    }
  }