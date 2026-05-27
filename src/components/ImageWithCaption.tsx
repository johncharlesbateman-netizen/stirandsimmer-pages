import { cn } from "@/lib/utils";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  subcaption?: string;
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape" | "wide";
  priority?: boolean;
  floatDelay?: number;
}

const aspectRatioClasses = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

const floatClasses = [
  "floating-item",
  "floating-item-delay-1",
  "floating-item-delay-2",
  "floating-item-delay-3",
  "floating-item-delay-4",
  "floating-item-delay-5",
];

const ImageWithCaption = ({
  src,
  alt,
  caption,
  subcaption,
  className,
  aspectRatio = "landscape",
  priority = false,
  floatDelay = 0,
}: ImageWithCaptionProps) => {
  const floatClass = floatClasses[floatDelay % floatClasses.length];
  
  return (
    <figure className={cn("group relative", floatClass, className)}>
      <div
        className={cn(
          "overflow-hidden bg-muted",
          aspectRatioClasses[aspectRatio]
        )}
      >
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          width={1200}
          height={900}
          className="w-full h-full object-cover editorial-image"
        />
      </div>
      
      {(caption || subcaption) && (
        <figcaption className="mt-4 space-y-1">
          {caption && (
            <p className="micro-caption">{caption}</p>
          )}
          {subcaption && (
            <p className="text-sm text-muted-foreground italic font-display">
              {subcaption}
            </p>
          )}
        </figcaption>
      )}
    </figure>
  );
};

export default ImageWithCaption;
