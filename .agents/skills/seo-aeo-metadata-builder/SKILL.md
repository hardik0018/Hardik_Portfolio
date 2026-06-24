---
name: seo-aeo-metadata-builder
description: >
  Use this skill whenever you need to implement, audit, or fix SEO or AEO
  (Answer Engine Optimization) in a Next.js App Router project (v15 or v16+).
  Triggers: adding or fixing metadata exports, configuring metadataBase,
  writing generateMetadata for dynamic routes, creating sitemap.ts /
  robots.ts / opengraph-image.tsx, injecting JSON-LD structured data
  (FAQPage, Article, BreadcrumbList, Organization, Person, Product, WebSite),
  writing content for AI citation, making pages AI-crawler-friendly, or any
  task touching search-engine visibility, AI answer engines (ChatGPT,
  Perplexity, Google AI Overviews, Claude), or Core Web Vitals. Always
  consult this skill first — Next.js metadata APIs have breaking changes
  across versions and silent misconfiguration is common.
---

# SEO & AEO Metadata Builder — Next.js App Router (v15 / v16+)

## Mental model: two audiences, one codebase

Every page serves two crawlers:

| Crawler type | Goal | What it reads | What it ignores |
|---|---|---|---|
| **Search engine** (Googlebot) | Rank your page | HTML, JS (full render) | Nothing — it executes JS |
| **AI answer engine** (GPTBot, CCBot, PerplexityBot) | Extract factual content to cite | Raw HTML only | JavaScript, `useEffect`, client components |

**Consequence:** any content rendered client-side is invisible to AI engines. Server Components + SSR are not optional for AEO — they are the foundation.

---

## Version compatibility matrix

| Feature | Next.js 14 | Next.js 15 | Next.js 16 |
|---|---|---|---|
| `params` / `searchParams` in page props | sync | sync (deprecation warning) | **async (Promise) — BREAKING** |
| `viewport` inside `metadata` | works (warns) | works (warns) | must be separate export |
| `generateMetadata` signature | sync params ok | sync params ok | must `await params` |
| `metadataBase` required for OG | yes | yes | yes |

Always use the v16-safe pattern. It is backwards-compatible with v15.

---

## Step 0 — Confirm server-rendering before anything else

AEO fails silently. Run this mental check first:

```bash
# Quick audit: curl the page and grep for your key content
curl -s https://yourdomain.com/your-page | grep "key phrase from page"
```

If the phrase is absent, the content is client-rendered. Move it to a Server Component or fetch it in `page.tsx` before adding any metadata — metadata on an empty shell is worthless.

---

## Step 1 — Root layout: metadataBase + global schema

`metadataBase` is the single most common misconfiguration. Without it, every OG image and canonical URL is relative and therefore broken in production.

```tsx
// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { JsonLd } from "@/components/json-ld";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yourdomain.com";
const SITE_NAME = "Your Site Name";

// viewport MUST be a separate export since Next.js 14.3+
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Your default description — 150 to 160 chars, plain language, one clear value prop.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    images: [{ url: "/og/default.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yourhandle",
    creator: "@yourhandle",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: "/" },
};

// WebSite schema — tells AI engines the site name and URL definitively
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// Organization schema — critical for brand entity disambiguation in AI
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://twitter.com/yourhandle",
    "https://linkedin.com/company/yourcompany",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd data={[websiteSchema, orgSchema]} />
        {children}
      </body>
    </html>
  );
}
```

---

## Step 2 — JsonLd component (once, reused everywhere)

```tsx
// components/json-ld.tsx
// Accepts a single schema object or an array for multiple schemas on one page.
type SchemaObject = Record<string, unknown>;

interface JsonLdProps {
  data: SchemaObject | SchemaObject[];
}

export function JsonLd({ data }: JsonLdProps) {
  // Multiple schemas: emit one <script> per object (spec-compliant, easier to debug)
  const schemas = Array.isArray(data) ? data : [data];
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify is safe here — this is not interpolated into HTML attributes
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
```

---

## Step 3 — Static page metadata

```tsx
// app/about/page.tsx
import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "About",                         // Rendered as "About | Your Site Name"
  description: "Learn about our team, mission, and the problems we solve.",
  alternates: { canonical: "/about" },    // Always set canonical on every page
  openGraph: {
    title: "About Us",
    description: "Learn about our team, mission, and the problems we solve.",
    url: "/about",
    images: [{ url: "/og/about.png", width: 1200, height: 630, alt: "About Us" }],
  },
};

export default function AboutPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yourdomain.com" },
      { "@type": "ListItem", position: 2, name: "About", item: "https://yourdomain.com/about" },
    ],
  };

  return (
    <main>
      <JsonLd data={breadcrumbSchema} />
      <h1>About Us</h1>
      {/* ... */}
    </main>
  );
}
```

