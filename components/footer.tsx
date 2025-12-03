import { Github, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t py-10 px-5 bg-background">
      <div className="flex flex-col md:flex-row justify-between md:items-center ">
        <div className="mb-6 md:mb-0">
          <div className="font-bold text-xl">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-primary">Hardik Vatukiya</span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Building exceptional digital experiences.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <div className="flex space-x-4 mb-4">
            <Link
              href="https://github.com/hardik0018"
              target="_blank"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link
              href="https://linkedin.com/in/hardik-vatukiya"
              target="_blank"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link
              href="https://instagram.com/hardik_vatukiya_07"
              target="_blank"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="mailto:hardikvatukiya0014@gmail.com"
              className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Hardik Vatukiya. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
