"use client";

import useLenis from "@/app/hooks/useLenis";
import type { ReactNode } from "react";

const Context = ({ children }: { children: ReactNode }) => {
  useLenis();

  return <div className="content-wrapper">{children}</div>;
};
export default Context;
