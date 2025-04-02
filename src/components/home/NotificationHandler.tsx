
import React, { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotificationHandlerProps {
  isDataLoaded: boolean;
}

const NotificationHandler: React.FC<NotificationHandlerProps> = ({ isDataLoaded }) => {
  const { toast } = useToast();
  const hasNotified = useRef<boolean>(false);

  useEffect(() => {
    // Only notify once when data is loaded
    if (isDataLoaded && !hasNotified.current) {
      hasNotified.current = true;
      
      // Create audio element only when needed
      const notificationSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU...'); // Base64 audio would go here
      notificationSound.volume = 0.5;
      try {
        notificationSound.play().catch(e => console.log('Audio not allowed yet by browser'));
      } catch (e) {
        console.log('Audio playback error:', e);
      }
      
      // Notify user that system is ready with enhanced toast
      toast({
        title: "DeepCAL Ready",
        description: "System initialized successfully with verified data. Your supply chain has a PhD now.",
        duration: 5000,
      });
    }
  }, [isDataLoaded, toast]);

  return null;
};

export default NotificationHandler;
