"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useEffect } from "react";

export default function SyncUser() {
  const { isSignedIn, user } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (!isSignedIn || !user) return;

    syncUser({
      clerkId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? "",
      name: user.fullName ?? undefined,
      imageUrl: user.imageUrl ?? undefined,
    });
  }, [isSignedIn, user, syncUser]);

  return null;
}
