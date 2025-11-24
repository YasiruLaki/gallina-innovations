"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import ContactPage from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";
import MobileMenu from "@/components/MobileMenu";
import Loading from "@/components/Loading";

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
  clientFeedback?: string;
};

const ProjectShowcaseClient: React.FC = () => {
  const searchParams = useSearchParams();
  const projectName = searchParams.get("name");
  const [project, setProject] = useState<FirestoreProject | null>(null);
  const [loading, setLoading] = useState(true);

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
        className="min-h-screen text-white mx-auto select-none mt-40"
      >
        <motion.h1
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={headingVariant}
          className="text-5xl !font-light mb-6 md:px-[80px] px-[30px] underline offset-4"
        >
          {project.title}, {project.location}
        </motion.h1>
        {/* Header Section */}
        <motion.section
          className="flex flex-col md:flex-row md:items-start md:gap-20 pb-12 md:px-[80px] px-[30px]"
          variants={pageContainer}
        >
          <div className="flex-1">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={paraVariant}
              className="text-[var(--grey1)] text-lg  mb-6 !font-light"
            >
              {project.description}
            </motion.p>
            <motion.div className="flex gap-6" variants={pageContainer}>
              {project.imageUrls
                ?.slice(0, 4)
                .map((url: string, i: number) => (
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
                      const el = document.getElementById(
                        "project-preview-large-img"
                      );
                      if (el) {
                        (el as HTMLElement).style.backgroundImage = `url("${url}")`;
                        (el as HTMLElement).style.backgroundSize = "cover";
                        (el as HTMLElement).style.backgroundPosition = "center";
                      }
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
          {project.imageUrls?.[0] && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={gridItem}
              className="flex-1 max-w-3xl w-full bg-gray-300 mt-10 md:mt-2 relative overflow-hidden"
              style={{ paddingTop: "36.25%" }} // 16:9 ratio
            >
              <div
                id="project-preview-large-img"
                className="absolute inset-0 bg-center bg-cover"
                style={{ backgroundImage: `url(${project.imageUrls[0]})` }}
                role="img"
                aria-label={project.title}
              />
            </motion.div>
          )}
        </motion.section>
        <div
          className="flex-grow border-b border-solid border-gray-500 md:mx-[80px] mx-[40px]"
          aria-hidden="true"
        ></div>
        {/* Approach Section */}
        <motion.section
          className="flex flex-col md:flex-row  md:gap-15 py-12 md:px-[80px] px-[30px]"
          variants={pageContainer}
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            variants={headingVariant}
            className="text-4xl font-bold mb-6 md:mb-0"
          >
            Approach
          </motion.h2>
          <div className="flex-1 flex items-center">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.18 }}
              variants={paraVariant}
              className="text-[var(--grey1)] text-lg mb-6 !font-light"
            >
              {project.approach}
            </motion.p>
          </div>
        </motion.section>
        <div
          className="flex-grow border-b border-solid border-gray-500 md:mx-[80px] mx-[40px]"
          aria-hidden="true"
        ></div>
        {/* Catchline Section */}
        {project.catchline && (
          <motion.section
            className="py-12 md:px-[80px] px-[30px]"
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
          className="flex-grow border-b border-solid border-gray-500 md:mx-[80px] mx-[40px]"
          aria-hidden="true"
        ></div>
        {/* Client Feedback Section */}
        {project.clientFeedback && (
          <div className="py-12 md:px-[80px] px-[30px]">
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
        )}
        <ContactPage />
        <CopyrightFooter />
      </motion.main>
    </div>
  );
};

export default ProjectShowcaseClient;
