"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  className?: string;
}

const LogoContent = () => (
  <Image 
    src="/worldofgeek-logo.svg" 
    alt="World of Geeks - L'actu geek des jeux vidéo, manga et pop culture"
    width={180}
    height={60}
    className="h-8 sm:h-10 w-auto"
    priority
  />
);

const WrapperLink = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Link href="/" className={className}>
    {children}
  </Link>
);

export const Logo = ({ className = "" }: LogoProps) => {
  // Plus de H1 dans le logo car la homepage a déjà un H1 dans le bloc de bienvenue
  return (
    <WrapperLink className={className}>
      <div className="inline-flex items-center space-x-2">
        <LogoContent />
      </div>
    </WrapperLink>
  );
};

export default Logo; 