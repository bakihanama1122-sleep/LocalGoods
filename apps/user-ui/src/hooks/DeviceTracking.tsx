"use client"

import { useEffect, useState } from "react";
import { UAParser } from "ua-parser-js";

const useDeviceTracking = () => {
  const [deviceInfo, setDeviceInfo] = useState<string>("Desktop - Unknown OS - Unknown Browser");

  useEffect(() => {
    try {
      const parser = new UAParser();
      const result = parser.getResult();

      const deviceType = result.device.type || "Desktop";
      const os = `${result.os.name || "Unknown OS"} ${result.os.version || ""}`.trim();
      const browser = `${result.browser.name || "Unknown Browser"} ${result.browser.version || ""}`.trim();

      setDeviceInfo(`${deviceType} - ${os} - ${browser}`);
    } catch (err) {
      console.error("Device tracking failed:", err);
    }
  }, []);

  return deviceInfo;
};

export default useDeviceTracking;
