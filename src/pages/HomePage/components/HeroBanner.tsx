import { useState, useEffect } from "react";


const SLIDES = [
    { id: 1, image: "/banner-1.png", alt: "Welcome to Booky" },
];


export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-sky-100">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {SLIDES.map((slide) => (
          <div key={slide.id} className="w-full shrink-0">
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-[200px] md:h-[320px] object-cover rounded-2xl"
              onError={(e) => {
                // Fallback placeholder banner
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.parentElement!.classList.add(
                  "flex", "items-center", "justify-center",
                  "h-[200px]", "md:h-[320px]",
                  "bg-gradient-to-br", "from-sky-200", "to-blue-400"
                );
                target.parentElement!.innerHTML = `
                  <div class="text-center px-6">
                    <h2 class="text-2xl md:text-4xl font-extrabold text-white drop-shadow-md">
                      Welcome to Booky
                    </h2>
                    <p class="text-white/80 mt-2 text-sm md:text-base font-medium">
                      Discover inspiring stories & timeless knowledge
                    </p>
                  </div>
                `;
              }}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-4 h-2 bg-primary"
                : "w-2 h-2 bg-white/60 hover:bg-white"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}