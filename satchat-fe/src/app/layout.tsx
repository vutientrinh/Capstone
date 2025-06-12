"use client";

import Script from "next/script";
import { Provider } from "react-redux";
import { store } from "../store/config";
import "./globals.css";
import { MessagePopup } from "@/components/message-popup";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/context/auth-context";
import { Spinner } from "@/components/spinner";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { SearchDialog } from "@/components/search-dialog";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hiddenRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/admin",
    "/oauth2/redirect",
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          <Spinner>
            <MessagePopup />
            <AuthProvider>
              {!hiddenRoutes.includes(pathname) && <Navbar />}
              <HelmetProvider>{children}</HelmetProvider>
            </AuthProvider>
            <SearchDialog />
          </Spinner>
        </Provider>
        <Script
          src="https://unpkg.com/@mahozad/theme-switch@1.5.2/dist/theme-switch.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
