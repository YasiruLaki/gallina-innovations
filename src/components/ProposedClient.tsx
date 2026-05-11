"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronDown, X } from "lucide-react";
import ContactPage from "@/components/contactUs";
import Loading from "@/components/Loading";
import DustOverlay from "@/components/dustOverlay";
import CustomCursor from "@/components/CustomCursor";
import MobileMenu from "@/components/MobileMenu";

type Section = "Residential" | "Hospitality" | "Commercial";
export type FirestoreProject = {
  id?: string;
  title: string;
  location: string;
  tags: string[];
  category: Section;
  imageUrls: string[];
};

const ImageModal: React.FC<{
  imageUrl: string;
  onClose: () => void;
}> = ({ imageUrl, onClose }) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.img
        src={imageUrl}
        alt="Full Size"
        className="max-w-3xl max-h-[80vh] "
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-5 right-5 border border-white/40 bg-black/30 text-white rounded-full p-3 text-xl hover:bg-opacity-80 flex items-center justify-center"
        aria-label="Close modal"
      >
        <X />
      </button>
    </motion.div>
  </AnimatePresence>
);

const UnorderedGallery: React.FC<{
  images: string[];
  onImageClick: (url: string) => void;
}> = ({ images, onImageClick }) => (
  <motion.div
    className="w-full columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } },
    }}
  >
    {images.map((url, idx) => (
      <motion.img
        key={idx}
        src={url}
        alt="Project"
        className="w-full mb-4 cursor-pointer hover:scale-101 transition-transform shadow-lg"
        onClick={() => onImageClick(url)}
        loading="lazy"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
        whileHover={{ scale: 1.01, zIndex: 2 }}
      />
    ))}
  </motion.div>
);
// Dummy data (moved outside the component so it's stable for hooks)
const dummyProjects: FirestoreProject[] = [];

const ProposedClient: React.FC<{ category?: string | null }> = () => {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const load = async () => {
      try {
        const snapshot = await getDocs(collection(db, "proposed"));
        const fetched: FirestoreProject[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          fetched.push({
            id: doc.id,
            title: data.title,
            location: data.location,
            tags: Array.isArray(data.tags) ? data.tags : [],
            category: data.category,
            imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
          });
        });
        if (!mounted) return;
        setProjects(fetched);
        if (fetched[0]) setOpenProject((prev) => prev ?? (fetched[0].id || fetched[0].title));
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <DustOverlay />
      <CustomCursor />
      <MobileMenu />
      {loading && <Loading />}
      <div className="w-full min-h-screen bg-[var(--background)] text-white font-sans">
        {/* ── Hero ── */}
        <section className="relative w-full h-[45vh] min-h-[300px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{
              backgroundImage: `url(https://cdn.gallinainnovations.com/uploads/mr.%20mendis%20%20%2812%29.JPEG)`,
              opacity: 0.18,
              filter: "grayscale(55%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[var(--background)]/20 via-transparent to-[var(--background)]"
            aria-hidden="true"
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-white/10" aria-hidden="true" />
          <div className="relative z-10 h-full flex flex-col justify-end px-6 sm:px-12 md:px-16 pb-14">
            <nav className="flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase text-white/35 mb-7">
              <Link href="/" className="hover:text-white/60 transition-colors duration-200">Home</Link>
              <span>/</span>
              <Link href="/projects/commercial" className="hover:text-white/60 transition-colors duration-200">Commercial</Link>
              <span>/</span>
              <span className="text-[var(--brown1)]">Proposed</span>
            </nav>
            <motion.h1
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white tracking-tight leading-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              Proposed
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-white/40 font-light mt-3 tracking-wide"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            >
              2026 — Coming Soon
            </motion.p>
          </div>
        </section>

        {/* ── Back link ── */}
        <div className="px-6 sm:px-12 md:px-16 pt-10 pb-8 border-b border-white/[0.06]">
          <Link
            href="/projects/commercial"
            className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/35 hover:text-[var(--brown1)] transition-colors duration-300 group"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Commercial
          </Link>
        </div>

        {/* ── Accordion ── */}
        <main className="px-6 sm:px-12 md:px-16 pt-14 pb-28">
          {loading ? (
            <div className="flex items-center justify-center py-36"><Loading /></div>
          ) : projects.length === 0 ? (
            <p className="text-white/30 text-lg py-20 tracking-wide">No proposed projects yet — check back soon.</p>
          ) : (
            <div className="space-y-0">
              {projects.map((project) => {
                const isOpen = openProject === (project.id || project.title);
                return (
                  <div key={project.id || project.title} className="border-b border-white/[0.07]">
                    <button
                      className="w-full text-left px-0 py-7 flex items-center justify-between focus:outline-none group"
                      onClick={() => setOpenProject(isOpen ? null : project.id || project.title)}
                      aria-expanded={isOpen}
                    >
                      <div>
                        <span className="block text-[10px] tracking-[0.28em] uppercase text-[var(--brown1)]/50 mb-2">{project.category}</span>
                        <span className={`text-3xl sm:text-4xl font-light tracking-tight transition-colors duration-300 ${isOpen ? "text-white" : "text-white/55 group-hover:text-white"}`}>
                          {project.title}
                        </span>
                        <span className="block text-sm text-white/30 mt-1.5 tracking-wide">{project.location}</span>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={24} strokeWidth={1} className={`transition-colors duration-300 ${isOpen ? "text-[var(--brown1)]" : "text-white/25 group-hover:text-white/60"}`} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ maxHeight: 0, opacity: 0 }}
                          animate={{ maxHeight: 2000, opacity: 1 }}
                          exit={{ maxHeight: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: "easeInOut" }}
                          className="overflow-hidden pb-10"
                        >
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                              {project.tags.map((tag) => (
                                <span key={tag} className="text-[10px] tracking-wide border border-zinc-700/70 text-zinc-500 px-3 py-0.5 rounded-full">{tag}</span>
                              ))}
                            </div>
                          )}
                          <UnorderedGallery images={project.imageUrls} onImageClick={setModalImage} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {modalImage && <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />}
        <ContactPage />
      </div>
    </>
  );
};

export default ProposedClient;
