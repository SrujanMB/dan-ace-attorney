import { useEffect, useRef, useState } from "react";

interface ObjectionShoutProps {
  side: "left" | "right";
  onComplete?: () => void;
}

const leftVideos = [
  "/shouts/left/ace-attorney-1.mov",
  "/shouts/left/ace-attorney-2.mov",
  "/shouts/left/ace-attorney-3.mov",
  "/shouts/left/ace-attorney-4.mov",
  "/shouts/left/danganronpa-1.mov",
  "/shouts/left/danganronpa-2.mov",
  "/shouts/left/danganronpa-3.mov",
  "/shouts/left/danganronpa-4.mov",
  "/shouts/left/danganronpa-5.mov",
];

const rightVideos = [
  "/shouts/right/ace-attorney-1.mov",
  "/shouts/right/ace-attorney-2.mov",
  "/shouts/right/ace-attorney-3.mov",
  "/shouts/right/ace-attorney-4.mov",
  "/shouts/right/danganronpa-1.mov",
  "/shouts/right/danganronpa-2.mov",
  "/shouts/right/danganronpa-3.mov",
];

const allVideos = [...leftVideos, ...rightVideos];

const preloaded = new Set<string>();
function preloadAll() {
  for (const src of allVideos) {
    if (preloaded.has(src)) continue;
    preloaded.add(src);
    const video = document.createElement("video");
    video.preload = "auto";
    video.src = src;
    video.load();
  }
}
preloadAll();

export default function ObjectionShout({ side, onComplete }: ObjectionShoutProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const fadeOutTimer = useRef<ReturnType<typeof setTimeout>>();

  const videos = side === "left" ? leftVideos : rightVideos;

  useEffect(() => {
    const src = videos[Math.floor(Math.random() * videos.length)];
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.src = src;
    video.currentTime = 0;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          video.muted = false;
        })
        .catch((e) => {
          console.error("Video play failed:", e);
        });
    }
  }, [side, videos]);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleEnded = () => {
      setVisible(false);
      fadeOutTimer.current = setTimeout(() => {
        onComplete?.();
      }, 500);
    };

    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("ended", handleEnded);
      if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
    };
  }, [onComplete]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <video
        ref={videoRef}
        preload="auto"
        className="w-[80%] aspect-video object-contain transition-opacity duration-500"
        style={{ opacity: visible ? 1 : 0 }}
        playsInline
      />
    </div>
  );
}
