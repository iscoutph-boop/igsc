import { useState } from "react";
import { CheckBookingModal } from "@/components/booking-modals";
import { Lightbox } from "@/components/lightbox";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AboutSection } from "./components/about-section";
import { ConsultationClose } from "./components/consultation-close";
import { EstimatorSection } from "./components/estimator-section";
import { MeetingsSection } from "./components/meetings-section";
import { PackagesSection } from "./components/packages-section";
import { ProcessSection } from "./components/process-section";
import { ProjectsSection } from "./components/projects-section";
import { ReviewsSection } from "./components/reviews-section";
import { ServicesSection } from "./components/services-section";

export function DetailsPage() {
  const [manageBookingOpen, setManageBookingOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const openImage = (src: string, images: string[]) => {
    const group = images.length > 0 ? images : [src];
    const index = group.indexOf(src);
    setLightboxImages(group);
    setLightboxIndex(index >= 0 ? index : 0);
  };

  const closeLightbox = () => {
    setLightboxIndex(-1);
    setLightboxImages([]);
  };

  return (
    <PageTransition>
      <SiteHeader />
      <main>
        <h1 className="sr-only">IG Sabroso Construction services, packages, and projects</h1>
        <AboutSection onOpenImage={openImage} />
        <ServicesSection />
        <PackagesSection />
        <ProjectsSection onOpenImage={openImage} />
        <EstimatorSection />
        <MeetingsSection onOpenImage={openImage} />
        <ReviewsSection />
        <ProcessSection />
        <ConsultationClose onManageBooking={() => setManageBookingOpen(true)} />
      </main>
      <SiteFooter />

      <CheckBookingModal open={manageBookingOpen} onClose={() => setManageBookingOpen(false)} />
      <Lightbox
        images={lightboxImages}
        index={lightboxIndex}
        onClose={closeLightbox}
        onIndexChange={setLightboxIndex}
        alt="IG Sabroso project preview"
      />
    </PageTransition>
  );
}
