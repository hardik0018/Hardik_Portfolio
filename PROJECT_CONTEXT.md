# PROJECT_CONTEXT.md — Portfolio Application Context

## 1. App Goal
The primary goal of this application is to showcase the professional work, development journey, technical skills, and projects of **Hardik Vatukiya**, a Full-Stack MERN (MongoDB, Express.js, React, Node.js) and Next.js developer based in Rajkot, Gujarat, India. The site acts as an interactive resume, contact point, and demonstration of high-quality frontend animation, design engineering, and SEO optimization.

---

## 2. Target Users
* **Technical Recruiters & Hiring Managers**: Looking to evaluate technical skillsets, project quality, code structures, and professional experience.
* **Potential Clients**: Seeking a freelance or contract web developer to build modern, high-performance web applications.
* **Open Source Community**: Developers reviewing repository code or looking to learn from advanced GSAP animations and Next.js structures.

---

## 3. Main Features

### Dynamic Content Management (Sanity Studio CMS)
Content (Hero copy, Bio details, Skills list, Journey stages, Project records, FAQs, and Navigation structure) is managed dynamically through a customized headless Sanity CMS.

### Immersive UI/UX and Animations
* **GSAP Scroll Pinning**: High-fidelity pinning transitions on large screens (>=1024px) for Hero and About sections.
* **Slide-up Contact Form Reveal**: The contact section slides up from "behind" the FAQ section on scroll.
* **Custom Confetti Button**: Primary button triggers a physical particle-burst confetti animation using GSAP's ticker, calculated dynamically from click coordinate positions.
* **Fluid Scroll**: Integrated with Lenis for smooth momentum scrolling.
* **Interactive Elements**: Uses Cobe (a 3D WebGL Canvas globe) with floating polaroids, and SVG/CSS keyframe animation overlays.

### API Routes
* **`/api/contact`**: Validates form inputs, filters out spam with a honeypot field, escapes HTML characters to prevent injections, and delivers formatted notifications to the owner's inbox via Resend.
* **`/api/revalidate`**: Secures cache purge requests via a shared webhook token and revalidates static content tags using Next.js caching.

---

## 4. Current Implementation Status

| Section / Component | Status | Source | Notes |
| :--- | :--- | :--- | :--- |
| **Hero Section** | Fully Implemented | Sanity CMS `hero` model | Displays interactive marquee and RevealImage portrait |
| **About Section** | Fully Implemented | Sanity CMS `about` model | Timelines and bio, eagerly loaded to avoid jumping scroll bugs |
| **Projects Section** | Fully Implemented | Sanity CMS `project` model | Horizontal scroll container on landing page & detail routes |
| **Journey Timeline** | Fully Implemented | Sanity CMS `journeyStage` model | Vertical timeline mapping milestones with specific Lucide icons |
| **Skills Grid** | Fully Implemented | Sanity CMS `skill` model | Gridded grid cells displaying skill percentages, categories, custom icons |
| **FAQ Accordion** | Fully Implemented | Sanity CMS `faq` model | Interactive accordions for frequently asked questions |
| **Contact Form** | Fully Implemented | Sanity CMS `contact` model | Connects to `/api/contact` with validation and spam control |
| **Header Navigation** | Fully Implemented | Sanity CMS `navigation` model | Sticky top navigation header, singleton content entry |
| **Gallery Carousel** | **Inactive / Not Rendered** | Sanity CMS `gallery` model | **[IMPORTANT]** Schema, queries, and loaders are fully written, but the section is omitted in [ClientHome.tsx](file:///e:/Home/Hardik_Portfolio/frontend/components/ClientHome.tsx). |

---

## 5. Important Flows

### 1. Initial Page Load Flow
```
User visits page 
  └─► Server fetches page data from Sanity via Promise.all (app/page.tsx)
  └─► MainLoader component renders (full-screen intro loader sequence)
  └─► ClientHome takes fetched data props and renders eager layouts
  └─► Lenis initializes smooth scroll & GSAP sets ScrollTrigger pin triggers
```

### 2. Contact Inquiry Flow
```
User enters form inputs -> Clicks "Send Message"
  └─► Form intercepts submit, validates inputs in client
  └─► POST request dispatched to /api/contact
  └─► Honeypot check: if hidden "website" field contains data, drop as spam (return 200)
  └─► Server validates data formats (name length, email syntax, message limit)
  └─► Sanitizes text fields with HTML escape utility
  └─► Dispatches Resend API request to send email payload to hardikvatukiya0014@gmail.com
```

### 3. CMS Live Cache Revalidation Flow
```
Content Editor saves edits in Sanity CMS Studio
  └─► Webhook triggers POST request to frontend /api/revalidate
  └─► Header token validated against process.env.SANITY_REVALIDATE_SECRET
  └─► Revalidation tag matched against permitted list (e.g., 'projects')
  └─► Next.js purges CDN node cache via revalidateTag('sanity:' + tag)
```

---

## 6. Known Limitations & Technical Debt
* **Gallery Component**: Omitted on the live home page despite having full database schemas, queries, and loaders. Needs creation of a `Gallery.tsx` section in `components/sections/` and inclusion in `ClientHome.tsx` if requested by the user.
* **Hardcoded Emails/Targets**: The destination email in `route.ts` (`hardikvatukiya0014@gmail.com`) is hardcoded. It would be cleaner to configure this in environment variables.
* **Unused CSS Classes**: Style rules for `.admin-shell`, `.admin-input`, `.row-skill` etc., exist in `globals.css` but there is no admin page route in the App Router frontend.

---

## 7. Development Assumptions
* Content updates occur exclusively inside Sanity Studio. Do not create local JSON fallbacks for data.
* Web assets and screenshots are hosted on Sanity's CDN (`cdn.sanity.io`).
* Incremental Static Regeneration (revalidate = 60) handles page building for performance and CDN caching.
