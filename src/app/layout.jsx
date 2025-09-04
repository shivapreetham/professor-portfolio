import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./admin/Provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { DataSyncProvider } from "@/contexts/DataSyncContext";
import { Toaster } from 'react-hot-toast';

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
        <AuthProvider>
          <DataSyncProvider>
            <Provider>
              {children}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  className: 'bg-base-100 text-base-content border border-base-300',
                }}
              />
            </Provider>
          </DataSyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
