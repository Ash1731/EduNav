// app/layout.jsx
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Inter, Roboto_Mono } from "next/font/google";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Roboto_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EduNav",
  description: "Find the right college for you - Real reviews, Real guidance",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="font-sans bg-background text-foreground min-h-dvh">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
