import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, projectType, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Mail service not configured. Please add RESEND_API_KEY to your environment." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "hardikvatukiya0014@gmail.com",
        subject: `New Portfolio Inquiry: ${name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #000; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">New Portfolio Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Project Type:</strong> ${projectType || "Not specified"}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${message}</div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { error: errorData.message || "Failed to send email." },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("Contact API handler error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending email." },
      { status: 500 }
    );
  }
}
