import { useQuery } from '@tanstack/react-query';
import { fetchShipmentAnalytics } from '../../api/shipments';

export const useShipmentAnalytics = () => {
  const { data } = useQuery({
    queryKey: ['shipment-analytics'],
    queryFn: fetchShipmentAnalytics
  });
  
  const [view, setView] = useState('resilience');
  
  return {
    data,
    view,
    setView
  };
};
