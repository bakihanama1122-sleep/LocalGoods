"use client"
import { useState, useEffect } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;

const getStoredLocation = () => {
  const storedData = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!storedData) return null;

  const parsedData = JSON.parse(storedData);
  const expiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
  const isExpired = Date.now() - parsedData.timestamp > expiryTime;

  return isExpired ? null : parsedData;
};

const useLocationTracking = () => {
  const [location, setLocation] = useState<{country:string,state:string,city:string} | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Reverse geocode using free service like OpenStreetMap Nominatim
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const newLocation = {
            country: data.address.country || "Unknown",
            state: data.address.state || "Unknown",
            city: data.address.city || data.address.town || data.address.village || "Unknown",
          };
          setLocation(newLocation);
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  return location;
};


export default useLocationTracking;
