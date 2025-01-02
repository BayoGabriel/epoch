import dbConnect from '@/utils/mongodb';
import User from '@/models/User';
import nodemailer from 'nodemailer';
import { render } from '@react-email/html';
import dotenv from 'dotenv';

dotenv.config(); 

export async function POST(req) {
  await dbConnect();

  const { email, firstName, lastName } = await req.json();

  try {
    const user = new User({ email, firstName, lastName });
    await user.save();

    await sendWelcomeEmail(email, firstName);

    return new Response(JSON.stringify({ message: 'Subscription successful!' }), { status: 200 });
  } catch (error) {
    if (error.code === 11000) {
      return new Response(JSON.stringify({ message: 'Email already subscribed.' }), { status: 400 });
    } else {
      return new Response(JSON.stringify({ message: 'An error occurred while subscribing.' }), { status: 500 });
    }
  }
}

async function sendWelcomeEmail(email, firstName) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.ZOHO_USER,
      pass: process.env.ZOHO_PASS,
    },
  });

  // Render the email template to HTML

  // Define email options
  const mailOptions = {
    from: process.env.ZOHO_USER,
    to: email,
    subject: 'Welcome to Prospecta!',
    html: `
    <body style="margin: 0; padding: 0; @import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap'); font-family: 'Almarai', sans-serif, monospace; box-sizing: border-box; width: 100%; align-items: center; justify-content: center;">
    <main style="align-items: center; width: 100%; justify-content: center;">
        <div style="font-size: 20px; line-height: 36px; text-align: center;  align-items: center; justify-content: center;">
            <div style=" align-items: center; justify-content: center;">
                <h1 style="font-size: 2rem; font-weight: 800; letter-spacing: -0.14em; text-align: center; @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap'); font-family: 'Archivo-black', sans-serif, monospace;">prospecta</h1>
                <img src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014699/efjqboki2b51w3dwonmc.png" style="height: 1em;" alt="logo">
            </div>
            <span style="margin: 20px 0; text-align: center; font-size: 24px;">Hi ${firstName},</span>
            <p style="text-align: center;">Thank you for subscribing to Prospecta by Epoch!</p>
            <p style="text-align: center; padding: 0 2em; margin: 20px 0;">We are thrilled to have you on board. <span style="font-weight: 700;">You can expect to receive our newsletters every Saturday morning,</span> filled with the latest opportunities for Nigerian Undergraduates.</p>
            <p style="text-align: center;">Welcome to the community!</p>
            <p style="margin: 20px 0;">Best regards,<br>The Epoch Team</p>
        </div>
        <div style="width: 100%; margin: 20px 0;">
          <img style="width: 100%;" src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014924/tx227fnvjzi1gtjxieqy.png" alt="banner"/>
        </div>
        <div style="margin: 50px 0; text-align: center;  align-items: center; justify-content: center;">
            <p style="font-family: Almarai;
            font-size: 40px;
            font-weight: 800;
            line-height: 66px;
            text-align: center;
            padding: 0 45px;
            ">Ensure your friends do not miss out on opportunities</p>
            <a href="https://www.epochafrica.com" style="text-decoration: none; margin: 0 auto; border-radius: 24px;
            border: 2px solid black; padding: 6px 24px; font-size: 24px; font-weight: 800; line-height: 36px; background-color: #E9672B; text-align: center;  color: white;">Invite a friend</a>
        </div>
        <div style="width: 100%; margin: 20px 0 0 0;">
           
            <div style="width: 100%; margin: 0;">
              <img style="width: 100%;" src="https://res.cloudinary.com/dq1uyidfy/image/upload/v1718014924/tx227fnvjzi1gtjxieqy.png" alt="banner"/>
            </div>
        </div>
    </main>
</body>
  `,
   
  };

  // Send email
  await transporter.sendMail(mailOptions);
}
