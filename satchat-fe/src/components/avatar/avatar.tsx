import { cn } from "@/lib";
import Image from "next/image";

interface AvatarProps {
  size?: number;
  src?: string;
  alt: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size,
  className,
}) => (
  <div className="relative">
    <Image
      width={size ? size : 44}
      height={size ? size : 44}
      src={src ? src : "/img/avatar_default.jpg"}
      alt={alt}
      style={{
        minHeight: size ? size : 44,
        maxHeight: size ? size : 44,
        minWidth: size ? size : 44,
      }}
      loading="lazy"
      className={cn("rounded-full object-cover bg-neutral-100", className)}
    />
  </div>
);
