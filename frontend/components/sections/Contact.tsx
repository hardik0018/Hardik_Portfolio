"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  CalendarDays,
  Code2,
  LockKeyhole,
  Mail,
  MapPin,
  MonitorCheck,
  Palette,
  Send,
  Timer,
} from "lucide-react";
import { gsap } from "@/lib/gsap";
import { Button } from "../ui/Button";
import Logo from "../ui/Logo";

interface ContactService {
  _key: string;
  title: string;
  description: string;
  icon: string;
}

export interface ContactData {
  heading: string;
  subHeading: string;
  availabilityStatus: string;
  email: string;
  timing: string;
  location: string;
  services: ContactService[];
}

const projectTypes = [
  "Portfolio Website",
  "Product UI",
  "Full-stack App",
  "Landing Page",
  "Performance Upgrade",
];

import { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  MonitorCheck: MonitorCheck,
  Code2: Code2,
  Palette: Palette,
};

function ContactInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        name={name}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-[12px] border border-border bg-background px-5 font-sans text-[0.95rem] text-foreground outline-none transition-all placeholder:text-text-muted focus:border-accent-primary focus:shadow-[0_0_0_4px_--theme(--color-accent-primary/9%)]"
      />
    </label>
  );
}

export default function Contact({ initialData }: { initialData?: ContactData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = initialData || {
    heading: "Interested in working together?",
    subHeading: "let's build something great !",
    availabilityStatus: "Available for freelance work",
    email: "hello@hardikvatukiya.dev",
    timing: "Mon - Fri, 9AM - 6PM IST",
    location: "Remote Worldwide",
    services: []
  };

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Project inquiry from ${name || "Portfolio visitor"}`);
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Email: ${email}`,
        `Project type: ${projectType || "Not selected"}`,
        "",
        "Message:",
        message,
      ].join("\n")
    );
    return `mailto:${data.email}?subject=${subject}&body=${body}`;
  }, [email, message, name, projectType, data.email]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          ".contact-rise",
          { y: 38, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 72%",
            },
          }
        );

        gsap.to(".contact-note-line", {
          scaleX: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 68%",
          },
        });

        gsap.to(".contact-float", {
          y: -9,
          duration: 2.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSent(false);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          projectType,
          message,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      setSent(true);
      setName("");
      setEmail("");
      setProjectType("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-background px-5 pt-12 text-foreground sm:px-6 lg:px-8 lg:pt-[74px] pb-2 sm:pb-0"
      style={{ backgroundImage: "url(./hero_bg.svg)", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="relative z-10 mx-auto">
        <div className="relative mb-10 text-center">
          <span className="contact-rise absolute left-[27%] -top-3 hidden h-7 w-7 border-l-2 border-t-2 border-accent-primary lg:block" />
          <span className="contact-rise absolute -bottom-3 right-[19%] hidden h-7 w-7 border-b-2 border-r-2 border-accent-primary lg:block" />
          <h2 className="contact-rise mx-auto max-w-4xl font-hero text-[2.4rem] font-black uppercase leading-[0.86] text-foreground sm:text-[4.7rem] lg:text-[6.4rem]">
            {data.heading}
          </h2>

          <div className="contact-rise contact-float mx-auto mt-2 w-fit rotate-8 lg:absolute lg:right-[1%] lg:top-[37%] lg:mt-0">
            <p className="font-hero text-2xl leading-[0.95] text-foreground/80 sm:text-3xl">
              {data.subHeading.split('something').map((part, i) => (
                <span key={i}>
                  {part}
                  {i === 0 && <br />}
                  {i === 0 && <span>something</span>}
                </span>
              ))}
            </p>
            <span className="contact-note-line mt-2 block h-[3px] origin-left scale-x-0 rounded-full bg-accent-primary" />
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.72fr_1.42fr_0.72fr] lg:items-start">
          <aside className="contact-rise rounded-[10px] border border-border bg-background/86 px-6 py-5 shadow-[0_24px_90px_rgba(0,0,0,0.07)] backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-primary" />
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Availability</p>
            </div>

            <h3 className="max-w-[260px] font-sans text-[2rem] font-semibold leading-[1.05] tracking-tighter text-foreground">
              {data.availabilityStatus}
            </h3>

            <p className="mt-6 flex items-center gap-3 font-sans text-xs font-bold uppercase text-accent-primary">
              Open for new projects
              <span className="h-1.5 w-1.5 rounded-full bg-accent-primary/35" />
            </p>

            <div className="my-3 h-px bg-border" />

            <div className="space-y-6 font-sans text-sm text-foreground/90">
              <a href={`mailto:${data.email}`} className="flex items-center gap-5 transition-colors hover:text-accent-primary">
                <Mail className="h-5 w-5" />
                {data.email}
              </a>
              <p className="flex items-center gap-5">
                <Timer className="h-5 w-5" />
                {data.timing}
              </p>
              <p className="flex items-center gap-5">
                <MapPin className="h-5 w-5" />
                {data.location}
              </p>
            </div>

            <a href={`mailto:${data.email}?subject=${encodeURIComponent("Book a project call")}`}>
              <Button
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[12px] font-sans text-sm font-bold uppercase transition-all"
              >
                <CalendarDays className="h-4 w-4" />
                Book a Call
              </Button>
            </a>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="contact-rise rounded-[10px] border border-border bg-background/90 p-7 shadow-[0_24px_90px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-4"
          >
            <div className="mb-6 flex items-center gap-4">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-primary" />
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">Send a message</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ContactInput label="Your Name" name="name" value={name} onChange={setName} placeholder="Your Name" required />
              <ContactInput label="Email Address" name="email" type="email" value={email} onChange={setEmail} placeholder="Email Address" required />
            </div>

            <label className="mt-2 block">
              <span className="sr-only">Project Type</span>
              <select
                name="projectType"
                value={projectType}
                required
                onChange={(event) => setProjectType(event.target.value)}
                className="h-12 w-full appearance-none rounded-[12px] border border-border bg-background px-5 font-sans text-[0.95rem] text-text-muted outline-none transition-all focus:border-accent-primary focus:shadow-[0_0_0_4px_--theme(--color-accent-primary/9%)]"
              >
                <option value="">Select a type</option>
                {projectTypes.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="mt-3 block">
              <span className="sr-only">Your Message</span>
              <textarea
                name="message"
                value={message}
                required
                rows={2}
                placeholder="Tell me about your project..."
                onChange={(event) => setMessage(event.target.value)}
                className="w-full resize-none rounded-[12px] border border-border bg-background p-5 font-sans text-[0.95rem] leading-relaxed text-foreground outline-none transition-all placeholder:text-text-muted focus:border-accent-primary focus:shadow-[0_0_0_4px_--theme(--color-accent-primary/9%)]"
              />
            </label>

            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="group mt-2 inline-flex h-14 w-full items-center justify-center gap-3 rounded-[12px] font-sans text-sm font-bold uppercase disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <Send className="h-4 w-4 text-background transition-colors group-hover:text-background" />
              )}
              {loading ? "Sending..." : sent ? "Message Sent!" : "Send Message"}
            </Button>

            {error && (
              <p className="mt-3 text-center font-sans text-xs font-semibold text-red-500">
                {error}
              </p>
            )}
            {sent && (
              <p className="mt-3 text-center font-sans text-xs font-semibold text-emerald-500">
                Thank you! Your message has been sent successfully.
              </p>
            )}

            <p className="mt-5 flex items-center justify-center gap-2 font-sans text-sm text-text-muted">
              <LockKeyhole className="h-4 w-4" />
              Your information is safe with me. No spam, ever.
            </p>
          </form>

          {data?.services && <aside className="contact-rise rounded-[10px] border border-border bg-background/86 px-6 py-5 shadow-[0_24px_90px_rgba(0,0,0,0.07)] backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-primary" />
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">How I can help</p>
            </div>

            <div className="space-y-3">
              {data?.services?.map((service) => {
                const Icon = ICON_MAP[service.icon] || MonitorCheck;
                return (
                  <div key={service._key} className="grid grid-cols-[64px_1fr] gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-sans text-base font-bold tracking-[-0.03em] text-foreground">{service.title}</h3>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-text-muted">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/projects">
              <Button
                className="mt-4 inline-flex h-12 w-full items-center justify-center gap-3 rounded-[12px] font-sans text-sm font-bold uppercase transition-all"
              >
                <ArrowRight className="h-4 w-4" />
                View My Work
              </Button>
            </Link>
          </aside>}
        </div>

        <div className="contact-rise flex flex-col items-center gap-4 font-sans text-sm font-medium uppercase text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p>© 2026 Hardik Vatukiya</p>
        </div>
      </div>
    </section>
  );
}
