import type { ReactNode } from "react";

export function Warning({ children }: { children?: ReactNode }) {
  return (
    <aside className="border-l-2 border-warning bg-warning/5 px-4 py-3 text-sm leading-6">
      {children}
    </aside>
  );
}
