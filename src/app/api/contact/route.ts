// app/api/contact/route.ts
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu',
    port: 465,
    secure: true,
    auth: {
      user: 'bal-admin@bal-it.com',
      pass: process.env.ZOHO_APP!,
    },
  });

  const mailOptions = {
    from: email,
    to: 'information@bal-it.com',
    subject,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Email send failed:', err);
    return new Response(JSON.stringify({ error: 'Email could not be sent' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
