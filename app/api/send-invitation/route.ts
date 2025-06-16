import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, eventName, eventDate, eventLocation, eventId } =
      await request.json();

    // Configuration du transporteur d'email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Formatage de la date
    const formattedDate = new Date(eventDate).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Envoi de l'email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `Invitation à l'événement : ${eventName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="dark">
          <meta name="supported-color-schemes" content="dark">
          <title>Invitation MeetSync</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body {
              margin: 0;
              padding: 0;
              font-family: 'Inter', Arial, sans-serif;
              background-color: #000000;
              -webkit-text-size-adjust: 100%;
              -ms-text-size-adjust: 100%;
              color: #ffffff;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #000000;
            }
            .header {
              background-color: #000000;
              padding: 40px 20px;
              text-align: center;
            }
            .logo {
              font-size: 32px;
              font-weight: bold;
              margin: 0;
            }
            .meet {
              background: linear-gradient(to right, #FF1CF7, #b249f8);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              display: inline;
            }
            .sync {
              color: white;
              display: inline;
            }
            .content {
              background-color: #111111;
              padding: 40px 20px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            }
            .event-card {
              background-color: #1A1A1A;
              border-radius: 8px;
              padding: 25px;
              margin-bottom: 30px;
              border: 1px solid #2D3748;
            }
            .button {
              background: linear-gradient(135deg, #6B46C1 0%, #EC4899 100%);
              color: #ffffff !important;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              display: inline-block;
              font-size: 16px;
              text-transform: uppercase;
              letter-spacing: 1px;
              box-shadow: 0 4px 6px rgba(107, 70, 193, 0.2);
              border: none;
              cursor: pointer;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #2D3748;
            }
            @media screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 10px !important;
              }
              .content {
                padding: 20px !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- En-tête -->
            <div class="header">
              <h1 class="logo">
                <span class="meet">MEET</span><span class="sync">SYNC</span>
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0; font-size: 16px;">Votre plateforme d'événements</p>
            </div>

            <!-- Contenu principal -->
            <div class="content">
              <h2 style="color: #EC4899; margin: 0 0 20px; font-size: 24px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Vous avez été invité !</h2>
              
              <p style="color: #E2E8F0; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Bonjour,<br>
                Vous avez été invité à participer à un événement exclusif sur MeetSync.
              </p>

              <!-- Carte de l'événement -->
              <div class="event-card">
                <h3 style="color: #6B46C1; margin: 0 0 15px; font-size: 22px; font-weight: bold;">${eventName}</h3>
                
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                  <svg style="width: 20px; height: 20px; margin-right: 10px; color: #EC4899;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span style="color: #E2E8F0; font-size: 16px;">${formattedDate}</span>
                </div>

                <div style="display: flex; align-items: center;">
                  <svg style="width: 20px; height: 20px; margin-right: 10px; color: #EC4899;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span style="color: #E2E8F0; font-size: 16px;">${eventLocation}</span>
                </div>
              </div>

              <!-- Bouton d'action -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/dashboard/my_event/${eventId}" class="button" style="color: #ffffff !important;">
                  Voir l'invitation
                </a>
              </div>

              <!-- Pied de page -->
              <div class="footer">
                <p style="color: #718096; font-size: 14px; margin: 0;">
                  Cet email a été envoyé par <span class="meet">MEET</span><span class="sync">SYNC</span><br>
                  Pour toute question, n'hésitez pas à nous contacter
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}
