import { Inter } from "next/font/google";
import "./globals.css";
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Epoch Africa",
  description: "The career turning point you need",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={inter.className}>
      <Analytics/>
      <SpeedInsights/>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
