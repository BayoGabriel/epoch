"use client"
import AnalyticsTracker from "@/components/shared/Analytics";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        <AnalyticsTracker/>
        <SessionProvider>
          <div className="">
            <Navbar/>
            {children}
            <Footer/>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
