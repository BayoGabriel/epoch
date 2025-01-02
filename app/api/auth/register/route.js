import connectMongo from '@/utils/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { username, email, password, school } = await req.json();

  await connectMongo();

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      school,
    });

    await newUser.save();

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Something went wrong', error }), { status: 500 });
  }
}
