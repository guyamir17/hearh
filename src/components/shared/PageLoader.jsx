import { Lightbulb } from 'lucide-react';

export default function PageLoader({ isInitial = false }) {
  if (isInitial) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e3a5f] to-[#2a4a6f] z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#d4af37]/30 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
              <Lightbulb className="w-20 h-20 text-[#d4af37]" strokeWidth={2} />
            </div>
          </div>
          
          {/* Text */}
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Heebo, sans-serif' }}>
            הארה
          </h1>
        </div>

        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Loader Animation */}
        <div className="relative w-16 h-16">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-[#1e3a5f]/20 rounded-full"></div>
          {/* Spinning Ring */}
          <div className="absolute inset-0 border-4 border-transparent border-t-[#1e3a5f] border-r-[#4a90a4] rounded-full animate-spin"></div>
          {/* Inner Dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-[#1e3a5f] rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="flex items-center gap-1">
          <span className="text-[#1e3a5f] font-medium">טוען</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#1e3a5f] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#4a90a4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-1.5 h-1.5 bg-[#1e3a5f] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}