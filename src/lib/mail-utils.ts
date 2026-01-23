import nodemailer from 'nodemailer';

// SMTP Configuration from User
const isDev = process.env.NODE_ENV === 'development';

const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: "support@docket.one",
    // In production, these should be environment variables. 
    // For this implementation, I'm using the provided credentials directly.
    pass: "Galvatron101!", 
  },
});

export type EmailPayload = {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export async function sendMail({ subject, text, html, replyTo }: EmailPayload) {
  try {
    const info = await transporter.sendMail({
      from: `"Docket One Support" <support@docket.one>`,
      to: "support@docket.one", // Sending to self/support
      subject: subject,
      text: text,
      html: html,
      replyTo: replyTo,
    });
    
    console.log("Message sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: error instanceof Error ? error.message : "Portal error" };
  }
}
