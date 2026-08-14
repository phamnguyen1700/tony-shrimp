import Link from "next/link";
import FallbackImage from "@/components/common/images/FallbackImage";
import { routes } from "@/config/routes";

interface LandingLoadingStateProps {
  status?: "loading" | "coming-soon" | "error";
}

export default function LandingLoadingState({ status = "loading" }: LandingLoadingStateProps) {
  if (status === "coming-soon" || status === "error") {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080b08] px-6 text-center">
        <div className="space-y-5">
          <div className="mx-auto h-48 w-72 overflow-hidden md:h-64 md:w-96">
            <FallbackImage
              alt={status === "error" ? "Collection unavailable" : "Coming soon"}
              className="h-full w-full object-contain"
            />
          </div>
          <p className="font-mono-label text-xs uppercase tracking-[0.22em] text-white/35">
            {status === "error" ? "Collection unavailable" : "Coming soon"}
          </p>
          <Link
            href={routes.shop}
            className="inline-block font-mono-label text-xs uppercase tracking-widest text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
          >
            Open Aquarium Shrimp
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#080b08]">
      <p className="font-mono-label text-xs uppercase tracking-[0.22em] text-white/35">
        Loading collection...
      </p>
    </div>
  );
}
