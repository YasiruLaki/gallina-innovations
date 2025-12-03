import type { Metadata } from "next";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import SmoothScrollClient from "@/components/SmoothScrollClient";

export const metadata: Metadata = {
  title: "Gallina Innovations | Sustainable Architecture & Design in Sri Lanka",
  description: "Gallina Innovations is a leading architecture and design studio in Sri Lanka, specializing in sustainable, purposeful spaces for residential, hospitality, and commercial projects.",
  keywords: [
    "architecture", "design", "Sri Lanka", "sustainable", "residential", "hospitality", "commercial", "Gallina Innovations", "minimalism", "eco-friendly", "modern architecture", "Prasanna Gunawardana"
  ],
  openGraph: {
    title: "Gallina Innovations | Sustainable Architecture & Design in Sri Lanka",
    description: "Discover Gallina Innovations, a studio shaping iconic spaces with empathy and longevity. Explore our residential, hospitality, and commercial projects.",
    url: "https://gallinainnovations.com/",
    siteName: "Gallina Innovations",
    images: [
      {
        url: "https://cdn.gallinainnovations.com/uploads/og-main.jpg",
        width: 1200,
        height: 630,
        alt: "Gallina Innovations - Sustainable Architecture in Sri Lanka"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallina Innovations | Sustainable Architecture & Design in Sri Lanka",
    description: "Discover Gallina Innovations, a studio shaping iconic spaces with empathy and longevity. Explore our residential, hospitality, and commercial projects.",
    images: ["https://cdn.gallinainnovations.com/uploads/og-main.jpg"],
    site: "@GallinaInnovations"
  },
  alternates: {
    canonical: "https://gallinainnovations.com/"
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollClient>
          <PageTransition>{children}</PageTransition>
        </SmoothScrollClient>
      </body>
    </html>
  );
}
