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
import Image from "next/image";

export default function Home() {
  type FirestoreProject = {
    title: string;
    location: string;
    description: string;
    imageUrls?: string[];
  };
  const [featured, setFeatured] = useState<FirestoreProject | null>(null);

  useEffect(() => {
    const fetchByName = async () => {
      try {
        const projectName = "Mosvold";

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
    <div className="w-full min-h-screen bg-[var(--background)] text-white font-sans px-2 sm:px-4 md:px-8 lg:px-0">
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
      {featured && (
        <section className="bg-[#0A0A0A] text-white px-8 md:px-16 lg:px-16 flex flex-col md:flex-row items-center gap-12 shadow-lg mt-12">
          <div className="relative w-full md:w-1/2 h-64 md:h-96  overflow-hidden shadow-lg">
            <Image
              src={featured.imageUrls?.[0] || "/placeholder.jpg"}
              alt={featured.title}
              className="object-cover w-full h-full"
              width={800}
              height={600}
              priority
            />
          </div>
          <div className="flex-1 flex flex-col justify-center items-start">
            <h2 className="text-4xl md:text-6xl font-medium mb-4 text-[var(--brown1)]">
              {featured.title + ","}
              <br></br>
              {featured.location}
            </h2>
            <p className="text-lg md:text-xl text-zinc-300 mb-6">
              {featured.description}
            </p>
            <button
              className="self-start px-6 py-3 text-left underline text-[var(--grey1)] rounded font-light transition-colors mb-10 lg:mb-0"
              onClick={() =>
              (window.location.href = `/projectShowcase?name=${encodeURIComponent(
                featured.title
              )}`)
              }
            >
              View More →
            </button>
          </div>
        </section>
      )}
      <ContactPage />
      <CopyrightFooter />
    </div>
  );
}
