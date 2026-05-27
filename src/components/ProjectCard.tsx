import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  className?: string;
  size?: "default" | "large" | "featured";
  floatDelay?: number;
}

const sizeClasses = {
  default: "aspect-[4/3]",
  large: "aspect-[3/4]",
  featured: "aspect-[16/10]",
};

const floatClasses = [
  "floating-item",
  "floating-item-delay-1",
  "floating-item-delay-2",
  "floating-item-delay-3",
  "floating-item-delay-4",
  "floating-item-delay-5",
];

const ProjectCard = ({
  title,
  category,
  description,
  image,
  className,
  size = "default",
  floatDelay = 0,
}: ProjectCardProps) => {
  const floatClass = floatClasses[floatDelay % floatClasses.length];
  
  return (
    <div
      className={cn(
        "group block",
        floatClass,
        className
      )}
    >
      <article className="space-y-5">
        <div
          className={cn(
            "overflow-hidden bg-muted relative",
            sizeClasses[size]
          )}
        >
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            width={800}
            height={600}
            className="w-full h-full object-cover editorial-image"
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
        </div>
        
        <div className="space-y-2">
          <p className="micro-caption">{category}</p>
          <h3 className="font-display text-xl md:text-2xl">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </article>
    </div>
  );
};

export default ProjectCard;
