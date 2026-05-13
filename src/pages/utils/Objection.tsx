import { motion, AnimatePresence } from "motion/react";

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
