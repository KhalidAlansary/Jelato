import { Footer } from "./footer";
import { Navigation } from "./navigation";
import { Providers } from "./providers";
import favicon from "@public/favicon.ico";
import Head from "next/head";
import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Jelato</title>
        <link rel="icon" type="image/x-icon" href={favicon.src} />
        <meta
          name="description"
          content="Buy and sell ice cream flavours smoothly"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </Head>
      <Providers>
        <div className="min-h-screen flex flex-col" role="document">
          <Navigation />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </Providers>
    </>
  );
}
