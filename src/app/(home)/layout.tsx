interface Props {
  children: React.ReactNode;
}

import { Navbar } from "@/modules/home/ui/components/navbar";
import React from "react";

const Layout = ({ children }: Props) => {
  return (
    <main className="flex flex-col min-h-screen">
      <Navbar/>
      <div className="fixed inset-0 -z-10 bg-white dark:bg-gray-950" />

      {/* Glassy dot pattern - grey tones */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle,_rgba(156,163,175,0.4)_1px,_transparent_1px)] dark:bg-[radial-gradient(circle,_rgba(75,85,99,0.5)_1px,_transparent_1px)] [background-size:20px_20px]" />

      {/* Content */}
      <div className="flex flex-1 flex-col px-4 pb-4">{children}</div>
    </main>
  );
};

export default Layout;
