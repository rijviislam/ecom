"use client";

import useLenis from "@/hooks/useLenis";
import type { ReactNode } from "react";

const Context = ({ children }: { children: ReactNode }) => {
  useLenis();

  return <div className="content-wrapper">{children}</div>;
};
export default Context;
