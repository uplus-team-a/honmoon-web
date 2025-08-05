import {Header} from "../features/common";
import "../shared/styles/globals.css";

/**
 * 애플리케이션 루트 레이아웃
 */
export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        <body>
        <Header/>
        <main>{children}</main>
        </body>
        </html>
    );
}
