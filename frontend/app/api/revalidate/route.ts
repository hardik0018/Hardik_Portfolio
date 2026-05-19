import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const allowedTags = new Set(["hero", "about", "projects", "skills", "journey", "contact", "navigation"]);

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");

  if (process.env.SANITY_REVALIDATE_SECRET && secret !== process.env.SANITY_REVALIDATE_SECRET) {
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
