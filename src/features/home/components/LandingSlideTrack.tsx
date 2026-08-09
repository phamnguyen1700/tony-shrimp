import type { ShrimpListItem } from "@/types/shrimp";
import LandingSlide from "./LandingSlide";

interface LandingSlideTrackProps {
  shrimp: ShrimpListItem[];
  activeIndex: number;
  reduced: boolean | null;
}

export default function LandingSlideTrack({ shrimp, activeIndex, reduced }: LandingSlideTrackProps) {
  return (
    <>
      {shrimp.map((specimen, index) => (
        <LandingSlide
          key={specimen.id}
          specimen={specimen}
          index={index}
          isActive={index === activeIndex}
          reduced={reduced}
        />
      ))}
    </>
  );
}
