import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

async function getBuffer(file) {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes);
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const emails = formData.get("emails").split(","); // Convertir en tableau
    const subject = formData.get("subject");
    const message = formData.get("message") || "Veuillez trouver le fichier PDF en pièce jointe.";
    const file = formData.get("file");

    if (!emails.length || !subject || !file) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const fileBuffer = await getBuffer(file);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔹 Envoyer les emails en lot (batch de 10)
    const batchSize = 10; // Nombre max d’emails par envoi
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize); // Sélectionner un groupe d’emails

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: batch, // Envoi aux destinataires du batch
        subject: subject,
        text: message,
        attachments: [
          {
            filename: file.name,
            content: fileBuffer,
            contentType: "application/pdf",
          },
        ],
      };

      await transporter.sendMail(mailOptions);
    }

    return NextResponse.json({ message: "Emails envoyés avec succès !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ error: "Échec de l'envoi de l'email." }, { status: 500 });
  }
}
