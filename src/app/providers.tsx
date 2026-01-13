"use client";

import { SessionProvider } from "next-auth/react";
import { type Session } from "next-auth";
import { TRPCReactProvider } from "@/trpc/react";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </SessionProvider>
  );
}