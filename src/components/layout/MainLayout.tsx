import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
  showSearch?: boolean;
  showFooter?: boolean;
}

export default function MainLayout({
  children,
  showSearch = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar showSearch={showSearch} />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}