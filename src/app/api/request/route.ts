import { sendMail } from "@/lib/mail-utils";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, type, title, description, priority } = data;

    if (!name || !email || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sendMail({
      subject: `🚀 Calculator Request: ${title}`,
      replyTo: email,
      text: `
        New Calculator Idea
        ------------------
        From: ${name} (${email})
        Type: ${type}
        Title: ${title}
        Priority: ${priority}
        
        Idea Details:
        ${description}
      `,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 2px solid #f59e0b; border-radius: 8px;">
          <h2 style="color: #f59e0b;">🚀 New Calculator Request</h2>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Proposed By:</strong> ${name} (${email})</p>
          <p><strong>Type:</strong> ${type}</p>
          <p><strong>Priority Status:</strong> ${priority}</p>
          <hr />
          <p><strong>The Vision:</strong></p>
          <p>${description.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({ message: "Request sent successfully" });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal mail error" }, { status: 500 });
  }
}
