import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { name, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.eu', // Use your correct region
    port: 465,
    secure: true,
    auth: {
      user: 'information@bal-it.com',
      pass: process.env.ZOHO_APP!, // 👈 Set this in your .env file
    },
  });

  const mailOptions = {
    from: email,
    to: 'information@bal-it.com',
    subject: subject,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email send failed:', err); // ✅ fixes lint error
    res.status(500).json({ error: 'Email could not be sent' });
  }
}
