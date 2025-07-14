import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { HeroSection } from '../components/home/HeroSection';
import { AboutSection } from '../components/home/AboutSection';
import { CoursesSection } from '../components/home/CoursesSection';
import { SchoolsSection } from '../components/home/SchoolsSection';
import { AssessmentSection } from '../components/home/AssessmentSection';
import { CourseBrowserSection } from '../components/home/CourseBrowserSection';
import { RoleLoginSection } from '../components/home/RoleLoginSection';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/home/Footer';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <main>
        <HeroSection />
        <AboutSection />
        <CourseBrowserSection />
        <SchoolsSection />
        <AssessmentSection />
        <RoleLoginSection />
      </main>

      <Footer />
    </div>
  );
};