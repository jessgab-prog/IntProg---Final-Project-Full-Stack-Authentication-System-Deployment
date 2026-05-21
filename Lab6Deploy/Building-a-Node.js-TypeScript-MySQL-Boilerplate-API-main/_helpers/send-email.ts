import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const DEV_REDIRECT_EMAIL = process.env.DEV_EMAIL || 'jessgetaruelas@gmail.com'; 

export default async function sendEmail({ to, subject, html }: any) {
    try {
        // In development/testing: always send to your Gmail
        // Include the original recipient in the email body so you know who it was for
        const actualRecipient = DEV_REDIRECT_EMAIL;
        const devNote = `<p style="background:#fff3cd;padding:8px;border-radius:4px;">
            <strong>⚠️ DEV MODE:</strong> This email was intended for <strong>${to}</strong>
        </p>`;

        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: actualRecipient,
            subject: `[${to}] ${subject}`,
            html: devNote + html
        });
        console.log('Email sent successfully:', result);
    } catch (error) {
        console.error('Email send failed:', error);
        throw error;
    }
}