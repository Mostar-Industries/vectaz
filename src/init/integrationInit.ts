
import { toast } from '@/hooks/use-toast';
import { syncFrontendWithBackend } from '@/utils/syncUtility';

/**
 * Initializes the integration between frontend and backend
 */
export const initializeIntegration = async (): Promise<void> => {
  try {
    console.log('Initializing frontend-backend integration...');
    
    // Sync the frontend with the backend
    const syncResult = await syncFrontendWithBackend();
    
    if (syncResult) {
      console.log('Frontend-backend integration initialized successfully');
    } else {
      console.warn('Frontend-backend integration initialization had issues');
      toast({
        title: 'Integration Warning',
        description: 'Some components may not work correctly due to integration issues',
        variant: 'default',
      });
    }
  } catch (error) {
    console.error('Failed to initialize frontend-backend integration:', error);
    toast({
      title: 'Integration Error',
      description: 'Failed to initialize frontend-backend integration',
      variant: 'destructive',
    });
  }
};

// Export syncFrontendWithBackend to make it available
export { syncFrontendWithBackend } from '@/utils/syncUtility';
