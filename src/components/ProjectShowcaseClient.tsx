"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import ContactPage from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";
import MobileMenu from "@/components/MobileMenu";
import Loading from "@/components/Loading";
import { X } from "lucide-react";

const pageContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};
const headingVariant = {
  hidden: { opacity: 0, y: 26, skewY: 2 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.72 } }
};
const paraVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const gridItem = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } }
};

type FirestoreProject = {
  title: string;
  location: string;
  description: string;
  imageUrls?: string[];
  tags?: string[];
  category?: string;
  approach?: string;
  catchline?: string;
};

const ProjectShowcaseClient: React.FC = () => {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name");
  const [project, setProject] = useState<FirestoreProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!projectName) return;

    const fetchProject = async () => {
      setLoading(true);
      const q = query(
        collection(db, "projects"),
        where("title", "==", projectName)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        setProject(snapshot.docs[0].data() as FirestoreProject);
      } else {
        setProject(null);
      }
      setLoading(false);
    };

    fetchProject();
  }, [projectName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Project not found.
      </div>
    );
  }

  return (
    <div>
      <MobileMenu />

      <motion.main
        initial="hidden"
        variants={pageContainer}
        className="min-h-screen text-white mx-auto select-none mt-30"
      >
        {/* Title */}
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={headingVariant}
          className="lg:text-7xl md:text-6xl sm:text-5xl text-5xl !font-light mb-6 px-4 sm:px-8 md:px-16  md:decoration-4 decoration-3 offset-4"
        >
          {project.title}, {project.location}
        </motion.h1>

        {/* Description */}
        <motion.section
          className="flex flex-col md:items-start md:gap-20 pb-12 px-4 sm:px-8 md:px-16 mt-10"
          variants={pageContainer}
        >
          <div className="flex-1">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={paraVariant}
              className="text-[var(--grey1)] text-xl mb-6 !font-extralight"
            >
              {project.description}
            </motion.p>

            <div className="flex-grow border-b border-solid border-gray-500 mb-10 md:mb-0" />
          </div>

          {/* True Masonry (Unorganized) Gallery */}
          {project.imageUrls && project.imageUrls.length > 0 && (
            <div className="w-full columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
              {project.imageUrls.map((url, i) => (
                <motion.div
                  key={url}
                  variants={gridItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  className="mb-4 break-inside-avoid cursor-zoom-in relative group"
                  onClick={() => {
                    setCurrentIndex(i);
                    setModalOpen(true);
                  }}
                >
                  <img
                    src={url}
                    alt={`Project image ${i + 1}`}
                    className="w-auto max-w-full shadow-lg transition-transform duration-300 group-hover:scale-101"
                    style={{ display: 'block', width: '100%' }}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Modal */}
          {modalOpen && (
            <div
              ref={modalRef}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
              onClick={(e) => {
                if (e.target === e.currentTarget) setModalOpen(false);
              }}
            >
              <div className="relative">
                <img
                  src={project.imageUrls![currentIndex]}
                  alt="Project Large"
                  className="max-w-full max-h-[90vh] shadow-2xl border-1 border-white/40"
                />

                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-5 right-5 border border-white/40 bg-black/30 text-white rounded-full p-3 text-xl hover:bg-opacity-80 flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X />
                </button>
              </div>
            </div>
          )}
        </motion.section>

        {/* Approach */}
        {project.approach && (
          <>
          <motion.h2
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={headingVariant}
              className="lg:text-5xl md:text-4xl sm:text-3xl text-3xl !font-light mb-6 px-4 sm:px-8 md:px-16 mt-5"
            >
              Our Approach
            </motion.h2>
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={paraVariant}
              className="text-[var(--grey1)] text-xl md:text-3xl sm:text-2xl mb-6 !font-light px-4 sm:px-8 md:px-16"
            >
              {project.approach}
            </motion.p>

            <div className="flex-grow border-b border-solid border-gray-500 mx-4 sm:mx-8 md:mx-16" />
          </>
        )}

        {/* Catchline */}
        {project.catchline && (
          <motion.section
            className="py-12 px-4 sm:px-8 md:px-16"
            variants={pageContainer}
          >
            <motion.h3
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={headingVariant}
              className="text-5xl font-semibold text-[var(--brown1)] mb-8"
            >
              {project.catchline}
            </motion.h3>
          </motion.section>
        )}

        <div className="flex-grow border-b border-solid border-gray-500 mx-4 sm:mx-8 md:mx-16" />

        <ContactPage />
        <CopyrightFooter />
      </motion.main>
    </div>
  );
};

export default ProjectShowcaseClient;