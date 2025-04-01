
import { 
  generateRiskResponse,
  generateForwarderResponse,
  generateWarehouseResponse,
  generateCostResponse,
  generateRouteResponse,
  generateTrendResponse,
  generateComparisonResponse,
  generateRecommendationsResponse,
  generateExplanationResponse,
  generateGeneralResponse
} from "./responseGenerators/index.ts";

export interface ContextData {
  shipmentData: any[];
  shipmentMetrics: any;
  forwarderPerformance: any[];
  countryPerformance: any[];
  warehousePerformance: any[];
  kpiData: any;
}

export function generateResponse(
  intent: string, 
  entities: Record<string, any>, 
  context: ContextData
): string {
  const { 
    shipmentData, 
    shipmentMetrics, 
    forwarderPerformance, 
    countryPerformance, 
    warehousePerformance,
    kpiData
  } = context;
  
  // Generate response based on intent
  switch (intent) {
    case "query_risk":
      return generateRiskResponse(shipmentData, shipmentMetrics, countryPerformance, entities);
    
    case "query_forwarder":
      return generateForwarderResponse(forwarderPerformance, entities);
    
    case "query_warehouse":
      return generateWarehouseResponse(warehousePerformance, entities);
    
    case "query_cost":
      return generateCostResponse(shipmentData, kpiData, countryPerformance, entities);
    
    case "query_route":
      return generateRouteResponse(shipmentData, countryPerformance, entities);
    
    case "query_trends":
      return generateTrendResponse(shipmentData, shipmentMetrics, entities);
    
    case "query_comparison":
      return generateComparisonResponse(shipmentData, forwarderPerformance, countryPerformance, entities);
    
    case "query_recommendations":
      return generateRecommendationsResponse(shipmentData, forwarderPerformance, countryPerformance, entities);
    
    case "query_explanation":
      return generateExplanationResponse(shipmentData, forwarderPerformance, countryPerformance, entities);
    
    case "query_general":
    default:
      return generateGeneralResponse(shipmentData, shipmentMetrics, forwarderPerformance, countryPerformance);
  }
}
