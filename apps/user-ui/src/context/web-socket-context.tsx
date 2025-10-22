"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

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
    if (!user?.id || ws) {
      // Also prevent re-connecting if ws already exists
      console.log("RETURNING FRoM WEBSOCKET USEEFFECT")
      return;
    }


    const newSocket = new WebSocket(process.env.NEXT_PUBLIC_CHATTING_WEBSOCKET_URI!);
    
    // ✅ STEP 2: Update the state with the new socket instance.
    // This triggers a re-render and updates the context value.
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
        if (data.type === "UNSEEN_COUNT_UPDATE") {

          console.log("Received WS Message:", data);

        if (data.type === "NEW_MESSAGE") {
          setLastMessage(data.payload); // Update state for all components
        }
          const [conversationId, count] = data.payload;
          setUnreadCounts((prev) => ({ ...prev, [conversationId]: count }));
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
      console.error("⛔️ WEBSOCKET PROVIDER UNMOUNTING! Cleaning up connection...");
      newSocket.close();
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
