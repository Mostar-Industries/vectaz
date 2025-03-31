
import { Shipment } from "@/types/deeptrack";

// Interface for decision engine criteria weights
export interface CriteriaWeights {
  cost: number;
  time: number;
  reliability: number;
}

// Simple decision engine implementation
export class DecisionEngine {
  private shipmentData: Shipment[] = [];
  private isInitialized: boolean = false;

  constructor() {}
  
  /**
   * Initialize the decision engine with shipment data
   * @param data The shipment data to use for decision making
   * @returns true if initialization was successful, false otherwise
   */
  initialize(data: Shipment[]): boolean {
    if (!data || data.length === 0) {
      console.error("Cannot initialize engine with empty data");
      return false;
    }
    
    this.shipmentData = data;
    this.isInitialized = true;
    console.log(`Decision engine initialized with ${data.length} records`);
    return true;
  }
  
  /**
   * Check if the engine is initialized with data
   * @returns true if the engine is initialized, false otherwise
   */
  isReady(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Get the current shipment data
   * @returns Array of shipment data
   */
  getShipmentData(): Shipment[] {
    return this.shipmentData;
  }
}

// Create singleton instance of the decision engine
export const decisionEngine = new DecisionEngine();
