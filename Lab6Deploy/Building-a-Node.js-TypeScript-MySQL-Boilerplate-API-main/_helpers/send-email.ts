import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function sendEmail({ to, subject, html }: any) {
    try {
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to,
            subject,
            html
        });
        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Email send failed:', error);
        throw error;
    }
}