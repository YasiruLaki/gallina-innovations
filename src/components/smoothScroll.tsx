// "use client";

// import { useEffect } from 'react';
// import gsap from 'gsap';
// import ScrollTrigger from 'gsap/ScrollTrigger';
// import ScrollSmoother from '@/libs/gsap/ScrollSmoother'; // <-- Adjust this path to where you saved the file

// export default function GsapScroll({ children }) {
//   // Register the plugins right away
//   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

//   useEffect(() => {
//     // Create the smooth scroller
//     const smoother = ScrollSmoother.create({
//       wrapper: '#smooth-wrapper',
//       content: '#smooth-content',
//       smooth: 1.2, // Adjust the smoothness (1 is the default)
//       effects: true, // Enable parallax effects for elements with data-speed
//       smoothTouch: 0.1, // Smoother scrolling on touch devices
//     });

//     // --- Cleanup ---
//     // This is crucial to prevent memory leaks when the component unmounts
//     return () => {
//       if (smoother) {
//         smoother.kill(); // Kill the ScrollSmoother instance
//         // Kill all ScrollTrigger instances
//         ScrollTrigger.getAll().forEach(trigger => trigger.kill());
//       }
//     };
//   }, []); // Run only once on mount

//   return (
//     <div id="smooth-wrapper">
//       <div id="smooth-content">
//         {children}
//       </div>
//     </div>
//   );
// }