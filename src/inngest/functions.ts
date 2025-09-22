
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);

// ! Basically hum yehi apne inngest developer server ko manage krte hai jaise yeha per line number 8 mein likha hai n 1s yedi hum 3s likh de to humko response inngest 3s baad dega to ye iska fayeda hota hai ,isiliye ye one of the best and trending tool in terms of Background jobs ke liye dekha jaye to ,aur ye raha iska docs yehi se saab kuch kr sekte ho https://www.inngest.com/docs


// ? Aur Pta hai ye isiliye market mein one of the best background job purpose ke liye tool hai n kyuki bahut time hum galti se tab close kr dete hai n then network connection lost ho jata hai but isme aisa nhi hota hai aab network connection lost ho jayega phir bhi aap content ko load kr sekte ho abhut easly way mein that's great features
