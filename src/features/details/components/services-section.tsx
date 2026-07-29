import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { projects, services, type Service } from "../content";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function ServicesSection() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [featuredService, ...supportingServices] = services;
  const FeaturedIcon = featuredService.icon;

  return (
    <>
      <RefinementSection id="services" tone="muted">
        <SectionHeading
          eyebrow="Our services"
          title="Comprehensive solutions."
          accent="Exceptional results."
          className="max-w-3xl"
        />

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <button
            type="button"
            onClick={() => setSelectedService(featuredService)}
            className="group overflow-hidden rounded-[1.5rem] bg-card text-left shadow-card transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            <img
              src={projects[0].img}
              alt="Completed residential construction by IG Sabroso"
              className="aspect-[1.55/1] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <span className="flex gap-5 p-6 sm:p-7">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <FeaturedIcon aria-hidden="true" size={25} strokeWidth={1.8} />
              </span>
              <span>
                <span className="block text-xl font-bold text-foreground">
                  {featuredService.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                  {featuredService.description}
                </span>
              </span>
            </span>
          </button>

          <div className="grid border-y border-border md:grid-cols-2">
            {supportingServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <button
                  type="button"
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={[
                    "group min-h-52 border-b border-border p-7 text-left transition-colors hover:bg-card focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    index % 2 === 0 ? "md:border-r" : "",
                    index >= supportingServices.length - 2 ? "md:border-b-0" : "",
                  ].join(" ")}
                >
                  <span className="flex items-start gap-5">
                    <Icon
                      aria-hidden="true"
                      className="shrink-0 text-primary"
                      size={34}
                      strokeWidth={1.7}
                    />
                    <span>
                      <span className="block text-lg font-bold text-foreground">
                        {service.title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                        {service.description}
                      </span>
                      <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-primary">
                        View service
                        <ArrowRight
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-1"
                          size={17}
                        />
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </RefinementSection>

      <Dialog
        open={selectedService !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedService(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-[1.5rem] border-border bg-card p-8 sm:p-10">
          {selectedService ? <ServiceDetails service={selectedService} /> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ServiceDetails({ service }: { service: Service }) {
  const Icon = service.icon;

  return (
    <div>
      <span className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
        <Icon aria-hidden="true" size={27} strokeWidth={1.8} />
      </span>
      <h3 className="mt-6 text-3xl font-bold text-foreground">{service.title}</h3>
      <p className="mt-4 text-base leading-7 text-muted-foreground">{service.longDescription}</p>
      <a
        href="/consultation"
        className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 active:translate-y-px"
      >
        Book a consultation
        <ArrowRight aria-hidden="true" size={18} />
      </a>
    </div>
  );
}
