"use client";

import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gaming-dark">{children}</main>
      <Footer />
      <Toaster />
    </>
  );
} 