---

## Step 4 — Dynamic routes: generateMetadata (v16-safe)

The most common bug: accessing `params.slug` synchronously in v16. Always `await params`.

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/json-ld";
import { fetchPost } from "@/lib/posts";

// v16-safe — works in v15 too
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return {};            // Next.js renders 404; metadata is irrelevant

  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage ?? "/og/default.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? `https://yourdomain.com/og/default.png`,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `https://yourdomain.com/authors/${post.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Your Site Name",
      logo: { "@type": "ImageObject", url: "https://yourdomain.com/logo.png" },
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://yourdomain.com/blog/${slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://yourdomain.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://yourdomain.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://yourdomain.com/blog/${slug}` },
    ],
  };

  return (
    <article>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <h1>{post.title}</h1>
      {/* Render content server-side — never dangerouslySetInnerHTML from untrusted input */}
      <div>{post.content}</div>
    </article>
  );
}
```

**Performance note:** `generateMetadata` and the page component both call `fetchPost`. Next.js deduplicates `fetch()` calls within a render pass automatically — but only if you use the native `fetch` API. If using an ORM (Prisma, Drizzle), wrap the call with `React.cache()`:

```ts
// lib/posts.ts
import { cache } from "react";
export const fetchPost = cache(async (slug: string) => { /* db query */ });
```

---

## Step 5 — FAQPage schema (highest AEO impact)

FAQPage is the schema type most frequently used as a direct source by AI answer engines. Every page that answers questions should have it. The `text` field of `acceptedAnswer` must be a complete, self-contained answer — not a teaser that requires clicking.

```tsx
// Pattern: co-locate schema with the FAQ component so they stay in sync

interface FaqItem {
  question: string;
  answer: string;  // Plain text. No HTML. 1–4 sentences. Complete answer.
}

const faqs: FaqItem[] = [
  {
    question: "What is [your product]?",
    answer:
      "[Product] is a [category] that helps [audience] achieve [outcome] by [mechanism]. It [differentiator].",
  },
  {
    question: "How much does [your product] cost?",
    answer:
      "[Product] starts at $X/month for [tier]. A free trial is available with no credit card required.",
  },
];

function FaqSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <section aria-labelledby="faq-heading">
      <JsonLd data={faqSchema} />
      <h2 id="faq-heading">Frequently Asked Questions</h2>
      {faqs.map(({ question, answer }) => (
        <details key={question}>
          <summary>{question}</summary>
          <p>{answer}</p>
        </details>
      ))}
    </section>
  );
}
```

**AEO content rules for FAQs:**
- Each answer must read correctly when extracted by an AI with zero surrounding context.
- Never answer "It depends." Give the most useful concrete answer and qualify it inline.
- Use `<details>` + `<summary>` for progressive disclosure — still in raw HTML, so AI-readable.

---

## Step 6 — Product schema

```tsx
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.images.map((img) => img.url),
  brand: { "@type": "Brand", name: "Your Brand" },
  offers: {
    "@type": "Offer",
    url: `https://yourdomain.com/products/${product.slug}`,
    priceCurrency: "USD",
    price: product.price,
    availability: product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: { "@type": "Organization", name: "Your Site Name" },
  },
  aggregateRating: product.reviewCount > 0
    ? {
        "@type": "AggregateRating",
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
      }
    : undefined,
};
```

---

## Step 7 — Sitemap

Include every public, canonical URL. Exclude pagination (`?page=2`), filtered views, and authenticated routes.

```typescript
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { fetchAllPosts } from "@/lib/posts";
import { fetchAllProducts } from "@/lib/products";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, products] = await Promise.all([
    fetchAllPosts(),
    fetchAllProducts(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...productRoutes];
}
```

---

## Step 8 — Robots

```typescript
// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/admin/",
          "/private/",
          "/_next/",
          "/search?",    // Disallow search result pages (duplicate content)
        ],
      },
      // Explicitly allow AI crawlers — some respect a robots.txt that doesn't name them
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

---

## Step 9 — llms.txt (AI crawler guidance)

Place at `/public/llms.txt`. Modelled on `robots.txt` but designed for LLM context windows — it tells an AI which parts of your site are authoritative and how to interpret your content.

