import "./globals.css";

export const metadata = {
  title: "Autonomia Market Intelligence",
  description: "AI market intelligence, public tenders, training and freelance missions.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true
    }
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
