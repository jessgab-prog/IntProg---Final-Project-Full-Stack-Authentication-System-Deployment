import nodemailer from 'nodemailer';
import config from '../config';
export default async function sendEmail({to,subject,html, from = config.emailFrom}: any){
  const transporter = nodemailer.createTransport(config.smtpOptions);
  await transporter.sendMail({from, to, subject, html});  
}import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html, from = 'onboarding@resend.dev' }: any) {
    await resend.emails.send({
        from,
        to,
        subject,
        html
    });
}