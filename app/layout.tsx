import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AppShell } from '@/components/navigation/AppShell';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BrandMemory — Editorial Provenance AI Platform',
  description: 'Multi-tenant SaaS platform grounding generative marketing content in verified brand documents and clinical provenance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="h-full bg-background text-on-surface antialiased overflow-hidden">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
