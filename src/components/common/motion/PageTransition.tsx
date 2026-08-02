import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  routeKey: string;
}

export default function PageTransition({ children }: Props) {
  return <>{children}</>;
}
