import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dāsa Bodhini (ದಾಸ ಬೋಧಿನಿ) — Haridasa Sahitya Decoded",
  description: "Bilingual reader unlocking sentence syntax, classical vocabulary roots, and practical philosophy of Haridasa compositions.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn">
      <body>{children}</body>
    </html>
  );
}
