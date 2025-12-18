import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EVENT_TYPE_LABELS: Record<string, string> = {
  'festa-privata': 'Festa privata / Matrimonio',
  'evento-aziendale': 'Evento aziendale / Team building',
  'festival': 'Festival / Fiera',
  'noleggio': 'Noleggio',
  'altro': 'Altro',
};

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;

    if (!apiKey || !toEmail || !fromEmail) {
      return NextResponse.json(
        {
          error:
            'Server not configured. Missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL.',
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { name, email, phone, eventType, eventDate, guests, message } = body as {
      name?: string;
      email?: string;
      phone?: string;
      eventType?: string;
      eventDate?: string;
      guests?: string;
      message?: string;
    };

    // Validate required fields
    if (!name || !email || !phone || !eventType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const eventTypeLabel = EVENT_TYPE_LABELS[eventType] || eventType;

    const safeName = escapeHtml(String(name));
    const safeEmail = escapeHtml(String(email));
    const safePhone = escapeHtml(String(phone));
    const safeEventTypeLabel = escapeHtml(String(eventTypeLabel));
    const safeEventDate = eventDate ? escapeHtml(String(eventDate)) : '';
    const safeGuests = guests ? escapeHtml(String(guests)) : '';
    const safeMessageHtml = message
      ? escapeHtml(String(message)).replace(/\n/g, '<br />')
      : '';

    const emailHtml = `
      <h2>Nuova richiesta di contatto - Beautyline</h2>
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Telefono:</strong> ${safePhone}</p>
        <p><strong>Tipo di evento:</strong> ${safeEventTypeLabel}</p>
        ${safeEventDate ? `<p><strong>Data evento:</strong> ${safeEventDate}</p>` : ''}
        ${safeGuests ? `<p><strong>Numero ospiti:</strong> ${safeGuests}</p>` : ''}
        ${safeMessageHtml ? `<p><strong>Messaggio:</strong><br>${safeMessageHtml}</p>` : ''}
      </div>
    `;

    const emailText = `
Nuova richiesta di contatto - Beautyline

Nome: ${name}
Email: ${email}
Telefono: ${phone}
Tipo di evento: ${eventTypeLabel}
${eventDate ? `Data evento: ${eventDate}` : ''}
${guests ? `Numero ospiti: ${guests}` : ''}
${message ? `\nMessaggio:\n${message}` : ''}
    `.trim();

    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `Nuova richiesta contatto: ${name} - ${eventTypeLabel}`,
      html: emailHtml,
      text: emailText,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
