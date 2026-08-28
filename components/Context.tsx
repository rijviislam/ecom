"use client";

import { ShopProvider } from "@/context/ShopContext";
import useLenis from "@/hooks/useLenis";
import type { ReactNode } from "react";

const Context = ({ children }: { children: ReactNode }) => {
  useLenis();

  return (
    <ShopProvider>
      <div className="content-wrapper">{children}</div>
    </ShopProvider>
  );
};
export default Context;
