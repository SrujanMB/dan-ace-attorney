import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";
import ObjectionSound from "/shouts/objection.mp3";

interface ObjectionShoutProps {
  show: boolean;
}

const animationIntensity = 7;
const shakeKeyframes = [
  0,
  -animationIntensity,
  animationIntensity / 2,
  -animationIntensity / 3,
  animationIntensity,
  0,
];
export default function ObjectionShout({ show }: ObjectionShoutProps) {
  // Use useRef to persist the audio object
  const audioRef = useRef(new Audio(ObjectionSound));

  useEffect(() => {
    if (show) {
      // Reset sound to start to allow rapid re-playing
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, [show]); // Only runs when shouldPlay changesa

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{
            x: shakeKeyframes,
            y: shakeKeyframes, // Keyframes for shaking
          }}
          transition={{ duration: 0.3 }}
        >
          <img src="/shouts/objection!.png" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
