'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

/**
 * Composant pour monitorer les Core Web Vitals en temps réel
 * Affiche les métriques dans la console en dev
 * Envoie les métriques à une API en prod (optionnel)
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // En développement, afficher dans la console
    if (process.env.NODE_ENV === 'development') {
      const emoji = getEmoji(metric.name, metric.value);
      const label = getLabel(metric.name, metric.value);
      
      console.log(
        `${emoji} ${metric.name}: ${Math.round(metric.value)}${getUnit(metric.name)} ${label}`
      );
    }

    // En production, tu peux envoyer à une API de monitoring
    // Exemples: Vercel Analytics, Google Analytics, etc.
    if (process.env.NODE_ENV === 'production') {
      // Option 1: Vercel Analytics (déjà installé)
      // Géré automatiquement par @vercel/speed-insights

      // Option 2: Google Analytics 4
      // if (window.gtag) {
      //   window.gtag('event', metric.name, {
      //     value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      //     event_category: 'Web Vitals',
      //     event_label: metric.id,
      //     non_interaction: true,
      //   });
      // }

      // Option 3: API custom
      // fetch('/api/analytics', {
      //   method: 'POST',
      //   body: JSON.stringify(metric),
      //   headers: { 'Content-Type': 'application/json' }
      // });
    }
  });

  // Afficher un panneau de debug en dev
  if (process.env.NODE_ENV === 'development') {
    return <WebVitalsDebugPanel />;
  }

  return null;
}

/**
 * Panneau de debug pour visualiser les métriques en temps réel (dev only)
 */
function WebVitalsDebugPanel() {
  useEffect(() => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                   🚀 WEB VITALS MONITOR                   ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Les métriques s'afficheront dans la console au fur      ║
║  et à mesure de la navigation.                            ║
║                                                           ║
║  🎯 Objectifs Google Discover:                            ║
║     • FCP < 1.8s                                          ║
║     • LCP < 2.5s                                          ║
║     • CLS < 0.1                                           ║
║     • INP < 200ms                                         ║
║     • TTFB < 600ms                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
  }, []);

  return null;
}

function getEmoji(name: string, value: number): string {
  const thresholds = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    INP: { good: 200, needsImprovement: 500 },
    TTFB: { good: 600, needsImprovement: 1800 },
    FID: { good: 100, needsImprovement: 300 },
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return '📊';

  if (value <= threshold.good) return '🟢';
  if (value <= threshold.needsImprovement) return '🟡';
  return '🔴';
}

function getLabel(name: string, value: number): string {
  const thresholds = {
    FCP: { good: 1800, needsImprovement: 3000 },
    LCP: { good: 2500, needsImprovement: 4000 },
    CLS: { good: 0.1, needsImprovement: 0.25 },
    INP: { good: 200, needsImprovement: 500 },
    TTFB: { good: 600, needsImprovement: 1800 },
    FID: { good: 100, needsImprovement: 300 },
  };

  const threshold = thresholds[name as keyof typeof thresholds];
  if (!threshold) return '';

  if (value <= threshold.good) return '✅ Excellent';
  if (value <= threshold.needsImprovement) return '⚠️ À améliorer';
  return '❌ Mauvais';
}

function getUnit(name: string): string {
  if (name === 'CLS') return '';
  return 'ms';
}

export default WebVitals;