```
# llms.txt
# AI crawler guidance for yourdomain.com
# Spec: https://llmstxt.org

## Site
- Name: Your Site Name
- URL: https://yourdomain.com
- Description: One sentence. What the site is and who it serves.
- Language: en

## Preferred content for AI use
- /blog          - All published articles. Authoritative. Updated weekly.
- /faq           - Canonical answers to common questions.
- /docs          - Product documentation. Most reliable technical source.
- /about         - Company background and team.

## Content to deprioritize
- /search        - Dynamic, low-signal query results
- /tag/*         - Tag archive pages, redundant with blog posts
- /page/*        - Pagination pages

## Contact
- Technical: tech@yourdomain.com
```

---

## Step 10 — opengraph-image.tsx (dynamic OG images)

```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from "next/og";
import { fetchPost } from "@/lib/posts";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f0f0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
        }}
      >
        <p style={{ color: "#888", fontSize: 24, margin: 0 }}>Your Site Name</p>
        <h1 style={{ color: "#fff", fontSize: 56, margin: "16px 0 0", lineHeight: 1.1 }}>
          {post?.title ?? "Blog"}
        </h1>
      </div>
    ),
    { ...size }
  );
}
```

---

## Patterns to avoid — expert-level pitfalls

### ❌ Stale fetch deduplication with ORMs

```tsx
// WRONG — Prisma calls are not deduplicated by Next.js
async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }); // called twice
}
async function Page({ params }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } }); // second hit
}

// CORRECT — wrap with React.cache
import { cache } from "react";
const getPost = cache((slug: string) =>
  prisma.post.findUnique({ where: { slug } })
);
```

### ❌ Dynamic metadata that defeats static generation

```tsx
// WRONG — forces every blog post to SSR
export async function generateMetadata() {
  const data = await fetch("/api/dynamic-thing", { cache: "no-store" });
}

// CORRECT — revalidate on a schedule, not per-request
export async function generateMetadata() {
  const data = await fetch("https://yourdomain.com/api/thing", {
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });
}
```

### ❌ Viewport inside metadata (broken since v14.3)

```tsx
// WRONG
export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1",  // ← deprecated, logs warning
};

// CORRECT
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
```

### ❌ Relative URLs in JSON-LD

```json
// WRONG — AI engines and validators reject relative URLs in schema
{ "@type": "Article", "url": "/blog/my-post" }

// CORRECT
{ "@type": "Article", "url": "https://yourdomain.com/blog/my-post" }
```

### ❌ Truncated FAQPage answers

```json
// WRONG — AI engine cannot use this as a citation
{ "text": "It depends on your use case. Learn more on our pricing page." }

// CORRECT — complete, self-contained
{ "text": "The Pro plan costs $29/month and includes unlimited projects, priority support, and API access. Enterprise pricing starts at $199/month." }
```

---

## Pre-deployment checklist

**Core metadata**
- [ ] `metadataBase` set in root layout with full `https://` URL
- [ ] `title.template` set for consistent page title formatting
- [ ] `viewport` is a separate export, not inside `metadata`
- [ ] Every public page has a unique `title`, `description` (150–160 chars), and `canonical`
- [ ] OG images are 1200×630 px, under 8 MB

**Structured data**
- [ ] `WebSite` + `Organization` schema in root layout
- [ ] `Article` schema on all blog/news pages
- [ ] `FAQPage` schema where applicable — answers are complete and self-contained
- [ ] `BreadcrumbList` on all pages beyond home
- [ ] All schema URLs are absolute (`https://...`)
- [ ] Validated with [Google Rich Results Test](https://search.google.com/test/rich-results)

**AI-readability**
- [ ] All important content is in Server Components (verify with `curl`)
- [ ] Semantic HTML used throughout (`<article>`, `<section>`, `<h1>`–`<h3>`)
- [ ] `app/robots.ts` explicitly allows GPTBot, CCBot, PerplexityBot, anthropic-ai
- [ ] `/public/llms.txt` exists and is accurate
- [ ] `app/sitemap.ts` includes all dynamic routes with `lastModified`

**Next.js 16 compatibility**
- [ ] All `generateMetadata` functions `await params`
- [ ] All page components `await params` / `await searchParams`
- [ ] No synchronous access to `params` anywhere in App Router pages

**Validation tools**
- Google Rich Results Test: https://search.google.com/test/rich-results
- OpenGraph preview: https://opengraph.xyz
- Schema validator: https://validator.schema.org
- PageSpeed / Core Web Vitals: https://pagespeed.web.dev
