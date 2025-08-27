import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import HomePage from "../home/HomePage";

export default async function MainPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return <HomePage />;
}
