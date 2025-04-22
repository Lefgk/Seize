"use client";
import Footer from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden">
      <Navbar />
      <div className="w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col">
          {children}
        </div>
        <Footer />
      </div>


    </div>
  );
};

export default AppProvider;
