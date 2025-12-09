
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

export type FirestoreProject = {
  title: string;
  location: string;
  description: string;
  imageUrls?: string[];
};

interface FeaturedProjectProps {
  featured: FirestoreProject;
}

const FeaturedProjectSection: React.FC<FeaturedProjectProps> = ({ featured }) => {
  const images = featured.imageUrls && featured.imageUrls.length > 0
    ? featured.imageUrls
    : ["https://cdn.gallinainnovations.com/uploads/landing-9.jpg"];
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  // Auto slideshow effect
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((prevIdx) => (prevIdx + 1) % images.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [images.length, current]);

  return (
    <motion.div
      className="px-4 sm:px-8 md:px-16 pt-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <header className="flex flex-col lg:flex-row lg:items-center translate-y-10 gap-8">
        <h1 className="text-6xl md:text-8xl font-medium mt-10 lg:mt-0 text-[var(--brown1)]/40">
          Featured Work
        </h1>
        <div
          className={`
            flex h-16 w-16 items-center justify-center rounded-full border border-[var(--brown1)]/40
            transition-transform duration-300 
            md:h-25 md:w-25 bg-black/20
          `}
        >
          <ArrowDown size={50} strokeWidth={1} color="#dfd1b9" />
        </div>
      </header>

      <section className="text-white flex flex-col lg:flex-row items-start gap-12 shadow-lg mt-20">
        <div className="relative w-full lg:w-1/2 h-64 md:h-96 overflow-hidden shadow-lg flex flex-col items-center">
          {/* Crossfade Images */}
          {prev !== null && prev !== current && (
            <motion.div
              key={images[prev]}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 2 }}
            >
              <Image
                src={images[prev]}
                alt={featured.title}
                className="object-cover w-full h-full"
                width={800}
                height={600}
                priority
              />
            </motion.div>
          )}
          <motion.div
            key={images[current]}
            initial={{ opacity: prev !== null && prev !== current ? 0 : 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 3 }}
          >
            <Image
              src={images[current]}
              alt={featured.title}
              className="object-cover w-full h-full"
              width={800}
              height={600}
              priority
            />
          </motion.div>
        </div>
        <div className="flex-1 flex flex-col justify-center items-start">
          <h2 className="text-4xl md:text-6xl font-medium mb-4 text-[var(--brown1)]">
            {featured.title + ","}
            <br />
            {featured.location}
          </h2>
          <p className="text-lg md:text-xl font-light text-zinc-300 mb-6">
            {featured.description}
          </p>
          <button
            className="self-start text-left underline text-[var(--grey1)] rounded font-light transition-colors mb-4 lg:mb-0"
            onClick={() =>
              (window.location.href = `/projectShowcase?name=${encodeURIComponent(
                featured.title
              )}`)
            }
          >
            View More →
          </button>
          {/* Thumbnails below button */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 justify-start z-10 relative flex-wrap">
              {images.map((img, idx) => (
                <button
                  key={img}
                  onClick={() => {
                    setPrev(current);
                    setCurrent(idx);
                  }}
                  className={`
                    overflow-hidden border-2 transition-all duration-200
                    ${current === idx ? 'border-[var(--brown1)]' : 'border-transparent'}
                    bg-gray-300 cursor-pointer
                    w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                  `}
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  aria-label={`Show image ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default FeaturedProjectSection;
