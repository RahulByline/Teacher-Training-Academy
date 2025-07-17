import React from 'react';

interface LoginLayoutProps {
  leftContent: React.ReactNode;
  rightContent: React.ReactNode;
}

const LoginLayout: React.FC<LoginLayoutProps> = ({ leftContent, rightContent }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('/background_image.png')" }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0" />
      <div className="relative z-10 w-full max-w-5xl mx-auto h-[700px] flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">
        {/* Left Side */}
        <div className="flex-1 flex flex-col justify-center p-10 text-white bg-transparent">
          {leftContent}
        </div>
        {/* Right Side */}
        <div className="flex-1 flex flex-col justify-center p-10 bg-black bg-opacity-50 backdrop-blur-md min-w-[350px]">
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default LoginLayout; 