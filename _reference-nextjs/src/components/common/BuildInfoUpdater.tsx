'use client';

import { useEffect } from 'react';
import { useUpdateBuildInfo } from './BuildInfo';
import type { RenderType } from '@/lib/buildInfo';

export default function BuildInfoUpdater({
  timestamp,
  renderType
}: {
  timestamp: string;
  renderType: RenderType;
}) {
  const updateBuildInfo = useUpdateBuildInfo();

  useEffect(() => {
    updateBuildInfo({ timestamp, renderType });
  }, [timestamp, renderType, updateBuildInfo]);

  return null;
} 