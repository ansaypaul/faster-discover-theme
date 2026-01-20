"use client";

import { Logo } from "./Logo";

interface LogoWrapperProps {
  className?: string;
}

export const LogoWrapper = ({ className }: LogoWrapperProps) => {
  return <Logo className={className} />;
};

export default LogoWrapper; 