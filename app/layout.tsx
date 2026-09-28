import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { profile } from "@/data/profile";
import { socials } from "@/data/socials";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const title = `${profile.name} | ${profile.title}`;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title,
  description: profile.seoDescription,
  openGraph: { title, description: profile.seoDescription, type: "website", url: profile.siteUrl, siteName: profile.name },
  twitter: { card: "summary", title, description: profile.seoDescription },
};

export const viewport: Viewport = { themeColor: "#050805", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    url: profile.siteUrl,
    address: { "@type": "PostalAddress", addressLocality: "Cox's Bazar", addressCountry: "Bangladesh" },
    sameAs: socials.filter((s) => s.id !== "email").map((s) => s.href),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: title, url: profile.siteUrl };

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
