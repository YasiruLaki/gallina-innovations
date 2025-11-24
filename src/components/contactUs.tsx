"use client";
import React, { forwardRef } from "react";
import { motion, Variants, easeOut } from "framer-motion";
import Image from "next/image";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: easeOut },
  },
};

const ContactDetail: React.FC<{ label: string; email: string; phone: string }> = ({
  label,
  email,
  phone,
}) => (
  <motion.div variants={itemVariants} className="space-y-2">
    <p className="text-zinc-400">{label}</p>
    <a
      href={`mailto:${email}`}
      className="block text-white text-lg hover:underline transition-colors"
    >
      {email}
    </a>
    <a
      href={`tel:${phone.replace(/\s/g, "")}`}
      className="block text-white text-lg hover:underline transition-colors"
    >
      {phone}
    </a>
  </motion.div>
);

const ContactPage = forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        {...props}
        className="bg-[var(--background)] text-white min-h-screen flex items-center justify-center md:px-[80px] px-[30px] font-sans"
      >
        <motion.main
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.header variants={itemVariants} className="mb-16">
            <h1 className="text-6xl md:text-8xl font-medium tracking-tighter">
              Contact Us
            </h1>
            <p className="text-zinc-400 mt-2 text-lg">
              Get in touch with us for any inquiries & quotations
            </p>
          </motion.header>
          {/* Content Grid */}
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left: Contact Info */}
            <motion.section variants={containerVariants} className="space-y-12">
              <div className="grid gap-12 sm:grid-cols-2 border-b border-zinc-800 pb-12">
                <ContactDetail
                  label="General Inquiries"
                  email="info@gallinainnovations.com"
                  phone="+94 71 654 7654"
                />
                <ContactDetail
                  label="CEO"
                  email="thishyankya@gallinainnovations.com"
                  phone="+94 71 654 7654"
                />
              </div>
              <motion.div variants={itemVariants}>
                <p className="text-zinc-400">Address</p>
                <p className="text-white text-lg mt-2">
                  No. 123, Matara Road, Galle, Sri Lanka.
                </p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="flex gap-4 pt-8"
                aria-hidden={false}
              >
                {([
                  {
                    href: "https://twitter.com/yourhandle",
                    label: "Twitter",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 0 0 1.88-2.37 8.6 8.6 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.3 3.9A12.14 12.14 0 0 1 3.15 4.6a4.28 4.28 0 0 0 1.32 5.72 4.2 4.2 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.19 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97A8.6 8.6 0 0 1 2 19.54 12.12 12.12 0 0 0 8.29 21c7.55 0 11.68-6.26 11.68-11.68l-.01-.53A8.36 8.36 0 0 0 22.46 6z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.linkedin.com/company/yourcompany",
                    label: "LinkedIn",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M4.98 3.5a2.5 2.5 0 1 1 .001 5.001A2.5 2.5 0 0 1 4.98 3.5zM3 9h4v12H3zM9 9h3.8v1.6h.1c.5-.9 1.7-1.8 3.5-1.8 3.7 0 4.4 2.4 4.4 5.5V21H17v-5.4c0-1.3 0-3-1.9-3-1.9 0-2.2 1.5-2.2 2.9V21H9z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.facebook.com/yourpage",
                    label: "Facebook",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2.3v-2.9h2.3V9.4c0-2.3 1.4-3.6 3.4-3.6.98 0 2 .18 2 .18v2.2h-1.1c-1.1 0-1.4.66-1.4 1.34v1.6h2.4l-.38 2.9h-2.02v7A10 10 0 0 0 22 12z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.instagram.com/yourhandle",
                    label: "Instagram",
                    icon: (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-5 h-5"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                      </svg>
                    ),
                  },
                ] as { href: string; label: string; icon: React.ReactNode }[]).map(
                  (s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-12 h-12 bg-stone-300/50 rounded-full flex items-center justify-center hover:bg-stone-300 transition-colors transform hover:scale-105"
                    >
                      <span className="text-zinc-800">{s.icon}</span>
                    </a>
                  )
                )}
              </motion.div>
            </motion.section>
            {/* Right: Map Placeholder */}
            <motion.section
              variants={itemVariants}
              className="bg-zinc-300 w-full h-64 md:h-full min-h-[300px] overflow-hidden"
            >
              <Image
                src="https://pix8.agoda.net/hotelImages/555460/-1/9da1bdfc8ca9eda9e52a3b380be9d246.jpg?ce=0"
                alt="Contact cover image"
                className="w-full h-full object-cover"
                loading="lazy"
                style={{ filter: "grayscale(100%) contrast(100%)" }}
                width={600}
                height={400}
              />
            </motion.section>
          </div>
        </motion.main>
      </div>
    );
  }
);

ContactPage.displayName = "ContactPage";
export default ContactPage;