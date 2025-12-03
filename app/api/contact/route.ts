import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/MongoDb";
import { rateLimiter } from "@/lib/rateLimiter";
import nodemailer from "nodemailer";

const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    subject: String,
    message: String,
  },
  { timestamps: true }
);

const apppass = process.env.APP_PASS;

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (!rateLimiter(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  } catch (err) {
    return NextResponse.json({ error: "Rate limiter failed" }, { status: 500 });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hardikvatukiya0014@gmail.com",
      pass: apppass,
    },
  });

  try {
    await connectDB();
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill all the fields" },
        { status: 400 }
      );
    }
    // Send to YOU
    await transporter.sendMail({
      from: email,
      to: "hardikvatukiya0014@gmail.com",
      subject: `${subject} |  New Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    // Send to USER
    await transporter.sendMail({
      from: "hardikvatukiya0014@gmail.com",
      to: email,
      subject: "Thanks for contacting me!",
      text: `Hi ${name},\n\nThanks for your message! I'll get back to you soon.\n\nBest,\n Hardik Vatukiya`,
    });
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimiter(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
