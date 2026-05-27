import { useEffect, useRef } from "react";

interface InfiniteCarouselProps {
  images: { src: string; alt: string }[];
  speed?: number;
}

const InfiniteCarousel = ({ images, speed = 30 }: InfiniteCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;

    const scroll = () => {
      scrollPosition += 0.5;
      
      // Reset position when we've scrolled half the content (since content is duplicated)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      
      scrollContainer.scrollLeft = scrollPosition;
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationId);
  }, [speed]);

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div className="w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden h-[260px] sm:h-[400px] md:h-[500px]"
        style={{ scrollBehavior: 'auto' }}
      >
        {duplicatedImages.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-full"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-auto object-cover"
              loading={index < 4 ? "eager" : "lazy"}
              decoding="async"
              width={500}
              height={500}
            />

          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
