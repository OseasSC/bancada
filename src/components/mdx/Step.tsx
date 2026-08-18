import type { ReactNode } from "react";

export function Step({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="text-base font-medium">{title}</h3>
      <div className="mt-2 space-y-3 text-[15px] leading-7 text-ink/90">
        {children}
      </div>
    </div>
  );
}
