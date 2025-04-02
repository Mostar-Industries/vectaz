
import { useState, useEffect } from 'react';
import { useDeepCalEngineStore, DeepSightAlert } from '@/store/deepcalEngineStore';

export function useDeepSightAlerts() {
  const { insights, dismissAlert, fetchDeepSightAlerts } = useDeepCalEngineStore();
  const [currentAlert, setCurrentAlert] = useState<DeepSightAlert | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  // Fetch alerts when the hook is first used
  useEffect(() => {
    fetchDeepSightAlerts();
    
    // Set up polling every 5 minutes
    const interval = setInterval(() => {
      fetchDeepSightAlerts();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [fetchDeepSightAlerts]);
  
  // Show the highest priority undismissed alert
  useEffect(() => {
    const undismissedAlerts = insights.filter(alert => !alert.dismissed);
    
    if (undismissedAlerts.length > 0) {
      // Sort by severity (high, medium, low) and then by timestamp (newest first)
      const sortedAlerts = [...undismissedAlerts].sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 };
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        
        if (severityDiff !== 0) {
          return severityDiff;
        }
        
        // If same severity, show newer alerts first
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
      
      const highestPriorityAlert = sortedAlerts[0];
      
      // Only show alert if it's different from the current one or if no alert is shown
      if (!currentAlert || highestPriorityAlert.id !== currentAlert.id) {
        setCurrentAlert(highestPriorityAlert);
        
        // Automatically open the alert modal for high severity alerts
        if (highestPriorityAlert.severity === 'high') {
          setIsAlertOpen(true);
        }
      }
    } else {
      setCurrentAlert(null);
      setIsAlertOpen(false);
    }
  }, [insights, currentAlert]);
  
  // Function to handle alert dismissal
  const handleDismissAlert = () => {
    if (currentAlert) {
      dismissAlert(currentAlert.id);
      setIsAlertOpen(false);
      
      // Find the next alert to show, if any
      const remainingAlerts = insights.filter(
        alert => !alert.dismissed && alert.id !== currentAlert.id
      );
      
      if (remainingAlerts.length > 0) {
        setCurrentAlert(remainingAlerts[0]);
      } else {
        setCurrentAlert(null);
      }
    }
  };
  
  return {
    currentAlert,
    isAlertOpen,
    setIsAlertOpen,
    dismissAlert: handleDismissAlert,
    hasAlerts: insights.filter(alert => !alert.dismissed).length > 0,
    alertCount: insights.filter(alert => !alert.dismissed).length,
  };
}
