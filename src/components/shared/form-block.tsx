import type { ReactNode } from 'react';

export function FormBlock({ children }: { children: ReactNode }) {
  return <div className="grid w-full grid-cols-2 gap-6">{children}</div>;
}
