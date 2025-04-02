
import React, { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const KonamiCodeEasterEgg: React.FC = () => {
  const { toast } = useToast();

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Activate pirate mode
          toast({
            title: "🏴‍☠️ Pirates of the Caribbean Mode Activated",
            description: "Yarr! Your shipments be sailing the seven seas now, matey!",
            duration: 5000,
          });
          
          // Add pirate hat to the logo
          const logo = document.querySelector('.app-logo');
          if (logo) {
            const pirateHat = document.createElement('div');
            pirateHat.className = 'absolute -top-8 left-1/2 transform -translate-x-1/2 text-3xl';
            pirateHat.textContent = '🏴‍☠️';
            logo.appendChild(pirateHat);
          }
          
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toast]);

  return null;
};

export default KonamiCodeEasterEgg;
