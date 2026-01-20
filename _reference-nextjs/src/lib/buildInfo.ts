import { isISRCache } from './api';

let staticBuildTimestamp: string | null = null;

export type RenderType = 'isr-cache' | 'isr-generation';

export interface BuildInfo {
  timestamp: string;
  renderType: RenderType;
}

export function getBuildInfo(): BuildInfo {
  // En développement, on retourne toujours isr-generation
  if (process.env.NODE_ENV === 'development') {
    return {
      timestamp: new Date().toISOString(),
      renderType: 'isr-generation'
    };
  }

  // En production, on utilise le même timestamp pour toute la durée de vie de la page
  if (!staticBuildTimestamp) {
    staticBuildTimestamp = new Date().toISOString();
  }

  return {
    timestamp: staticBuildTimestamp,
    renderType: isISRCache() ? 'isr-cache' : 'isr-generation'
  };
} 