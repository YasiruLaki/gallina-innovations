"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// Removed unused import of Project type

// --- TYPE DEFINITIONS ---
// ...existing code...

type Section = "Residential" | "Hospitality" | "Commercial";

// --- FIREBASE DATA ---
type FirestoreProject = {
  id?: string;
  title: string;
  location: string;
  tags: string[];
  category: Section;
  imageUrls: string[];
};

// --- REUSABLE COMPONENTS ---

// 1. Project Card Component
const ProjectCard: React.FC<{
  project: FirestoreProject;
  onClick: () => void;
}> = ({ project, onClick }) => (
  <div
    className="flex-shrink-0 w-full  sm:w-[45%] lg:w-[30%] snap-start mt-4 cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-3xl font-extralight text-zinc-400 underline">
      {project.title}
    </h3>
    <p className="text-2xl font-extralight text-zinc-400 mb-3 underline">
      {project.location}
    </p>
    <motion.div
      className="bg-zinc-800/50 aspect-square w-full mb-4 bg-cover bg-center relative overflow-hidden group"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {project.imageUrls?.[0] && (
        <motion.div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${project.imageUrls[0]})` }}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
      <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/20 pointer-events-none" />
    </motion.div>
    <div className="flex gap-2 mt-2">
      {project.tags.map((tag) => (
        <span
          key={tag}
          className="px-3 py-1 text-xs border border-zinc-600 rounded-full text-zinc-400"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

// 2. Horizontal Scroller Component
const HorizontalProjectScroller: React.FC<{
  projects: FirestoreProject[];
  onProjectClick: (project: FirestoreProject) => void;
  scrollerId?: string;
}> = ({ projects, onProjectClick, scrollerId }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.9;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!projects.length) {
    return (
      <div className="py-8 text-zinc-400">
        No projects in this category yet.
      </div>
    );
  }

  return (
    <div className="relative group">

      {/* Projects Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4"
        data-scroller={scrollerId}
      >
        {projects.map((p) => (
          <ProjectCard
            key={p.id || p.title}
            project={p}
            onClick={() => onProjectClick(p)}
          />
        ))}
      </div>
    </div>
  );
};

// 3. Accordion Section Component
const sectionSubNames: Record<Section, string> = {
  Residential: "Landscape",
  Hospitality: "Hotels & Villas",
  Commercial: "Industrial",
};

const AccordionSection: React.FC<{
  title: Section;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, children, isOpen, onToggle }) => (
  <div className="border-b border-zinc-800 last:border-b-0">
    <button
      onClick={onToggle}
      className={`flex items-center justify-between w-full py-8 px-0 transition-colors duration-400 group
        ${isOpen ? "bg-[var(--brown1)]" : "hover:bg-[var(--brown1)]"}`}
    >
      <div className="flex sm:flex-row flex-col sm:items-end items-start w-full sm:gap-4 px-8">
        <span
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-light  text-zinc-200 group-hover:text-black ${
            isOpen ? "!text-black" : ""
          }`}
        >
          {title}
        </span>
        <span
          className={`text-xl sm:text-2xl md:text-3xl lg:text-3xl font-light text-zinc-400 group-hover:text-black ${
            isOpen ? "!text-black" : ""
          } mt-2`}
        >
          ({sectionSubNames[title]})
        </span>
      </div>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChevronDown
          size={32}
          className={`transition-colors ${
            isOpen ? "text-black" : "text-zinc-500"
          } group-hover:text-black`}
        />
      </motion.div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default function ProjectsPage() {
  const [openSection, setOpenSection] = useState<Section | null>("Hospitality");
  const [projectsByCategory, setProjectsByCategory] = useState<
    Record<Section, FirestoreProject[]>
  >({
    Residential: [],
    Hospitality: [],
    Commercial: [],
  });
  const router = useRouter();

  // Refs for each category section
  const sectionRefs = {
    Residential: useRef<HTMLDivElement>(null),
    Hospitality: useRef<HTMLDivElement>(null),
    Commercial: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const projects: FirestoreProject[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({
          id: doc.id,
          title: data.title,
          location: data.location,
          tags: Array.isArray(data.tags) ? data.tags : [],
          category: data.category,
          imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
        });
      });
      // Group by category
      const grouped: Record<Section, FirestoreProject[]> = {
        Residential: [],
        Hospitality: [],
        Commercial: [],
      };
      projects.forEach((p) => {
        if (grouped[p.category]) grouped[p.category].push(p);
      });
      setProjectsByCategory(grouped);
    };
    fetchProjects();

    // Expose scrollToCategory globally for projectCategories.tsx
    (window as Window & { scrollToProjectCategory?: (section: Section) => void }).scrollToProjectCategory = (section: Section) => {
      setOpenSection(section);
      setTimeout(() => {
        const ref = sectionRefs[section];
        if (ref?.current) {
          ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    };
    return () => {
      delete (window as Window & { scrollToProjectCategory?: (section: Section) => void }).scrollToProjectCategory;
    };
  }, []);

  const handleToggle = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleProjectClick = (project: FirestoreProject) => {
    router.push(`/projectShowcase?name=${encodeURIComponent(project.title)}`);
  };

  return (
    <motion.div
      className="bg-[#0A0A0A] text-white min-h-screen font-sans px-4 sm:px-8 lg:px-16 md:pt-10 lg:pt-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <header className="flex flex-col lg:flex-row lg:items-center justify-between pb-10">
        <h1 className="text-7xl md:text-8xl font-medium mt-10 lg:mt-0">
          Projects
        </h1>
        <a
          href="#"
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-light mt-6 lg:mt-0"
        >
          Discover unique projects from all over the world{" "}
          <ArrowRight size={20} />
        </a>
      </header>

      <div
        className="flex-grow border-b border-solid border-gray-500 opacity-90"
        aria-hidden="true"
      ></div>

      <main>
        {(Object.keys(projectsByCategory) as Section[]).map((sectionName) => (
          <div ref={sectionRefs[sectionName]} key={sectionName}>
            <AccordionSection
              title={sectionName}
              isOpen={openSection === sectionName}
              onToggle={() => handleToggle(sectionName)}
            >
              <HorizontalProjectScroller
                projects={projectsByCategory[sectionName]}
                onProjectClick={handleProjectClick}
                scrollerId={sectionName}
              />

              {projectsByCategory[sectionName].length > 0 && (
                <>
                  {/* Scroll to previous arrow */}
                  <div className="absolute -translate-y-80 md:-translate-y-90 md:-translate-x-8 -translate-x-2 z-100">
                    <div
                      className="flex items-center justify-center sm:w-20 sm:h-20 w-15 h-15 border-1 border-[var(--grey2)] rounded-full cursor-pointer bg-black/60 hover:bg-black/70 hover:cursor-pointer hover:border-gray-500 transition-all duration-300"
                      onClick={() => {
                        // Find the scroller for this section and scroll left
                        const scroller = document.querySelector(
                          `[data-scroller="${sectionName}"]`
                        ) as HTMLDivElement | null;
                        if (scroller) {
                          scroller.scrollBy({
                            left: -scroller.clientWidth * 0.9,
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={0.75}
                        stroke="currentColor"
                        className="w-12 h-12 text-[var(--grey1)]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Scroll to next arrow */}
                  <div className="absolute right-0 -translate-y-80 md:-translate-y-90 md:-translate-x-8 -translate-x-2 z-100">
                    <div
                      className="flex items-center justify-center sm:w-20 sm:h-20 w-15 h-15 border-1 border-[var(--grey2)] rounded-full cursor-pointer bg-black/60 hover:bg-black/70 hover:cursor-pointer hover:border-gray-500 transition-all duration-300"
                      onClick={() => {
                        // Find the scroller for this section and scroll right
                        const scroller = document.querySelector(
                          `[data-scroller="${sectionName}"]`
                        ) as HTMLDivElement | null;
                        if (scroller) {
                          scroller.scrollBy({
                            left: scroller.clientWidth * 0.9,
                            behavior: "smooth",
                          });
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={0.75}
                        stroke="currentColor"
                        className="w-12 h-12 text-[var(--grey1)]"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </>
              )}
            </AccordionSection>
          </div>
        ))}
      </main>
    </motion.div>
  );
}
