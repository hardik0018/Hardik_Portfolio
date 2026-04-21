import mongoose from "mongoose";

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

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);

export default Project;
