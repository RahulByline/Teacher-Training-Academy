import React from 'react';
import { Building, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface SchoolCardProps {
  image?: string;
  name: string;
  description?: string;
  country?: string;
  price?: string;
  location?: string;
  rating?: number;
}

const FALLBACK_IMAGE = '/public/images/default-course.jpg';

const SchoolCard: React.FC<SchoolCardProps> = ({
  image,
  name,
  description,
  country,// default for demo
  location = 'Saudi Arabia, Dubai',  // default for demo
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-3xl shadow-xl bg-white overflow-hidden relative min-w-[320px] max-w-[370px] mx-5 my-6 flex flex-col border border-gray-200 hover:shadow-2xl transition-shadow"
    >
      {/* Image with overlay */}
      <div className="relative h-64 w-full flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            <Building className="w-16 h-16 opacity-90 mb-2" />
            <span className="text-base font-medium">No Logo</span>
          </div>
        )}
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      </div>

      {/* Card Content over image bottom */}
      <div className="absolute bottom-0 left-0 w-full z-20 px-6 pb-6">
        <h3 className="font-extrabold text-xl text-white mb-1 text-left drop-shadow-lg">{name}</h3>
        {description && (
          <div className="text-gray-100 text-sm mb-3 text-left leading-relaxed drop-shadow-lg line-clamp-2">
            {description}
          </div>
        )}
        {/* Location and rating row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-200 text-sm flex items-center">
            {location || country}
          </span>
          {/* <span className="flex items-center gap-1 text-yellow-400 font-semibold text-base bg-black/40 px-2 py-1 rounded-full">
            <Star className="w-4 h-4" />
            {rating}
          </span> */}
        </div>
        {/*View Details button */}
        <button className="bg-white text-gray-900 font-bold px-6 py-2 rounded-xl shadow hover:bg-gray-100 transition w-full">
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default SchoolCard;
