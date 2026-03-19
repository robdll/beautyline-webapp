import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'noreply@beautylineprofessional.com';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${APP_URL}/verify?token=${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verifica il tuo account BeautyLine',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8B66A9; text-align: center;">BeautyLine Professional</h1>
        <p>Grazie per esserti registrato su BeautyLine Professional.</p>
        <p>Clicca il pulsante qui sotto per verificare il tuo indirizzo email:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}"
             style="background-color: #DEA43E; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
            Verifica Email
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          Se non hai creato un account, puoi ignorare questa email.
        </p>
        <p style="color: #999; font-size: 12px;">Il link scade tra 24 ore.</p>
      </div>
    `,
  });
}
