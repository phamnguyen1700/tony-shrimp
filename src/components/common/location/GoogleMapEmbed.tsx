const googleMapsEmbedUrl =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3138.5078398612304!2d145.3176564766147!3d-38.128382852085686!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad605e005705fdd%3A0xa89431d99f945ee5!2sTony%20Shrimp%20Australia!5e0!3m2!1svi!2s!4v1787387608646!5m2!1svi!2s";

interface GoogleMapEmbedProps {
  className?: string;
}

export default function GoogleMapEmbed({ className }: GoogleMapEmbedProps) {
  return (
    <iframe
      src={googleMapsEmbedUrl}
      title="Tony Shrimp Australia location map"
      className={className}
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  );
}
