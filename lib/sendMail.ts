import nodemailer from 'nodemailer';

export async function sendMail({ to, subject, html }: { to: string; subject: string; html: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SHOPHUB_GMAIL_USER, // Use env for user
      pass: process.env.SHOPHUB_GMAIL_APP_PASSWORD, // Use env for app password
    },
  });

  const mailOptions = {
    from: process.env.SHOPHUB_GMAIL_USER,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}
