import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** Rendered height in pixels; width follows the logo's 1603×562 aspect ratio. */
  height?: number;
  className?: string;
  priority?: boolean;
}

const ASPECT = 1603 / 562;

export function BrandLogo({ height = 40, className, priority = false }: BrandLogoProps) {
  const width = Math.round(height * ASPECT);
  return (
    <Image
      src="/vista-logo.png"
      alt="Vista Eye Specialist"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto select-none", className)}
      style={{ height, width }}
    />
  );
}
