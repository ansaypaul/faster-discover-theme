import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "@/components/layout/ClientLayout"
import { BuildInfoProvider } from "@/components/common/BuildInfo"
import { getBuildInfo } from "@/lib/buildInfo"
import { SpeedInsights } from "@vercel/speed-insights/next"
import WebVitals from "@/components/common/WebVitals"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "World of Geeks - Gaming, Esport & Tech",
  description: "Découvrez toute l'actualité du jeu vidéo, esport, mangas et high-tech sur World of Geeks",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // En dehors des pages dynamiques, on utilise un timestamp par défaut
  const buildInfo = getBuildInfo();

  return (
    <html lang="fr">
      <head>
        {/* Préconnexion aux domaines externes pour gagner du temps */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Préconnexion WordPress & Images (réduit les chaînes réseau) */}
        <link rel="preconnect" href="https://worldofgeek.fr" />
        <link rel="dns-prefetch" href="https://i0.wp.com" />
        <link rel="dns-prefetch" href="https://secure.gravatar.com" />
        
        {/* Flux RSS/Atom pour agrégateurs et Google Discover */}
        <link rel="alternate" type="application/rss+xml" title="World of Geeks RSS Feed" href="https://worldofgeek.fr/feed.xml" />
        <link rel="alternate" type="application/atom+xml" title="World of Geeks Atom Feed" href="https://worldofgeek.fr/atom.xml" />
      </head>
      <body className={inter.className}>
        <BuildInfoProvider timestamp={buildInfo.timestamp} renderType={buildInfo.renderType}>
          <ClientLayout>{children}</ClientLayout>
        </BuildInfoProvider>
        
        {/* Monitoring des Core Web Vitals */}
        <SpeedInsights />
        <WebVitals />
      </body>
    </html>
  )
}
