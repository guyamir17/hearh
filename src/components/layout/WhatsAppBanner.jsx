import { MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { staticClient } from '@/api/staticClient';

export default function WhatsAppBanner() {
  const { data: settings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const all = await staticClient.entities.SiteSettings.list();
      return all[0] || {};
    }
  });

  const whatsappNumber = settings?.whatsapp_number || '972525321994';
  const buttonText = settings?.whatsapp_button_text || 'שאלות? דברו איתנו';
  const message = settings?.whatsapp_message || 'שלום, פניתי מאתר הארה';
  const position = settings?.whatsapp_position || 'left';
  const showOn = settings?.whatsapp_show_on || 'all';
  
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  // Visibility classes based on settings
  let visibilityClass = '';
  if (showOn === 'desktop') visibilityClass = 'hidden lg:flex';
  else if (showOn === 'mobile') visibilityClass = 'flex lg:hidden';
  else visibilityClass = 'flex';

  const positionClass = position === 'right' ? 'right-5' : 'left-5';

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-5 ${positionClass} z-40 ${visibilityClass} items-center gap-2 bg-[#25D366] text-white px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
    >
      <MessageCircle className="w-5 h-5" />
      <span className="font-medium text-sm hidden sm:inline">{buttonText}</span>
    </a>
  );
}