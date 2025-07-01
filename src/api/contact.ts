import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { name, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'yourgmail@gmail.com', // use app password
      pass: 'your_app_password',
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
    res.status(500).json({ error: 'Email could not be sent' });
  }
}
