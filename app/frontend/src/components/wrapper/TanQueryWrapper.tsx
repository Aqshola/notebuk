import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function TanQueryWrapper(props: Props) {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </>
  );
}
