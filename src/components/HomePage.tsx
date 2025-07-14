import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { HeroSection } from './home/HeroSection';
import { AboutSection } from './home/AboutSection';
import { CoursesSection } from './home/CoursesSection';
import { AccessSection } from './home/AccessSection';
import { Header } from './home/Header';
import { Footer } from './home/Footer';
import { LoginModal } from './LoginModal';
import { UserRole } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setSelectedRole(null);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header />
      
      <main>
        <HeroSection />
        <AboutSection />
        <CoursesSection />
        <AccessSection onRoleSelect={handleRoleSelect} />
      </main>

      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        selectedRole={selectedRole}
      />
    </div>
  );
};