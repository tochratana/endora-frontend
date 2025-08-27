import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">{children}</main>
      <Footer />
    </div>
  );
}
