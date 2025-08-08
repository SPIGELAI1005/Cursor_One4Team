import { useEffect, useMemo, useRef, useState } from "react";

interface HeroImageLoopProps {
  images: { src: string; alt?: string }[];
  intervalMs?: number; // time each image stays visible
  transitionMs?: number; // crossfade duration
}

// A responsive, reusable hero image crossfade loop that keeps full image in view (object-contain)
export default function HeroImageLoop({
  images,
  intervalMs = 7000,
  transitionMs = 900,
}: HeroImageLoopProps) {
  const [active, setActive] = useState(0);
  const [ratios, setRatios] = useState<number[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const next = () => setActive((i) => (i + 1) % images.length);

  // Preload images and capture aspect ratios to fit the frame precisely
  useEffect(() => {
    images.forEach((img, idx) => {
      const i = new Image();
      i.src = img.src;
      i.onload = () => {
        setRatios((prev) => {
          const copy = prev.slice();
          copy[idx] = i.naturalWidth / i.naturalHeight;
          return copy;
        });
      };
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;
    timeoutRef.current = window.setTimeout(next, intervalMs);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [active, images.length, intervalMs]);

  const transitionStyle: React.CSSProperties = {
    transition: `opacity ${transitionMs}ms ease, transform ${intervalMs}ms linear`,
  };

  const activeRatio = ratios[active] ?? 16 / 10;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl shadow-md"
      style={{ aspectRatio: `${activeRatio}` }}
    >
      {images.map((img, i) => {
        const isActive = i === active;
        return (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt ?? `Hero scene ${i + 1}`}
            className="absolute inset-0 h-full w-full object-contain"
            style={{
              ...transitionStyle,
              opacity: isActive ? 1 : 0,
              transform: isActive ? "scale(1.02)" : "scale(1)",
            }}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            sizes="100vw"
          />
        );
      })}
    </div>
  );
}
