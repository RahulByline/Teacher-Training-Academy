import React from 'react';
import { Building } from 'lucide-react';
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

const SchoolCard: React.FC<SchoolCardProps> = ({
  image,
  name,
  description,
  location,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      // --- CHANGES START ---
      // Increased min/max width for a larger card, and updated margins
      className="rounded-3xl shadow-xl bg-white overflow-hidden relative min-w-[400px] max-w-md mx-5 my-8 flex flex-col border border-gray-200 hover:shadow-2xl transition-shadow"
      // --- CHANGES END ---
    >
      {/* Image with overlay */}
      {/* --- CHANGES START --- */}
      {/* Increased height of the image container */}
      <div className="relative h-80 w-full flex items-center justify-center">
      {/* --- CHANGES END --- */}
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-auto w-full object-cover"
            onError={(e) => {
              // Handle image error if needed
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
            {/* --- CHANGES START --- */}
            {/* Increased size of the fallback icon */}
            <Building className="w-20 h-20 opacity-90 mb-3" />
            {/* --- CHANGES END --- */}
            <span className="text-lg font-medium">No Logo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
      </div>

      {/* Card Content */}
      {/* --- CHANGES START --- */}
      {/* Increased padding for the content section */}
      <div className="absolute bottom-0 left-0 w-full z-20 px-8 pb-8">
        {/* Increased font size for the name */}
        <h3 className="font-extrabold text-2xl text-white mb-2 text-left drop-shadow-lg">{name}</h3>
        {/* --- CHANGES END --- */}
        {description && (
          // --- CHANGES START ---
          // Increased font size and line-clamp for the description
          <p className="text-gray-100 text-base mb-4 text-left leading-relaxed drop-shadow-lg line-clamp-3">
            {description}
          </p>
          // --- CHANGES END ---
        )}
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-200 text-base flex items-center">
            {location}
          </span>
        </div>
        {/* --- CHANGES START --- */}
        {/* Increased button padding for a larger click area */}
        <button className="bg-white text-gray-900 font-bold px-8 py-3 rounded-xl shadow hover:bg-gray-100 transition w-full">
        {/* --- CHANGES END --- */}
          View Details
        </button>
      </div>
    </motion.div>
  );
};

export default SchoolCard;