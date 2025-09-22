import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stian Wilhelmsen - Fullstack Developer",
  description: "Portfolio of Stian Wilhelmsen, a Fullstack Developer",
};

const LOCALES = ["en", "no"] as const;
export function generateStaticParams() {
  return LOCALES.map((lng) => ({ lng }));
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
