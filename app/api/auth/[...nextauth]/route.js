import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectMongo from '@/utils/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Connect to MongoDB
        await connectMongo();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('No user found with this email');
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error('Incorrect password');
        }

        // Return user object if authentication is successful
        return {
          id: user._id,
          email: user.email,
          username: user.username,
          school: user.school,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.school = token.school;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.school = user.school;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
