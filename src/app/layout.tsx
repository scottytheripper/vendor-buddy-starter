import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Vendor Buddy (Starter)",
  description: "Share vendor event data. Decide smarter."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header style={{marginBottom: 16}}>
            <h1>Vendor Buddy</h1>
            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/events">Events</Link>
              <Link href="/upload">Upload Report (CSV)</Link>
            </nav>
          </header>
          {children}
          <footer>Made with Next.js + Prisma • Starter MVP</footer>
        </div>
      </body>
    </html>
  );
}
