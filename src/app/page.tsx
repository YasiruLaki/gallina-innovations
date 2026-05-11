"use client";
import DustOverlay from "@/components/dustOverlay";
import Loading from "@/components/Loading";
import CustomCursor from "@/components/CustomCursor";
import MobileMenu from "@/components/MobileMenu";
import Landing from "@/components/Landing";
import ProjectCategories from "@/components/projectCategories";
import ContactPage from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";
import PhilosophyStrip from "@/components/PhilosophyStrip";
import HowWeWork from "@/components/HowWeWork";

export default function Home() {

  return (
    <div className="w-full min-h-screen bg-[var(--background)] text-white font-sans lg:px-0">
      {/* <SmoothScroll /> */}
      <DustOverlay />
      <Loading />
      <CustomCursor />
      {/* <NavBar /> */}
      <MobileMenu />
      <Landing />
      {/* <AboutIntro /> */}
      <PhilosophyStrip />
      <ProjectCategories />
      <HowWeWork />
      <ContactPage />
      <CopyrightFooter />
    </div>
  );
}
