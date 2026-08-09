interface LandingIndicatorsProps {
  total: number;
  activeIndex: number;
  onGoTo: (index: number) => void;
}

export default function LandingIndicators({ total, activeIndex, onGoTo }: LandingIndicatorsProps) {
  return (
    <>
      {Array.from({ length: total }, (_, index) => (
        <button
          key={index}
          onClick={() => onGoTo(index)}
          className="w-5 h-0.5 transition-all duration-300"
          style={{
            background:
              index === activeIndex ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)",
          }}
          aria-label={`Go to specimen ${index + 1}`}
        />
      ))}
    </>
  );
}
