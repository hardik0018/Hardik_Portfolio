import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/MongoDb";

// Mongoose Schema
const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "/placeholder.svg",
    },
    tags: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: "#",
    },
    githubUrl: {
      type: String,
      default: "#",
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Model re-use check
const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

// GET: fetch all projects
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

// POST: Add a new project
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, description, image, tags, liveUrl, githubUrl, featured } =
      body;

    if (!title || !description || !image || !tags) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const newProject = new Project({
      title,
      description,
      image,
      tags,
      liveUrl,
      githubUrl,
      featured,
    });

    await newProject.save();

    return NextResponse.json(
      { success: true, project: newProject },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
