import { sendMail } from "@/lib/mail-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, location, browser, description } = data;

    if (!location || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendMail({
      subject: `🐛 Bug Report: ${location}`,
      replyTo: email || undefined,
      text: `
        Bug Report
        ----------
        Reporter: ${name || 'Anonymous'}
        Email: ${email || 'N/A'}
        Location: ${location}
        Browser: ${browser}
        
        Description:
        ${description}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #ef4444; border-radius: 8px;">
          <h2 style="color: #ef4444;">🐛 New Bug Report</h2>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Reporter:</strong> ${name || 'Anonymous'} (${email || 'No email provided'})</p>
          <p><strong>Environment:</strong> ${browser}</p>
          <hr />
          <p><strong>Description:</strong></p>
          <p>${description.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({ message: "Bug report delivered" });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Portal error" }, { status: 500 });
  }
}
