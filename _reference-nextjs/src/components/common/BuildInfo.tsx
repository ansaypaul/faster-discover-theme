'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { RenderType } from '@/lib/buildInfo';

type BuildInfo = {
  timestamp: string;
  renderType: RenderType;
};

type BuildInfoContextType = {
  buildInfo: BuildInfo | null;
  updateBuildInfo: (info: BuildInfo) => void;
};

const BuildInfoContext = createContext<BuildInfoContextType>({
  buildInfo: null,
  updateBuildInfo: () => {}
});

export const BuildInfoProvider = ({ 
  children, 
  timestamp, 
  renderType 
}: { 
  children: React.ReactNode;
  timestamp: string;
  renderType: RenderType;
}) => {
  const [buildInfo, setBuildInfo] = useState<BuildInfo>({ timestamp, renderType });

  const updateBuildInfo = useCallback((info: BuildInfo) => {
    setBuildInfo(info);
  }, []); // Pas de dépendances car la fonction ne dépend de rien d'externe

  return (
    <BuildInfoContext.Provider value={{ 
      buildInfo, 
      updateBuildInfo
    }}>
      {children}
    </BuildInfoContext.Provider>
  );
};

export const useBuildInfo = () => {
  const context = useContext(BuildInfoContext);
  return context.buildInfo;
};

export const useUpdateBuildInfo = () => {
  const context = useContext(BuildInfoContext);
  return context.updateBuildInfo;
}; 