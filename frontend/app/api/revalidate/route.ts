import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const allowedTags = new Set(["hero", "about", "projects", "skills", "journey", "contact", "navigation"]);

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  const expectedSecret = process.env.SANITY_REVALIDATE_SECRET;

  if (!expectedSecret) {
    console.error("SANITY_REVALIDATE_SECRET is not configured in environment variables.");
    return NextResponse.json({ error: "Revalidation service not configured" }, { status: 500 });
  }

  if (secret !== expectedSecret) {
    return NextResponse.json({ error: "Invalid revalidation secret" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const tag = typeof body.tag === "string" ? body.tag : undefined;

  if (!tag || !allowedTags.has(tag)) {
    return NextResponse.json({ error: "Unsupported revalidation tag" }, { status: 400 });
  }

  revalidateTag(`sanity:${tag}`, "max");

  return NextResponse.json({ revalidated: true, tag });
}
