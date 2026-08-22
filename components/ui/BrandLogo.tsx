import React from "react";
import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export function BrandLogo({
  size = "md",
  href = "/",
  className = "",
}: BrandLogoProps) {
  const isLarge = size === "lg";
  const isSmall = size === "sm";

  const containerClasses = `flex items-center group cursor-pointer focus:outline-none ${
    isLarge ? "gap-2.5" : isSmall ? "gap-2" : "gap-2"
  } ${className}`;

  const boxWrapperClasses = `flex items-center justify-center bg-[#F26A3D] text-white transition-transform ${
    href ? "shadow-xs" : ""
  } ${
    isLarge
      ? "w-9 h-9 rounded-xl"
      : isSmall
        ? "w-6 h-6 rounded"
        : "w-8 h-8 rounded-lg"
  }`;

  const iconClasses = isLarge
    ? "w-[18px] h-[18px]"
    : isSmall
      ? "w-3.5 h-3.5"
      : "w-4 h-4";

  const textSize = isLarge ? "text-base" : isSmall ? "text-sm" : "text-[15px]";

  const content = (
    <>
      <div
        className={
          boxWrapperClasses + " overflow-hidden border-2 border-amber-400"
        }
      >
        <Image
          src="/logo.png"
          alt="LogicPup Logo"
          width={isLarge ? 36 : isSmall ? 24 : 32}
          height={isLarge ? 36 : isSmall ? 24 : 32}
          sizes="(max-width: 768px) 36px, 36px"
          priority={true}
          className="w-full h-full object-cover "
        />
      </div>

      <div className="flex flex-col justify-center">
        <span
          className={`font-bold ${textSize} text-[#121212] tracking-tight leading-none flex items-center gap-1.5`}
        >
          LogicPup
          {!isSmall && (
            <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded-full bg-[#287A52]/10 text-[#287A52]">
              v1.4 🐾
            </span>
          )}
        </span>

        {isLarge && (
          <span className="text-[11px] text-[#666666] font-medium mt-0.5 leading-none">
            Visual Python IDE
          </span>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={containerClasses} aria-label="LogicPup Home">
        {content}
      </Link>
    );
  }

  return <div className={containerClasses}>{content}</div>;
}
