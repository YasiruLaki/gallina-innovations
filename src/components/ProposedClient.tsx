"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import ContactPage from "@/components/contactUs";
import Loading from "@/components/Loading";

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
const dummyProjects: FirestoreProject[] = [
  {
    id: "1",
    title: "Dummy Residential Project",
    location: "Colombo, Sri Lanka",
    tags: ["Landscape", "Modern"],
    category: "Hospitality",
    imageUrls: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
    ],
  },
  {
    id: "2",
    title: "Dummy Hospitality Project",
    location: "Galle, Sri Lanka",
    tags: ["Hotel", "Luxury"],
    category: "Hospitality",
    imageUrls: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
    ],
  },
  {
    id: "3",
    title: "Dummy Commercial Project",
    location: "Kandy, Sri Lanka",
    tags: ["Industrial", "Office"],
    category: "Hospitality",
    imageUrls: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    ],
  },
];

const ProposedClient: React.FC<{ category?: string | null }> = ({ category }) => {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const load = async () => {
      if (!category) {
        setProjects(dummyProjects);
        setOpenProject((prev) => prev ?? (dummyProjects[0]?.id || dummyProjects[0]?.title));
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, "proposed"), where("category", "==", category));
        const snapshot = await getDocs(q);
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
        if (fetched.length === 0) {
          const filtered = dummyProjects.filter((p) => p.category === category);
          setProjects(filtered);
          if (filtered[0]) setOpenProject((prev) => prev ?? (filtered[0].id || filtered[0].title));
        } else {
          setProjects(fetched);
          if (fetched[0]) setOpenProject((prev) => prev ?? (fetched[0].id || fetched[0].title));
        }
      } catch (err) {
        console.error(err);
        if (mounted) setProjects(dummyProjects.filter((p) => p.category === category));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [category]);

  return (
    <>
      {loading && <Loading />}
      <motion.div
        className="min-h-screen text-white px-4 sm:px-8 lg:px-16 pt-30 font-sans"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <header className="mb-10">
          <h1 className="text-6xl md:text-7xl font-medium mb-2">Proposed/Ongoing Projects</h1>
          {category && (
            <h2 className="text-4xl text-zinc-400 font-light mb-4">
              <span className="text-[var(--brown1)]">{category}</span>
            </h2>
          )}

          <div className="flex-grow border-b border-solid border-zinc/30 mb-6" aria-hidden="true"></div>
        </header>

        <main>
          {projects.length === 0 ? (
            <div className="text-zinc-500 text-xl py-20">No proposed projects found for this category.</div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => {
                const isOpen = openProject === (project.id || project.title);
                return (
                  <div key={project.id || project.title} className="border-b border-zinc-700">
                    <button
                      className={`w-full text-left px-4 py-4 flex items-center justify-between text-2xl font-light focus:outline-none transition-colors duration-300 ${
                        isOpen
                          ? "bg-[var(--brown1)] text-black"
                          : "bg-transparent text-white hover:bg-[var(--brown1)]/80 hover:text-black"
                      }`}
                      onClick={() => setOpenProject(isOpen ? null : project.id || project.title)}
                      aria-expanded={isOpen}
                    >
                      <span>{project.title}</span>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                        <ChevronDown size={32} className={`transition-colors ${isOpen ? "text-black" : "text-zinc-500"} group-hover:text-black`} />
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ maxHeight: 0, opacity: 0 }}
                          animate={{ maxHeight: 1000, opacity: 1 }}
                          exit={{ maxHeight: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden px-4 pb-6 mt-6"
                        >
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
      </motion.div>
      <ContactPage />
    </>
  );
};

export default ProposedClient;
