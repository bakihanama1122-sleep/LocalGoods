"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import useUser from "../hooks/useUser";
import { WebSocketProvider } from "../context/web-socket-context";

/**
 * Root provider for global context (React Query, Toaster, WebSocket, etc.)
 */
const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 1000 * 60 * 5,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <ProvidersWithWebSocket>
        {children}
        </ProvidersWithWebSocket>
    </QueryClientProvider>
  );
};

/**
 * Wraps children with WebSocketProvider only after user is loaded.
 */
export const ProvidersWithWebSocket = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isLoading } = useUser();
  // if (isLoading) {
  //   // You can replace this with a beautiful spinner component
  //   return (
  //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <p>Loading...</p> 
  //     </div>
  //   );
  // }
  if (isLoading || !user) {
    return <>{children}</>;
  }

  // Only initialize WebSocket after the user is known
  return user ? (
    <WebSocketProvider user={user}>{children}</WebSocketProvider>
  ) : (
    <>{children}</>
  );
};

export default Providers;
