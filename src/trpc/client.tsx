"use client";
// 🎯 Yeh directive batata hai ki yeh component client-side render hoga
// Next.js 13+ App Router mein server components by default hote hain
// But yahan providers setup kar rahe hain jo browser mein chahiye

// 📦 IMPORTS SECTION
import type { QueryClient } from "@tanstack/react-query"; // 🔍 Type import - QueryClient ka type
import { QueryClientProvider } from "@tanstack/react-query"; // 🏠 TanStack Query provider
import { createTRPCClient, httpBatchLink } from "@trpc/client"; // 🚀 tRPC client creation tools
import { createTRPCContext } from "@trpc/tanstack-react-query"; // 🔗 tRPC + React Query integration
import { useState } from "react"; // ⚛️ React hook state ke liye
import { makeQueryClient } from "./query-client"; // 🏭 Custom QueryClient factory function
import type { AppRouter } from "./routers/_app"; // 📋 tRPC router types
import SuperJSON from "superjson";

// 🎭 tRPC Context create kar rahe hain - yeh magic hai jo type safety provide karta hai
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

// 🌐 BROWSER QUERY CLIENT - Global variable for browser-side caching
let browserQueryClient: QueryClient;

// 🏭 QUERY CLIENT FACTORY FUNCTION
function getQueryClient() {
  // 🖥️ Server-side check - agar server pe hain toh always new client banao
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  }

  // 🌐 Browser-side logic
  // Browser: make a new query client if we don't already have one
  // 🚨 This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// 🔗 URL CONFIGURATION FUNCTION
function getUrl() {
  const base = (() => {
    // 💤 Browser mein hain? - Empty string use karo (relative URL)
    if (typeof window !== "undefined") return "";

    // 🏠 Local development - Default localhost
    return process.env.NEXT_PUBLIC_APP_URL;
  })();

  // 🎯 Final tRPC endpoint URL
  return `${base}/api/trpc`;
}

// 🎪 MAIN PROVIDER COMPONENT - Yeh sab kuch wrap karta hai
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode; // 👶 Child components
  }>
) {
  // 🏭 QueryClient setup - Server aur client ke liye different strategy
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient();

  // 🚀 tRPC Client setup - useState mein wrap kiya hai to avoid re-creation
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
           transformer: SuperJSON, //<-- agar data transformer use karte hain
          url: getUrl(), // 🌐 API endpoint URL
        }),
      ],
    })
  );

  // 🎁 Double Provider Pattern - QueryClient + tRPC Provider
  return (
    <QueryClientProvider client={queryClient}>
      {/* 🏠 TanStack Query Provider - Caching aur data management */}
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {/* 🚀 tRPC Provider - Type-safe API calls */}
        {props.children} {/* 👶 Saare child components */}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

/*
🔥 DETAILED BREAKDOWN:

🎯 PURPOSE:
Yeh file tRPC aur TanStack Query ko setup karta hai for full-stack type safety

🏗️ ARCHITECTURE:
1️⃣ QueryClient: Caching aur state management
2️⃣ tRPC Client: Type-safe API communication
3️⃣ Providers: Context provide karte hain app ke liye

🌍 SERVER vs CLIENT HANDLING:
- Server: New QueryClient har request pe (stateless)
- Client: Single QueryClient instance (persistent cache)

🔗 URL RESOLUTION:
- Development: http://localhost:3000/api/trpc
- Production: https://your-vercel-url.com/api/trpc
- Browser: /api/trpc (relative)

⚡ PERFORMANCE OPTIMIZATIONS:
- httpBatchLink: Multiple requests ko batch karta hai
- QueryClient caching: Duplicate requests avoid karta hai
- useState: Client re-creation prevent karta hai

🎪 PROVIDER NESTING:
QueryClientProvider (outer) > TRPCProvider (inner) > Your App

💡 USAGE:
App.tsx mein yeh provider wrap karo, phir anywhere use kar sakte ho:
const { data } = trpc.getUsers.useQuery();
*/
