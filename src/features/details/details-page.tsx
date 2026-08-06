import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { CheckBookingModal } from "@/components/booking-modals";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "./components/about-section";
import { ConsultationClose } from "./components/consultation-close";
import { ProcessSection } from "./components/process-section";
import { ReviewsSection } from "./components/reviews-section";
import { ServicesSection } from "./components/services-section";

export function DetailsPage() {
  const [manageBookingOpen, setManageBookingOpen] = useState(false);
  const routeHash = useRouterState({ select: (state) => state.location.hash });
  const hash = routeHash.replace(/^#/, "");

  useEffect(() => {
    if (!hash) return;
    const scrollToHash = () => {
      const target = document.getElementById(hash);
      if (!target) return;
      const reduceMotion =
        typeof window.matchMedia === "function"
          ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
          : true;

      if (typeof target.scrollIntoView === "function") {
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    };
    const frame = window.requestAnimationFrame(scrollToHash);
    const timer = window.setTimeout(scrollToHash, 120);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [hash]);

  return (
    <PageTransition>
      <SiteHeader />
      <main>
        <h1 className="sr-only">
          About, services, process, reviews, and contact - IG Sabroso Construction
        </h1>
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
        <ReviewsSection />
        <ConsultationClose onManageBooking={() => setManageBookingOpen(true)} />
      </main>
      <SiteFooter />
      <CheckBookingModal open={manageBookingOpen} onClose={() => setManageBookingOpen(false)} />
    </PageTransition>
  );
}
