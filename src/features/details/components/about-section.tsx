import { Link } from "@tanstack/react-router";
import { ArrowRight, Award, Eye, Target, UsersRound } from "lucide-react";
import aboutValuesClientMeeting from "@/assets/real/about-values-client-meeting.webp";
import aboutCollaborationBuild from "@/assets/real/about-collaboration-build.jpg";
import { COMPANY } from "@/content/company";
import { RefinementSection } from "./refinement-shell";
import { SectionHeading } from "./section-heading";

export function AboutSection() {
  return (
    <RefinementSection id="about" className="pt-14 lg:pt-20">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="About us"
            title="Built on values."
            accent="Focused on you."
            description="IG Sabroso combines practical project planning, dependable workmanship, and clear client communication to build spaces that last."
          />
          <p className="mt-7 text-base leading-8 text-muted-foreground">{COMPANY.history}</p>

          <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { icon: Target, title: "Mission", copy: COMPANY.mission },
              { icon: Eye, title: "Vision", copy: COMPANY.vision },
              { icon: Award, title: "Values", copy: COMPANY.values.join(" · ") },
            ].map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_36px_rgba(21,34,56,0.06)]"
              >
                <Icon aria-hidden="true" size={23} className="text-primary" />
                <h3 className="mt-4 text-sm font-extrabold uppercase tracking-[0.1em] text-foreground">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">{copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div>
          <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-card">
            <img
              src={aboutValuesClientMeeting}
              alt="IG Sabroso team and clients gathered for a project presentation with material samples"
              className="aspect-[16/10] w-full object-cover"
              loading="eager"
            />
          </div>
          <div className="relative mx-4 -mt-8 grid gap-3 rounded-2xl border border-border bg-white p-4 shadow-[0_18px_50px_rgba(21,34,56,0.12)] sm:grid-cols-4 sm:p-5">
            {COMPANY.metrics.map((metric) => (
              <div
                key={metric.label}
                className="px-3 py-2 text-center sm:border-r sm:border-border sm:last:border-r-0"
              >
                <p className="font-display text-3xl font-black tracking-[-0.04em] text-primary">
                  {metric.value}
                </p>
                <p className="mt-1 text-[0.68rem] leading-4 text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-6 overflow-hidden rounded-[1.75rem] border border-border bg-[#f7f8fa] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:p-10">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={aboutCollaborationBuild}
            alt="IG Sabroso team and clients reviewing a project plan together"
            className="aspect-[16/10] w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="lg:px-6">
          <span className="grid size-12 place-items-center rounded-xl bg-[#fff0ea] text-primary">
            <UsersRound aria-hidden="true" size={24} />
          </span>
          <h3 className="mt-6 text-3xl font-extrabold tracking-[-0.03em] text-foreground sm:text-4xl">
            Collaboration is part of the build.
          </h3>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Successful projects begin with a shared understanding of the client vision. IG Sabroso
            coordinates clients, management, designers, and construction teams through clear
            decisions and visible next steps.
          </p>
          <Link
            to="/consultation"
            className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-primary px-5 text-sm font-extrabold text-white"
          >
            Discuss your project
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </RefinementSection>
  );
}
