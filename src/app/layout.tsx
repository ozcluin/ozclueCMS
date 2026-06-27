import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { cookies } from 'next/headers';
import Sidebar from "@/components/Sidebar";
import LoginScreen from "@/components/LoginScreen";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OzClu Admin — Verification & Screening Portal",
  description: "Internal operations dashboard for OzClu Verification Services.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  const adminEmail = session ? session.value : '';
  const isAuthenticated = 
    adminEmail === 'pkumar@cluso.in' || 
    adminEmail === 'indiaops@cluso.in' || 
    adminEmail === 'pkumar@ozclu.com';
  
  // Set up profile details based on logged-in admin
  const isPravin = adminEmail === 'pkumar@cluso.in' || adminEmail === 'pkumar@ozclu.com';
  const adminName = isPravin ? 'Pravin Kumar' : 'India Operations';
  const adminAvatar = isPravin ? 'PK' : 'IO';
  const adminRole = isPravin ? 'Super Admin' : 'Operations Lead';

  if (!isAuthenticated) {
    return (
      <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
        <head>
          <script dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
              })()
            `
          }} />
        </head>
        <body>
          <LoginScreen />
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const theme = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            })()
          `
        }} />
      </head>
      <body>
        <div className="app-container">
          <Sidebar 
            adminEmail={adminEmail}
            adminName={adminName}
            adminAvatar={adminAvatar}
            adminRole={adminRole}
          />
          <div className="main-wrapper">
            <header className="header">
              <h2 className="header-title">Verification Operations Portal</h2>
              <div className="header-meta">
                <span className="badge badge-active" style={{ marginRight: 'var(--space-2)' }}>Live DB Sync</span>
                <ThemeToggle />
              </div>
            </header>
            <main className="content-body">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}

