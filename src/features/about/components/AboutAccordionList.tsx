import type { Lang, Translations } from "@/i18n";
import type { ReactNode } from "react";
import GoogleMapEmbed from "@/components/common/location/GoogleMapEmbed";
import AboutAccordion from "./AboutAccordion";
import AboutSocialLink from "./AboutSocialLink";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

interface AboutAccordionListProps {
  t: Translations;
  lang: Lang;
  openId?: string;
}

interface AboutContentProps {
  title: string;
  overview: AboutCopySegment[];
  highlights?: AboutCopySegment[][];
  note?: AboutCopySegment[];
  highlightsLabel: string;
}

type AboutCopySegment = {
  text: string;
  strong?: boolean;
  href?: string;
};

const facebookUrl = "https://facebook.com/thang.pham.790508";
const instagramUrl = "https://www.instagram.com/caothang.0105";

const sectionOrder = [
  "store",
  "shipping",
  "terms",
  "liveArrival",
  "doa",
] as const;

const sectionAnchors = {
  store: undefined,
  shipping: "shipping",
  terms: undefined,
  liveArrival: "live-arrival",
  doa: "doa",
} satisfies Record<(typeof sectionOrder)[number], string | undefined>;

const defaultOpenSections = new Set<(typeof sectionOrder)[number]>(["store"]);

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-foreground">{children}</strong>
);

function renderSegments(segments: AboutCopySegment[]) {
  return segments.map((segment, index) => {
    if (segment.href) {
      return (
        <a
          key={index}
          href={segment.href}
          className="font-semibold text-foreground underline underline-offset-2"
        >
          {segment.text}
        </a>
      );
    }

    if (segment.strong) {
      return <Strong key={index}>{segment.text}</Strong>;
    }

    return <span key={index}>{segment.text}</span>;
  });
}

function AboutContent({
  title,
  overview,
  highlights,
  note,
  highlightsLabel,
}: AboutContentProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="font-serif text-lg font-semibold italic leading-snug text-foreground md:text-xl">
          {title}
        </h3>

        <p className="text-sm leading-7 text-muted-foreground md:text-[15px]">
          {renderSegments(overview)}
        </p>
      </div>

      {highlights?.length ? (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
            {highlightsLabel}
          </h4>

          <ul className="space-y-2 text-sm leading-6 text-muted-foreground md:text-[15px]">
            {highlights.map((item, index) => (
              <li key={index} className="flex gap-3">
                <span className="mt-[11px] size-1 shrink-0 rounded-full bg-foreground/60" />
                <span>{renderSegments(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {note ? (
        <div className="border-l border-border pl-4 text-sm leading-6 text-muted-foreground md:text-[15px]">
          {renderSegments(note)}
        </div>
      ) : null}
    </div>
  );
}

export default function AboutAccordionList({
  t,
  openId,
}: AboutAccordionListProps) {
  const about = t.about;

  return (
    <div className="max-w-2xl">
      {sectionOrder.map((sectionKey) => {
        const section = about.sections[sectionKey];
        const anchor = sectionAnchors[sectionKey];

        return (
          <AboutAccordion
            key={sectionKey}
            id={anchor}
            title={section.title}
            defaultOpen={defaultOpenSections.has(sectionKey)}
            forceOpen={Boolean(anchor && openId === anchor)}
          >
            <AboutContent
              title={section.heading}
              overview={section.overview}
              highlights={section.highlights}
              note={"note" in section ? section.note : undefined}
              highlightsLabel={about.highlights}
            />
          </AboutAccordion>
        );
      })}

      <AboutAccordion
        id="contact"
        title={about.sections.contact.title}
        forceOpen={openId === "contact"}
      >
        <AboutContent
          title={about.sections.contact.heading}
          overview={[
            { text: `${about.sections.contact.ownerLabel}: ` },
            { text: about.sections.contact.ownerName, strong: true },
          ]}
          highlightsLabel={about.highlights}
        />
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Social
            </p>
            <div className="flex flex-col gap-3">
              <AboutSocialLink
                href={facebookUrl}
                icon={<FaFacebookF />}
                label="Facebook"
              />
              <AboutSocialLink
                href={instagramUrl}
                icon={<FaInstagram />}
                label="Instagram"
              />
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              {about.sections.contact.addressLabel}
            </p>
            <div className="space-y-3 text-sm leading-6 text-muted-foreground md:text-[15px]">
              <p>{about.sections.contact.address}</p>
              <div className="overflow-hidden border border-border bg-card" style={{ borderRadius: "var(--radius)" }}>
                <GoogleMapEmbed className="h-56 w-full border-0" />
              </div>
            </div>
          </div>
        </div>
      </AboutAccordion>
    </div>
  );
}
