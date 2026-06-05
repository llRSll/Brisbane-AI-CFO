import Image from "next/image";
import { branding } from "@/lib/branding";

type EventLogoProps = {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
};

const sizeMap = {
  sm: { image: 36, title: "text-lg", tagline: "text-xs" },
  md: { image: 48, title: "text-2xl", tagline: "text-sm" },
  lg: { image: 64, title: "text-4xl", tagline: "text-base" },
} as const;

const EventLogo = ({
  size = "md",
  showTagline = true,
  className = "",
}: EventLogoProps) => {
  const sizes = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.png"
        alt={`${branding.name} logo`}
        width={sizes.image}
        height={sizes.image}
        className="h-auto w-auto shrink-0"
        priority
      />
      <div className="text-left">
        <p className={`font-bold tracking-tight text-ink ${sizes.title}`}>
          {branding.name}
        </p>
        {showTagline ? (
          <p className={`text-ink-muted ${sizes.tagline}`}>
            &ldquo;{branding.tagline}&rdquo;
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default EventLogo;
