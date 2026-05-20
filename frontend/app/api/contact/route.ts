import { NextResponse } from "next/server";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, projectType, message, website } = body;

    // Honeypot check
    if (website) {
      console.warn("Honeypot field triggered. Discarding request as spam.");
      return NextResponse.json({ success: true, message: "Email sent successfully." });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Input Validation
    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json({ error: "Invalid name format or length." }, { status: 400 });
    }

    if (typeof email !== "string" || email.length > 150) {
      return NextResponse.json({ error: "Invalid email format or length." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (typeof message !== "string" || message.length > 5000) {
      return NextResponse.json({ error: "Message too long." }, { status: 400 });
    }

    if (projectType && (typeof projectType !== "string" || projectType.length > 50)) {
      return NextResponse.json({ error: "Invalid project type." }, { status: 400 });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not defined in environment variables.");
      return NextResponse.json(
        { error: "Mail service not configured. Please add RESEND_API_KEY to your environment." },
        { status: 500 }
      );
    }

    // HTML escape variables to prevent HTML/XSS injection in email clients
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeProjectType = escapeHtml(projectType || "Not specified");
    const safeMessage = escapeHtml(message);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "hardikvatukiya0014@gmail.com",
        subject: `New Portfolio Inquiry: ${safeName}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #000; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-top: 0;">New Portfolio Inquiry</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Project Type:</strong> ${safeProjectType}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap;">${safeMessage}</div>
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
