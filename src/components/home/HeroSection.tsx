import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronLeft, ChevronRight, Play, BookOpen, Users, Award } from 'lucide-react';
import { Button } from '../ui/Button';

const heroSlides = [
  {
    title: 'Transform Education Through Excellence',
    subtitle: 'Empowering teachers with world-class training programs',
    image: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1200',
    stats: { teachers: '10,000+', courses: '500+', completion: '95%' }
  },
  {
    title: 'Interactive Learning Experiences',
    subtitle: 'Engaging ILT, VILT, and self-paced learning modules',
    image: 'https://images.pexels.com/photos/5212700/pexels-photo-5212700.jpeg?auto=compress&cs=tinysrgb&w=1200',
    stats: { sessions: '2,000+', trainers: '200+', satisfaction: '98%' }
  },
  {
    title: 'Comprehensive Assessment System',
    subtitle: 'AI-powered learning pathways and competency mapping',
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1200',
    stats: { assessments: '1,500+', pathways: '300+', accuracy: '92%' }
  }
];

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
          >
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60"></div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`${isRTL ? 'text-right' : 'text-left'} text-white`}
          >
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            >
              {t('heroTitle')}
            </motion.h1>
            
            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-blue-100"
            >
              {t('heroSubtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Play className="w-5 h-5" />
                {t('exploreBtn')}
              </Button>
              
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                {t('getStarted')}
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-6"
            >
              {Object.entries(heroSlides[currentSlide].stats).map(([key, value], index) => (
                <div key={key} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {value}
                  </div>
                  <div className="text-sm text-blue-200 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Interactive Elements */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-white"
              >
                <BookOpen className="w-12 h-12 mb-4 text-yellow-300" />
                <h3 className="text-lg font-semibold mb-2">500+ Courses</h3>
                <p className="text-sm text-blue-100">Comprehensive training modules</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-white mt-8"
              >
                <Users className="w-12 h-12 mb-4 text-green-300" />
                <h3 className="text-lg font-semibold mb-2">10,000+ Teachers</h3>
                <p className="text-sm text-blue-100">Empowered educators</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 text-white -mt-4"
              >
                <Award className="w-12 h-12 mb-4 text-purple-300" />
                <h3 className="text-lg font-semibold mb-2">95% Success Rate</h3>
                <p className="text-sm text-blue-100">Proven results</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute ${isRTL ? 'right-4' : 'left-4'} top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200`}
      >
        {isRTL ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
      </button>
      
      <button
        onClick={nextSlide}
        className={`absolute ${isRTL ? 'left-4' : 'right-4'} top-1/2 transform -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all duration-200`}
      >
        {isRTL ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};