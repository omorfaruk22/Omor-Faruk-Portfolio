import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Providers from "@/components/Providers";
import { getPortfolioData } from "@/lib/portfolio-store";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolioData();
  const title = `${profile.name} | ${profile.title}`;
  let metadataBase: URL;
  try {
    metadataBase = new URL(profile.siteUrl);
  } catch {
    metadataBase = new URL("http://localhost:3000");
  }

  return {
    metadataBase,
    title,
    description: profile.seoDescription,
    openGraph: {
      title,
      description: profile.seoDescription,
      type: "website",
      url: profile.siteUrl,
      siteName: profile.name,
    },
    twitter: {
      card: "summary",
      title,
      description: profile.seoDescription,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#050805",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const data = await getPortfolioData();
  const { profile, socials } = data;
  const title = `${profile.name} | ${profile.title}`;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: `mailto:${profile.email}`,
    url: profile.siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    sameAs: socials
      .filter((s) => s.icon !== "email" && !s.href.startsWith("mailto:"))
      .map((s) => s.href),
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    url: profile.siteUrl,
  };

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
        />
        <Providers initialData={data}>{children}</Providers>
      </body>
    </html>
  );
}
