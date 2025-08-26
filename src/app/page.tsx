// "use client";

// import HomePage from "@/app/home/HomePage";
// // import { Button } from "@/components/ui/button";
// import { useState, useEffect } from "react";
// import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export default async function Home() {
//   // const [timeLeft, setTimeLeft] = useState({
//   //   days: 7,
//   //   hours: 23,
//   //   minutes: 45,
//   //   seconds: 30,
//   // });

//   // useEffect(() => {
//   //   const timer = setInterval(() => {
//   //     setTimeLeft((prev) => {
//   //       if (prev.seconds > 0) {
//   //         return { ...prev, seconds: prev.seconds - 1 };
//   //       } else if (prev.minutes > 0) {
//   //         return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
//   //       } else if (prev.hours > 0) {
//   //         return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
//   //       } else if (prev.days > 0) {
//   //         return {
//   //           ...prev,
//   //           days: prev.days - 1,
//   //           hours: 23,
//   //           minutes: 59,
//   //           seconds: 59,
//   //         };
//   //       }
//   //       return prev;
//   //     });
//   //   }, 1000);

//   //   return () => clearInterval(timer);
//   // }, []);

//   const session = await getServerSession(authOptions);
//   if (session) {
//     redirect("/dashboard");
//   } else {
//     redirect("/home");
//     // <HomePage />;
//   }

//   // return (
//   //   <section>
//   //     <HomePage/>
//   //   </section>
//   // );
// }

import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/home");
}
