import { initializeConfiguration } from '@/services/configurationService';
import { loadAllReferenceData } from '@/services/dataIngestionService';
import { syncFrontendWithBackend } from './integrationInit';

// Boot sequence for the application
export async function bootApp() {
  try {
    // Initialize configuration
    const configInitialized = await initializeConfiguration();
    if (!configInitialized) {
      throw new Error('Failed to initialize configuration');
    }

    // Load reference data
    const referenceData = await loadAllReferenceData();
    if (Object.keys(referenceData).length === 0) {
      throw new Error('Failed to load any reference data');
    }
  } catch (error) {
    console.error('App boot failed:', error);
    // Handle boot failure (e.g., display error message to user)
    return;
  }
  
  // Initialize frontend-backend integration
  try {
    await initializeIntegration();
  } catch (error) {
    console.error('Failed to initialize frontend-backend integration:', error);
  }
  
}
