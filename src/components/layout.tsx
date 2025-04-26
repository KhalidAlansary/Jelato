import type React from "react";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import { Providers } from "./providers";
import Head from "next/head";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Jelato</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Buy and sell ice cream flavours smoothly"
        />
      </Head>
      <Providers>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          {children}
          <Footer />
        </div>
      </Providers>
    </>
  );
}
