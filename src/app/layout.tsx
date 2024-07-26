import { NextUIProvider } from "@nextui-org/react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "File Drop Storage",
  description: "A simple file storage application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextUIProvider>
          <main className="dark text-foreground bg-background">{children}</main>
        </NextUIProvider>
      </body>
    </html>
  );
}
