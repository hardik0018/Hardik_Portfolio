"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { MovingBorder } from "@/components/ui/moving-border";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Message sent successfully!");

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block rounded-lg dark:bg-white/80 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            Contact
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Get In Touch
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind or want to discuss potential opportunities?
            Feel free to reach out!
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <div className="space-y-6">
              <div className="p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 transition-all duration-300 dark:border-primary/20 hover:border-primary/70 dark:hover:border-primary/80">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-muted-foreground">
                      hardikvatukiya0014@gmail.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 transition-all duration-300 dark:border-primary/20 hover:border-primary/70 dark:hover:border-primary/80">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-muted-foreground">+91 9106278940</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 transition-all duration-300 dark:border-primary/20 hover:border-primary/70 dark:hover:border-primary/80">
                <div className="flex items-start space-x-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Location</h3>
                    <p className="text-muted-foreground">Rajkot, Gujarat</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <MovingBorder
              colors={["#00FF00"]}
              className="p-1"
              containerClassName="rounded-xl"
            >
              <div className="p-6 rounded-xl bg-background/80 backdrop-blur-sm">
                <h3 className="text-xl font-bold mb-4">Send a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-muted/50 border border-primary/20 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-muted/50 border border-primary/20 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg bg-muted/50 border border-primary/20 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <textarea
                      name="message"
                      placeholder="Your message"
                      rows={5}
                      maxLength={500}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full resize-none p-3 rounded-lg bg-muted/50 border border-primary/20 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary p-3 text-white font-medium transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </div>
            </MovingBorder>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
