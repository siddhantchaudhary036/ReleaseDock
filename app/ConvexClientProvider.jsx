"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import SyncUser from "./SyncUser";

export default function ConvexClientProvider({ children }) {
  const convex = useMemo(
    () => new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL),
    []
  );

  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      <SyncUser />
      {children}
    </ConvexProviderWithClerk>
  );
}
