import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ಪಶ್ಚಾತ್ಯ-ಅನ್ವಯ | Dasa Sahitya Decrypter",
  description: "Decode Haridasa compositions into modern Kannada, English syntax, and allegories",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kn">
      <body>{children}</body>
    </html>
  );
}
