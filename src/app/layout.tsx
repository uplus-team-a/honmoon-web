import { Header } from "../features/common";
import "../shared/styles/globals.css";

/**
 * 애플리케이션 루트 레이아웃
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="icon"
          href="https://storage.googleapis.com/honmoon-bucket/image/favicon.ico"
        />
      </head>
      <body>
        <Header />
        <main className="relative z-20">{children}</main>
      </body>
    </html>
  );
}
