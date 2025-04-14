import type React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-1 container py-8">{children}</main>;
}
