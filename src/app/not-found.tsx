import Link from "next/link";
import MobileMenu from "@/components/MobileMenu";
import CopyrightFooter from "@/components/footer";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-white flex flex-col items-center justify-between">
      <MobileMenu />
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-8xl font-bold text-[var(--brown1)] mb-4">404</h1>
        <h2 className="text-5xl font-light mb-2 text-center">Page Not Found</h2>
        <p className="text-lg text-[var(--grey1)] mb-6 text-center max-w-xl">
          Sorry, the page you are looking for does not exist or has been moved.<br />
          Please check the URL or use the links below to navigate.
        </p>
        <div className="flex gap-4">
          <Link href="/" className="px-6 py-2 rounded-lg bg-[var(--brown1)] text-black font-semibold hover:bg-[var(--brown2)] transition">Home</Link>
          <Link href="/contact" className="px-6 py-2 rounded-lg bg-[var(--grey1)] text-black font-semibold hover:bg-[var(--grey2)] transition">Contact Us</Link>
        </div>
      </div>
      <CopyrightFooter />
    </main>
  );
}
