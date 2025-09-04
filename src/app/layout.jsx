import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./admin/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Research Portfolio",
  description: "Academic research portfolio showcasing projects, publications, and achievements",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} data-theme="dark">
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
