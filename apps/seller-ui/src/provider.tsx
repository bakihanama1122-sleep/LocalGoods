"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useSeller from "./hooks/useSeller";
import { WebSocketProvider } from "./context/web-socket-context";
import AuthGuard from "./components/AuthGuard";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ProvidersWithWebSocket>{children}</ProvidersWithWebSocket>
    </QueryClientProvider>
  );
};

const ProvidersWithWebSocket = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { seller } = useSeller();
  
  return (
    <AuthGuard>
      {seller && (
        <WebSocketProvider seller={seller}>{children}</WebSocketProvider>
      )}

      {!seller && children}
    </AuthGuard>
  );
};

export default Providers;
