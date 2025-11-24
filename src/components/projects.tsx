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

type Section = "Residential" | "Industrial" | "Landscape";

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
const ProjectCard: React.FC<{ project: FirestoreProject; onClick: () => void }> = ({ project, onClick }) => (
  <div className="flex-shrink-0 w-full sm:w-[45%] md:w-[30%] snap-start mt-4 cursor-pointer" onClick={onClick}>
    <h3 className="text-3xl font-extralight text-zinc-400 underline">{project.title}</h3>
    <p className="text-2xl font-extralight text-zinc-400 mb-3 underline">{project.location}</p>
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
const HorizontalProjectScroller: React.FC<{ projects: FirestoreProject[]; onProjectClick: (project: FirestoreProject) => void }> = ({
  projects,
  onProjectClick,
}) => {
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
      {/* Left Scroll Button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full p-3 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Projects Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4"
      >
        {projects.map((p) => (
          <ProjectCard key={p.id || p.title} project={p} onClick={() => onProjectClick(p)} />
        ))}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-zinc-800/80 hover:bg-zinc-700 text-white rounded-full p-3 transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-0"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

// 3. Accordion Section Component
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
      <div className="flex items-center justify-between w-full px-8">
        {/* add padding here */}
        <span className={`text-6xl font-light text-zinc-200 group-hover:text-black ${isOpen ? "!text-black" : ""}`}>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown
            size={32}
            className={`transition-colors ${isOpen ? "text-black" : "text-zinc-500"} group-hover:text-black`}
          />
        </motion.div>
      </div>
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
  const [openSection, setOpenSection] = useState<Section | null>("Residential");
  const [projectsByCategory, setProjectsByCategory] = useState<Record<Section, FirestoreProject[]>>({
    Residential: [],
    Industrial: [],
    Landscape: [],
  });
  const router = useRouter();

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
        Industrial: [],
        Landscape: [],
      };
      projects.forEach((p) => {
        if (grouped[p.category]) grouped[p.category].push(p);
      });
      setProjectsByCategory(grouped);
    };
    fetchProjects();
  }, []);

  const handleToggle = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleProjectClick = (project: FirestoreProject) => {
    router.push(`/projectShowcase?name=${encodeURIComponent(project.title)}`);
  };

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen font-sans p-4 sm:p-8 md:p-16">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between pb-10">
        <h1 className="text-7xl md:text-8xl font-medium mt-10 lg:mt-0">Projects</h1>
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
          <AccordionSection
            key={sectionName}
            title={sectionName}
            isOpen={openSection === sectionName}
            onToggle={() => handleToggle(sectionName)}
          >
            <HorizontalProjectScroller
              projects={projectsByCategory[sectionName]}
              onProjectClick={handleProjectClick}
            />
          </AccordionSection>
        ))}
      </main>
    </div>
  );
}
