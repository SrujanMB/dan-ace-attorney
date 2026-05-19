declare global {
  interface DeviceMotionEventConstructor {
    requestPermission?: () => Promise<"granted" | "denied">;
  }
}

export {};
