"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WebSocketContext = createContext<any>(null);

export const WebSocketProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) => {
  console.log("--- WebSocketProvider Rendered ---", { user: user?.id });
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [wsReady, setWsReady] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [lastMessage, setLastMessage] = useState<any | null>(null);

  useEffect(() => {
    console.log("WS useEffect running. User ID:", user?.id);
    if (!user?.id) {
      console.log("No user ID, skipping WebSocket connection");
      return;
    }

    // Check if WebSocket URI is available
    const wsUri = process.env.NEXT_PUBLIC_CHATTING_WEBSOCKET_URI;
    if (!wsUri) {
      console.error("❌ NEXT_PUBLIC_CHATTING_WEBSOCKET_URI is not defined!");
      return;
    }

    console.log("Creating WebSocket connection to:", wsUri);
    const newSocket = new WebSocket(wsUri);
    
    setWs(newSocket);
    console.log("New WebSocket instance created.");

    newSocket.onopen = () => {
      console.log("✅ WebSocket connected for user:", user.id);
      newSocket.send(`user_${user.id}`);
      setWsReady(true);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WS Message:", data);
        
        if (data.type === "UNSEEN_COUNT_UPDATE") {
          const [conversationId, count] = data.payload;
          setUnreadCounts((prev) => ({ ...prev, [conversationId]: count }));
        } else if (data.type === "NEW_MESSAGE") {
          setLastMessage(data.payload); // Update state for all components
        }
      } catch (e) {
        console.warn("Invalid WS message:", event.data);
      }
    };

    newSocket.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      setWsReady(false);
      setWs(null);
    };

    newSocket.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    return () => {
      console.log("🔌 Cleaning up WebSocket...");
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
      setWs(null);
      setWsReady(false);
    };
  }, [user?.id]);

  return (
    <WebSocketContext.Provider value={{ ws: ws, wsReady, unreadCounts,lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
