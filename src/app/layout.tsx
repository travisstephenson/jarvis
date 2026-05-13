import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "LegalScan — Scan your credit report for legally disputable errors",
  description:
    "An educational tool that guides you through your credit report, identifies inaccuracies under the FCRA, and generates dispute letters. No subscriptions. No scams.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f9fafb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh flex flex-col">
        <StoreProvider>
          <Nav />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
