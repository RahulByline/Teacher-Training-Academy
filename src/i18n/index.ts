import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Navigation
      home: 'Home',
      about: 'About',
      courses: 'Courses',
      schools: 'Schools',
      assessment: 'Assessment',
      access: 'Access',
      login: 'Login',
      logout: 'Logout',
      
      // Hero Section
      heroTitle: 'Transform Education Through Excellence',
      heroSubtitle: 'Empowering teachers with world-class training programs',
      exploreBtn: 'Explore Courses',
      getStarted: 'Get Started',
      
      // About Section
      aboutTitle: 'About Riyada Academy',
      aboutDescription: 'Leading the future of education through structured role-based learning and comprehensive teacher development programs.',
      
      // Course Categories
      coursesTitle: 'Course Categories',
      coursesSubtitle: 'Discover our comprehensive training programs',
      
      // Schools Section
      partneredSchools: 'Partnered Schools',
      schoolsSubtitle: 'Excellence in education across the region',
      
      // Assessment Section
      assessmentTitle: 'AI-Powered Assessment & Learning Pathways',
      assessmentSubtitle: 'Take our comprehensive assessment to receive personalized course recommendations',
      
      // Access Areas
      accessTitle: 'Access Your Dashboard',
      accessSubtitle: 'Select your role to continue',
      
      // Login
      loginTitle: 'Welcome Back',
      username: 'Username',
      password: 'Password',
      loginBtn: 'Log in',
      lostPassword: 'Lost password?',
      firstTime: 'Is this your first time here?',
      createAccount: 'Create new account',
      
      // Dashboard Common
      welcome: 'Welcome back',
      dashboard: 'Dashboard',
      profile: 'Profile',
      settings: 'Settings',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      download: 'Download',
    }
  },
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      about: 'حول',
      courses: 'الدورات',
      schools: 'المدارس',
      assessment: 'التقييم',
      access: 'الوصول',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
      
      // Hero Section
      heroTitle: 'تحويل التعليم من خلال التميز',
      heroSubtitle: 'تمكين المعلمين ببرامج تدريبية عالمية المستوى',
      exploreBtn: 'استكشف الدورات',
      getStarted: 'ابدأ الآن',
      
      // About Section
      aboutTitle: 'حول أكاديمية ريادة',
      aboutDescription: 'قيادة مستقبل التعليم من خلال التعلم المنظم القائم على الأدوار وبرامج تطوير المعلمين الشاملة.',
      
      // Course Categories
      coursesTitle: 'فئات الدورات',
      coursesSubtitle: 'اكتشف برامجنا التدريبية الشاملة',
      
      // Schools Section
      partneredSchools: 'المدارس الشريكة',
      schoolsSubtitle: 'التميز في التعليم عبر المنطقة',
      
      // Assessment Section
      assessmentTitle: 'التقييم المدعوم بالذكاء الاصطناعي ومسارات التعلم',
      assessmentSubtitle: 'خذ تقييمنا الشامل لتلقي توصيات دورات مخصصة',
      
      // Access Areas
      accessTitle: 'الوصول إلى لوحة التحكم',
      accessSubtitle: 'اختر دورك للمتابعة',
      
      // Login
      loginTitle: 'مرحباً بعودتك',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      loginBtn: 'تسجيل الدخول',
      lostPassword: 'نسيت كلمة المرور؟',
      firstTime: 'هل هذه المرة الأولى هنا؟',
      createAccount: 'إنشاء حساب جديد',
      
      // Dashboard Common
      welcome: 'مرحباً بعودتك',
      dashboard: 'لوحة التحكم',
      profile: 'الملف الشخصي',
      settings: 'الإعدادات',
      
      // Common
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      save: 'حفظ',
      cancel: 'إلغاء',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      download: 'تحميل',
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;