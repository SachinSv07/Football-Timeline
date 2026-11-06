import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOOTBALL: FRACTURED — TVA Timeline Terminal",
  description: "A football what-if timeline terminal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full"
    >
      <body>{children}</body>
    </html>
  );
}
