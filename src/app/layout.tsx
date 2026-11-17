import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trần Văn Thành — Creative Portfolio",
  description:
    "Trần Văn Thành (Vthanhh) — sinh viên Thương mại điện tử tại Đại học FPT, xây dựng sản phẩm web, AI Agents và công cụ số.",
  applicationName: "Vthanhh Creative Portfolio",
  keywords: ["Trần Văn Thành", "Vthanhh", "AI Agents", "FPT University", "E-commerce", "Software"],
  openGraph: {
    title: "Trần Văn Thành — Creative Portfolio",
    description: "Building ideas into useful digital products.",
    type: "website",
    locale: "vi_VN",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
