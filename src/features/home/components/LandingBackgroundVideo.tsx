export default function LandingBackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <video
        className="h-full w-full object-cover opacity-95"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/background-vid/background-swife.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[#080b08]/5" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(8,11,8,0.82) 0%, rgba(8,11,8,0.36) 42%, rgba(8,11,8,0.62) 100%)",
        }}
      />
    </div>
  );
}
