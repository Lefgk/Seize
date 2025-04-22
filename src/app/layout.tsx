import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import RainbowProvider from "@/contexts/RainbowProvider";
import AppProvider from "@/contexts/AppProvider";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Seize",
  description: "Ignite your vision, secure backing, and cultivate a thriving community",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
  openGraph: {
    title: "Seize",
    description: "Ignite your vision, secure backing, and cultivate a thriving community",
    images: "/logo.png",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-11557297779"
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-11557297779');
          `,
        }}
      />

      <body className={`antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=AW-11557297779"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="Google Tag Manager"
          ></iframe>
        </noscript>
        <RainbowProvider>
          <Analytics />
          <AppProvider>{children}</AppProvider>
        </RainbowProvider>{" "}
      </body>
    </html>
  );
}
