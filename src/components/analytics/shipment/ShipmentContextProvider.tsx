import { createContext, useContext, useState } from 'react';
import { useShipmentAnalytics } from './useShipmentAnalytics';

type AnalyticsView = 'resilience' | 'status' | 'geo';
type ComparisonMode = 'absolute' | 'relative';

interface ShipmentContextType {
  view: AnalyticsView;
  setView: (view: AnalyticsView) => void;
  comparison: ComparisonMode;
  setComparison: (mode: ComparisonMode) => void;
  metrics: ReturnType<typeof useShipmentAnalytics>['metrics'];
  charts: ReturnType<typeof useShipmentAnalytics>['charts'];
  geo: ReturnType<typeof useShipmentAnalytics>['geo'];
  error: Error | null;
  isLoading: boolean;
}

const ShipmentContext = createContext<ShipmentContextType | null>(null);

export const ShipmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [view, setView] = useState<AnalyticsView>('resilience');
  const [comparison, setComparison] = useState<ComparisonMode>('absolute');
  
  const analytics = useShipmentAnalytics();
  
  const value = {
    view,
    setView,
    comparison,
    setComparison,
    ...analytics
  };

  return (
    <ShipmentContext.Provider value={value}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useShipmentContext = () => {
  const context = useContext(ShipmentContext);
  if (!context) {
    throw new Error('useShipmentContext must be used within a ShipmentProvider');
  }
  return context;
};
