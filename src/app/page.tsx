"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import DustOverlay from "@/components/dustOverlay";
import Loading from "@/components/Loading";
import CustomCursor from "@/components/CustomCursor";
import MobileMenu from "@/components/MobileMenu";
import Landing from "@/components/Landing";
import AboutIntro from "@/components/aboutIntro";
import ProjectCategories from "@/components/projectCategories";
import ProjectsPage from "@/components/projects";
import ContactPage from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";
import FeaturedProjectSection, { FirestoreProject } from "@/components/FeaturedProjectSection";

export default function Home() {
    // SEO meta tags for homepage
    if (typeof window === 'undefined') {
      // Only for SSR/SSG
      // Next.js will use metadata from layout.tsx, but you can add page-specific tags here if needed
    }
  const [featured, setFeatured] = useState<FirestoreProject | null>(null);

  useEffect(() => {
    const fetchByName = async () => {
      try {
        const projectName = "Mosvold Villa";

        const q = query(
          collection(db, "projects"),
          where("title", "==", projectName)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          setFeatured(snapshot.docs[0].data() as FirestoreProject);
          return;
        }

        // fallback: if no doc matched the name, pick the first project
        const all = await getDocs(collection(db, "projects"));
        if (!all.empty) setFeatured(all.docs[0].data() as FirestoreProject);
      } catch (error) {
        console.error("Error fetching project by name:", error);
      }
    };

    fetchByName();
  }, []);

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-white font-sans lg:px-0">
      {/* <SmoothScroll /> */}
      <DustOverlay />
      <Loading />
      <CustomCursor />
      {/* <NavBar /> */}
      <MobileMenu />
      <Landing />
      <AboutIntro />
      <ProjectCategories />
      <ProjectsPage />
      {/* Featured Project Section */}
      {featured && <FeaturedProjectSection featured={featured} />}
      <ContactPage />
      <CopyrightFooter />
    </div>
  );
}
