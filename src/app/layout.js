import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bungees.in";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Bungees | Everyday Technology & Connectivity", template: "%s | Bungees" },
  description: "Explore practical connectivity products and everyday technology from Bungees, with direct support by WhatsApp, email, and phone.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website", locale: "en_IN", url: "/", siteName: "Bungees",
    title: "Bungees | Everyday Technology & Connectivity",
    description: "Practical connectivity products and everyday technology with direct support.",
    images: [{ url: "/b1.png", width: 1200, height: 630, alt: "Bungees connectivity products" }],
  },
  twitter: { card: "summary_large_image", title: "Bungees | Everyday Technology & Connectivity", description: "Practical connectivity products and everyday technology with direct support.", images: ["/b1.png"] },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
