import { useEffect, useState, useRef, useCallback } from "react";

interface SlamDetectorProps {
  callback: () => void;
}

export default function SlamDetector({ callback }: SlamDetectorProps) {
  const [threshold, setThreshold] = useState<number>(20);
  const [lastMagnitude, setLastMagnitude] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  const thresholdRef = useRef(threshold);
  const callbackRef = useRef(callback);

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

    if (magnitude > thresholdRef.current) {
      callbackRef.current();

      if ("vibrate" in navigator) navigator.vibrate(100);
    }
  }, []);

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
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Slam Calibration</h2>

      <div
        style={{
          marginBottom: "20px",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        <p>
          Live Force: <strong>{lastMagnitude}</strong>
        </p>
        <p>
          Current Threshold: <strong>{threshold}</strong>
        </p>
      </div>

      <label>
        Sensitivity Threshold:
        <input
          type="range"
          min="2"
          max="25"
          step="1"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          style={{ width: "100%", display: "block", margin: "10px 0" }}
        />
      </label>

      <button
        onClick={toggleDetection}
        style={{
          padding: "10px 20px",
          backgroundColor: isActive ? "#ff4444" : "#44bb44",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {isActive ? "Stop Detection" : "Start Detection"}
      </button>

      <p style={{ fontSize: "0.8em", color: "#666" }}>
        Note: Lower threshold = More sensitive.
      </p>
    </div>
  );
}
