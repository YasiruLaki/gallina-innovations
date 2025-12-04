import React from "react";
import MobileMenu from "@/components/MobileMenu";
import ContactUs from "@/components/contactUs";
import CopyrightFooter from "@/components/footer";

// const contactLandingImg = "/default/contact-landing.jpg"; // Place your image in public/default/

export const metadata = {
  title: "Contact | Gallina Innovations",
  description: "Get in touch with Gallina Innovations for inquiries, consultations, or collaborations. We're here to help you bring your architectural vision to life.",
  alternates: {
    canonical: "https://gallinainnovations.com/contact"
  }
};

const ContactPage: React.FC = () => (
  <main className="min-h-screen bg-[var(--background)] text-white">
    <MobileMenu />
    <div className="w-full flex flex-col items-center">
      {/* <div className="w-full aspect-[16/4] rounded-2xl overflow-hidden shadow-lg mb-10">
        <img
          src={contactLandingImg}
          alt="Contact Gallina Innovations"
          className="w-full h-full object-cover object-center"
          style={{ filter: "brightness(0.85)" }}
        />
      </div> */}
      <div className="w-full">
        <ContactUs />
      </div>
      <div className="w-full">
        <CopyrightFooter />
      </div>
    </div>
  </main>
);

export default ContactPage;
