import React, { useRef, useEffect } from 'react';
import { School } from '../../types';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import SchoolCard from './SchoolCard';

interface SchoolsCarouselProps {
  schools: School[];
}

const SchoolsCarousel: React.FC<SchoolsCarouselProps> = ({ schools }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Data received by SchoolsCarousel:', schools);
  }, [schools]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!schools || schools.length === 0) {
    return <div>Loading schools...</div>;
  }

  return (
    <div className="relative px-4">
      {/* Left Button */}
      <button
        aria-label="Scroll Left"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full shadow p-2 hover:bg-blue-100 dark:hover:bg-blue-700 transition"
        onClick={() => scroll('left')}
        style={{ display: schools.length > 2 ? 'block' : 'none' }}
      >
        <ChevronLeft className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </button>

      {/* Carousel */}
      <div
        ref={scrollRef}
        // --- CHANGE START ---
        // Changed "scrollbar-hide" to "no-scrollbar" to match your index.css file.
        className="flex gap-6 overflow-x-auto no-scrollbar py-4"
        // --- CHANGE END ---
        style={{
          scrollBehavior: 'smooth',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        {schools.map((school) => (
          <SchoolCard
            key={school.id}
            image={school.logo}
            name={school.name}
            description={school.description}
            country={school.country}
            location={school.city ? `${school.city}${school.country ? ', ' + school.country : ''}` : school.country}
            rating={4.9}
          />
        ))}
      </div>

      {/* Right Button */}
      <button
        aria-label="Scroll Right"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full shadow p-2 hover:bg-blue-100 dark:hover:bg-blue-700 transition"
        onClick={() => scroll('right')}
        style={{ display: schools.length > 2 ? 'block' : 'none' }}
      >
        <ChevronRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </button>
    </div>
  );
};

export default SchoolsCarousel;