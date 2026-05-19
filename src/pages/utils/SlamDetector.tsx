import { useEffect, useState, useRef, useCallback } from "react";

interface SlamDetectorProps {
  callback: () => void;
}

export default function SlamDetector({ callback }: SlamDetectorProps) {
  const [threshold, setThreshold] = useState<number>(20);
  const [lastMagnitude, setLastMagnitude] = useState<number>(0);
  const [peakForce, setPeakForce] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const thresholdRef = useRef(threshold);
  const callbackRef = useRef(callback);
  const peakRef = useRef(0);

  useEffect(() => {
    thresholdRef.current = threshold;
  }, [threshold]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const handleMotion = useCallback((event: DeviceMotionEvent) => {
    const acc = event.acceleration;
    if (!acc) return;

    const magnitude = Math.sqrt(
      (acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2,
    );

    setLastMagnitude(Number(magnitude.toFixed(2)));

    if (magnitude > peakRef.current) {
      peakRef.current = magnitude;
    }

    if (magnitude > thresholdRef.current) {
      callbackRef.current();

      if ("vibrate" in navigator) navigator.vibrate(100);
    }
  }, []);

  useEffect(() => {
    if (!isActive) {
      peakRef.current = 0;
      setPeakForce(0);
      return;
    }

    const interval = setInterval(() => {
      setPeakForce(Number(peakRef.current.toFixed(2)));
      peakRef.current = 0;
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleDetection = async () => {
    if (!isActive) {
      if (typeof DeviceMotionEvent.requestPermission === "function") {
        const res = await DeviceMotionEvent.requestPermission();
        if (res !== "granted") return;
      }
      window.addEventListener("devicemotion", handleMotion);
      setIsActive(true);
    } else {
      window.removeEventListener("devicemotion", handleMotion);
      setIsActive(false);
    }
  };

  useEffect(() => {
    return () => {
      if (isActive) {
        window.removeEventListener("devicemotion", handleMotion);
      }
    };
  }, [isActive, handleMotion]);

  return (
    <div className="flex flex-col items-center gap-4 w-80">
      <h2 className="text-purple-400 text-sm font-semibold tracking-[0.2em] m-0">
        SLAM CALIBRATION
      </h2>

      <div className="w-full flex flex-row justify-between bg-black border border-zinc-800 px-4 py-3 text-sm">
        <span className="text-zinc-500">
          Peak: <strong className="text-purple-400">{peakForce}</strong>
        </span>
        <span className="text-zinc-500">
          Force: <strong className="text-zinc-300">{lastMagnitude}</strong>
        </span>
        <span className="text-zinc-500">
          Threshold: <strong className="text-zinc-300">{threshold}</strong>
        </span>
      </div>

      <div className="w-full flex flex-col gap-2">
        <label className="text-zinc-500 text-xs tracking-wide">
          SENSITIVITY: {threshold}
        </label>
        <input
          type="range"
          min="2"
          max="25"
          step="1"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      <button
        onClick={toggleDetection}
        className="w-full py-2.5 text-sm font-semibold tracking-[0.2em] border transition-colors"
        style={{
          background: isActive ? "#3b0764" : "#09090b",
          color: isActive ? "#faf5ff" : "#a855f7",
          borderColor: isActive ? "#a855f7" : "#3b0764",
        }}
      >
        {isActive ? "STOP DETECTION" : "START DETECTION"}
      </button>

      <p className="text-zinc-600 text-xs m-0">
        Lower threshold = more sensitive
      </p>
    </div>
  );
}
