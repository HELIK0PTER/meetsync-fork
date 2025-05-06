import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM || 'no-reply@meetsync.com';

export async function POST(req: Request) {
  const { email, eventName } = await req.json();
  if (!email || !eventName) {
    return NextResponse.json({ error: 'Missing email or eventName' }, { status: 400 });
  }

  const html = `
    <div style="background: #181028; color: #fff; font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; border-radius: 16px; max-width: 480px; margin: auto;">
      <h2 style="color: #a78bfa; margin-bottom: 24px;">Invitation annulée sur <span style="color: #7c3aed;">MeetSync</span></h2>
      <p style="font-size: 1.1rem; margin-bottom: 24px;">Bonjour,<br><br>Votre invitation à l'événement <span style="color: #a78bfa; font-weight: bold;">${eventName}</span> a été <span style="color: #ef4444; font-weight: bold;">annulée</span> par l'organisateur.</p>
      <div style="margin: 32px 0; text-align: center;">
        <span style="display: inline-block; background: #7c3aed; color: #fff; padding: 10px 28px; border-radius: 9999px; font-weight: bold; font-size: 1.1rem;">MeetSync</span>
      </div>
      <p style="font-size: 0.95rem; color: #a1a1aa;">Si vous pensez qu'il s'agit d'une erreur, contactez l'organisateur ou répondez à ce mail.</p>
      <div style="margin-top: 32px; text-align: center; font-size: 0.9rem; color: #a78bfa;">L'équipe MeetSync</div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Invitation annulée sur MeetSync`,
      html,
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
  }
} 