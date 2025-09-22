import { email, z } from "zod"; // 🔍 Zod library import kar rahe hain validation ke liye
import { baseProcedure, createTRPCRouter } from "../init"; // 🚀 tRPC ke basic components import kar rahe hain
import { inngest } from "@/inngest/client";

// 🏗️ Main router create kar rahe hain jisme saare API endpoints honge
export const appRouter = createTRPCRouter({
  // 👋 "hello" endpoint banaya hai - yeh public hai, koi bhi access kar sakta hai
  invoke: baseProcedure
    // 🛡️ Input validation - jo data aayega woh object hona chahiye with text property
    .input(
      z.object({
        text: z.string(), // 📝 text field string hona chahiye, warna error throw karega
      })
    )
    // ⚙️ Query handler - actual logic yahan likhte hain (GET request jaisa)
    .mutation(async ({ input }) => {
      // 📦 input mein input data milta hai, context bhi milta hai agar chahiye ho
      await inngest.send({
        name: "test/hello.world",
        data: { email: input.text },
      });
    }),

  // 📝 Yahan aur endpoints add kar sakte hain:
  // 👥 getUsers: baseProcedure.query(() => { ... }),
  // ✍️ createUser: baseProcedure.input(...).mutation(() => { ... }),
  // 🔐 getProfile: protectedProcedure.query(() => { ... }),
});

// 📋 TypeScript type export kar rahe hain - yeh bahut important hai!
// 🎯 Client-side pe full type safety milegi, IntelliSense bhi kaam karega
export type AppRouter = typeof appRouter;

/*
🚀 tRPC KYA HAI AUR KAISE KAAM KARTA HAI? 🚀

📚 DEFINITION:
tRPC (TypeScript Remote Procedure Call) ek full-stack TypeScript solution hai
jo client aur server ke beech type-safe communication provide karta hai

🔥 MAIN FEATURES:
✅ End-to-end type safety - Frontend se backend tak
✅ No API contracts/schemas - Direct function calls jaisa
✅ Auto-completion aur IntelliSense support
✅ Built-in validation with Zod
✅ Real-time subscriptions support
✅ Lightweight - No REST boilerplate

⚡ KAISE KAAM KARTA HAI:
1️⃣ Server side: Procedures define karte hain (query/mutation)
2️⃣ Types automatically generate hote hain
3️⃣ Client side: Type-safe function calls karte hain
4️⃣ Runtime mein HTTP requests bhejta hai behind the scenes

🎯 CLIENT-SIDE USAGE EXAMPLE:
// Traditional REST API 😓
const res = await fetch('/api/hello', { method: 'POST', body: JSON.stringify({text: 'world'}) });
const data = await res.json(); // ❌ No type safety

// tRPC way 🔥
const data = await trpc.hello.query({ text: 'world' }); // ✅ Full type safety!

🆚 REST API VS tRPC:
REST API 📡:
- Manual route definitions
- Separate API documentation
- No type safety by default
- More boilerplate code

tRPC 🚀:
- Type-safe by design
- Self-documenting
- Direct function calls
- Less code, more productivity

💡 BEST FOR:
- TypeScript projects
- Full-stack applications (Next.js, React + Node.js)
- Teams jo type safety chahte hain
- Rapid development aur prototyping

🎭 PROCEDURES KE TYPES:
- 🔍 Query: Data fetch karne ke liye (GET requests jaisa)
- ✏️ Mutation: Data modify karne ke liye (POST/PUT/DELETE jaisa)
- 📡 Subscription: Real-time updates ke liye (WebSockets)

Basically tRPC makes full-stack development bahut easier aur type-safe! 🎉
*/
