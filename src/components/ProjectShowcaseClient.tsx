"use client";

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
  visible: { transition: { staggerChildren: 0.08 } },
};
const headingVariant = {
  hidden: { opacity: 0, y: 26, skewY: 2 },
  visible: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.72 } },
};
const paraVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const gridItem = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6 } },
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
  // clientFeedback?: string;
};

const ProjectShowcaseClient: React.FC = () => {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name");
  const [project, setProject] = useState<FirestoreProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
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
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={headingVariant}
          className="lg:text-7xl md:text-6xl sm:text-5xl text-5xl !font-light mb-6 px-4 sm:px-8 md:px-16 underline md:decoration-4 decoration-3 offset-4"
        >
          {project.title}, {project.location}
        </motion.h1>
        {/* Header Section */}
        <motion.section
          className="flex flex-col md:flex-row md:items-start md:gap-20 pb-12 px-4 sm:px-8 md:px-16 mt-10"
          variants={pageContainer}
        >
          <div className="flex-1">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={paraVariant}
              className="text-[var(--grey1)] text-xl  mb-6 !font-extralight"
            >
              {project.description}
            </motion.p>

            <div
              className="flex-grow border-b border-solid border-gray-500"
              aria-hidden="true"
            ></div>

            <motion.div
              className="flex flex-wrap gap-4 mt-6"
              variants={pageContainer}
            >
              {project.imageUrls?.map((url: string, i: number) => (
                <motion.button
                  key={url}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={gridItem}
                  whileHover={{
                    scale: 1.06,
                    rotate: i % 2 === 0 ? -1.5 : 1.5,
                  }}
                  onClick={() => {
                    setSelectedImg(url);
                  }}
                  className="w-20 h-20 bg-gray-300 cursor-pointer shadow-md overflow-hidden"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label={`Preview image ${i + 1}`}
                />
              ))}
            </motion.div>
          </div>
          {/* Large cover image */}
          {(selectedImg || project.imageUrls?.[0]) && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={gridItem}
              className="w-full md:flex-1 md:max-w-3xl bg-gray-300 mt-10 md:mt-2 relative overflow-hidden aspect-video cursor-zoom-in"
              style={{
                minHeight: "220px",
                maxHeight: "420px",
              }}
              onClick={() => {
                setModalImg(selectedImg || project.imageUrls![0]);
                setModalOpen(true);
              }}
              aria-label="Open large image modal"
            >
              <div
                id="project-preview-large-img"
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${selectedImg || project.imageUrls?.[0]})` }}
                role="img"
                aria-label={project.title}
              />
            </motion.div>
          )}
          {/* Modal for actual image view */}
          {modalOpen && modalImg && (
            <div
              ref={modalRef}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 bg-opacity-80"
              onClick={(e) => {
                // Only close modal if the overlay itself is clicked, not its children
                if (e.target === e.currentTarget) {
                  setModalOpen(false);
                  setModalImg(null);
                }
              }}
            >
              <div className="relative">
                <img
                  src={modalImg}
                  alt="Project Large Preview"
                  className="max-w-full max-h-[90vh] shadow-2xl border-1 border-white/40"
                  style={{ display: "block" }}
                />
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setModalImg(null);
                  }}
                  className="absolute top-5 right-5 border-1 border-white/40 bg-black/30 bg-opacity-60 text-white rounded-full p-7 text-2xl font-bold hover:bg-opacity-80 flex items-center justify-center"
                  aria-label="Close modal"
                >
                  <X />
                </button>
              </div>
            </div>
          )}
        </motion.section>
        <div
          className="flex-grow border-b border-solid border-gray-500 mx-4 sm:mx-8 md:mx-16"
          aria-hidden="true"
        ></div>
        {/* Approach Section */}
        <motion.section
          className="flex flex-col md:flex-row  md:gap-15 py-12 px-4 sm:px-8 md:px-16"
          variants={pageContainer}
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={headingVariant}
            className="text-4xl md:text-6xl sm:text-5xl font-bold mb-6 md:mb-0"
          >
            Approach
          </motion.h2>
          <div className="flex-1 flex items-center">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={paraVariant}
              className="text-[var(--grey1)] text-xl md:text-3xl sm:text-2xl mb-6 !font-light"
            >
              {project.approach}
            </motion.p>
          </div>
        </motion.section>
        <div
          className="flex-grow border-b border-solid border-gray-500 mx-4 sm:mx-8 md:mx-16"
          aria-hidden="true"
        ></div>
        {/* Catchline Section */}
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
        <div
          className="flex-grow border-b border-solid border-gray-500 mx-4 sm:mx-8 md:mx-16"
          aria-hidden="true"
        ></div>
        {/* Client Feedback Section */}
        {/* {project.clientFeedback && (
          <div className="py-12 px-4 sm:px-8 md:px-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="italic !text-9xl text-[var(--brown1)]"
            >
              “
            </motion.span>
            <motion.blockquote
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
              className="text-[var(--grey1)] text-5xl leading-13 font-light -mt-10"
            >
              {project.clientFeedback}
            </motion.blockquote>
          </div>
        )} */}
        <ContactPage />
        <CopyrightFooter />
      </motion.main>
    </div>
  );
};

export default ProjectShowcaseClient;
