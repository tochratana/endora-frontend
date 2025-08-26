import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HomePage from "@/app/home/HomePage";

export default async function Home() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <HomePage />;
}
