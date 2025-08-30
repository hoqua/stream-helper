import './globals.css';

export const metadata = {
  title: 'Stream Consumer - Vercel Integration',
  description: 'Real-time data streaming integration for Vercel projects',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
