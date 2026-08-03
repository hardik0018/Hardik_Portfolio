// seed-faq.mjs — uses fetch directly (no package imports, no pnpm issues)
// Run with: node seed-faq.mjs
// Requires: SANITY_AUTH_TOKEN env var OR will read Sanity CLI auth file

import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const PROJECT_ID = "1wlu6dtl";
const DATASET    = "production";
const API_VER    = "2024-01-01";

// ── Resolve auth token ────────────────────────────────────────────────────────

function resolveToken() {
  // 1. CLI argument:  node seed-faq.mjs <token>
  if (process.argv[2] && process.argv[2].length > 10) return process.argv[2];

  // 2. Environment variable
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;

  // 3. Sanity CLI stored token (various locations)
  const candidates = [
    join(homedir(), ".config", "sanity", "auth.json"),
    join(homedir(), ".config", "sanity", "config.json"),
    join(homedir(), "AppData", "Roaming", "sanity", "auth.json"),
    join(homedir(), "AppData", "Roaming", "Sanity", "config.json"),
  ];

  for (const p of candidates) {
    try {
      const json = JSON.parse(readFileSync(p, "utf8"));
      const token =
        json?.users?.[0]?.token ??
        json?.token ??
        json?.authToken ??
        json?.["auth:token"];
      if (token) return token;
    } catch { /* not found */ }
  }

  console.error(
    "\n❌  No token found. Pass it directly:\n" +
    "    node seed-faq.mjs <your-sanity-token>\n\n" +
    "    Or set env var:\n" +
    "    $env:SANITY_AUTH_TOKEN = 'your-token' ; node seed-faq.mjs\n\n" +
    "    Get a token: https://www.sanity.io/manage → project 1wlu6dtl → API → Tokens\n"
  );
  process.exit(1);
}

// ── FAQ document ─────────────────────────────────────────────────────────────

const FAQ_DOC = {
  _id: "faq",
  _type: "faq",
  title: "Questions\nAnswered.",
  subtitle: "Everything you might want to know — about my work, process, and how we can collaborate.",
  items: [
    { _key: "faq-01", question: "Who are you and what do you build?",                    answer: "I'm Hardik Vatukiya — a full-stack developer and UI engineer specialising in high-performance, animation-rich web experiences. I bridge the gap between design precision and engineering quality." },
    { _key: "faq-02", question: "Are you available for freelance projects?",              answer: "Yes — selectively. I work with startups and product teams to build polished digital products. Reach out through the contact section with your project idea and we'll figure out the fit." },
    { _key: "faq-03", question: "What inspired you to focus on high-end interactive portfolios and UI development?", answer: "I've always believed that the web shouldn't be boring. Static templates miss the chance to tell a story or build a memorable brand. I love bridging the gap between design and engineering to create interfaces that respond dynamically to user interaction, making the web feel alive and engaging." },
    { _key: "faq-04", question: "What is your primary tech stack?",                      answer: "Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP 3, Framer Motion, and Sanity v5. I'm stack-agnostic and comfortable jumping into new tooling when the project calls for it." },
    { _key: "faq-05", question: "How long does a typical project take?",                 answer: "A polished landing page takes 1–2 weeks. A full-stack product with auth, CMS, and custom animations typically runs 4–8 weeks, depending on scope and feedback speed." },
    { _key: "faq-06", question: "Can you work from a Figma file or handle design too?",  answer: "Both. I can execute faithfully from a Figma file, or take complete ownership of the visual direction — typography, spacing, colour, and motion — entirely from scratch." },
    { _key: "faq-07", question: "What makes your work different from other developers?",  answer: "I treat motion as a first-class design tool, not an afterthought. Every animation I write earns its place by guiding attention, communicating system state, or reinforcing brand identity." },
    { _key: "faq-08", question: "How do I get started working with you?",                 answer: "Use the contact form below. Share your project idea, rough timeline, and budget range. I'll reply within 24 hours with an initial assessment and clear next steps." },
  ],
};

// ── Sanity Mutations API (HTTP) ───────────────────────────────────────────────

async function main() {
  const token = resolveToken();
  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VER}/data/mutate/${DATASET}`;

  const body = JSON.stringify({
    mutations: [
      { createOrReplace: FAQ_DOC },
    ],
  });

  console.log(`\n🌱  Seeding FAQ → ${PROJECT_ID}.sanity.io (${DATASET})…\n`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body,
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("❌  API error:", JSON.stringify(json, null, 2));
    process.exit(1);
  }

  console.log(`✅  Done! Results:`);
  console.log(`    documentId : ${json?.results?.[0]?.id ?? "faq"}`);
  console.log(`    operation  : ${json?.results?.[0]?.operation ?? "createOrReplace"}`);
  console.log(`    Questions  : ${FAQ_DOC.items.length}\n`);
  FAQ_DOC.items.forEach((item, i) => {
    console.log(`    ${String(i + 1).padStart(2, "0")}. ${item.question}`);
  });
  console.log("\n💡  Open Studio to verify → http://localhost:3333\n");
}

main().catch((err) => {
  console.error("❌  Unexpected error:", err?.message ?? err);
  process.exit(1);
});
