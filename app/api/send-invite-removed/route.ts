import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, eventName } = await request.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const html = `
      <div style="background:#181028; color:#fff; font-family:Segoe UI,Arial,sans-serif; padding:32px; border-radius:16px; max-width:480px; margin:auto;">
        <h2 style="margin-bottom:24px; font-size:1.5rem; font-weight:bold; background:linear-gradient(to right, #FF1CF7, #b249f8); -webkit-background-clip:text; color:transparent; background-clip:text;">Invitation annulée sur MeetSync</h2>
        <p style="font-size:1.1rem; margin-bottom:24px; color:#e0e7ef;">Bonjour,<br><br>Votre invitation à l'événement <span style="color:#b249f8; font-weight:bold;">${eventName}</span> a été <span style="color:#e57373; font-weight:bold;">annulée</span>.</p>
        <div style="text-align:center; margin: 32px 0;">
          <a href="http://localhost:3000/dashboard/my_event" style="background:linear-gradient(135deg,#6B46C1 0%,#EC4899 100%);color:#fff!important;padding:14px 32px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;font-size:16px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 6px rgba(107,70,193,0.2);border:none;cursor:pointer;">
            Accéder à mes événements
          </a>
        </div>
        <p style="font-size:0.95rem; color:#a1a1aa;">Si vous pensez qu'il s'agit d'une erreur, contactez l'organisateur ou répondez à ce mail.</p>
        <div style="margin-top:32px; text-align:center; font-size:0.9rem; color:#b249f8;">L'équipe MeetSync</div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Invitation annulée sur MeetSync`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}