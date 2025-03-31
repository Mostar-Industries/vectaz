
import { create } from 'zustand';
import { Shipment } from '@/types/deeptrack';
import { CriteriaWeights } from '@/core/engine';

// Define the state store interface
interface BaseDataStore {
  // Data state
  shipmentData: Shipment[];
  isDataLoaded: boolean;
  dataSource: string | null;
  dataVersion: string | null;
  dataHash: string | null;
  
  // User preferences
  criteriaWeights: CriteriaWeights;
  
  // Operations
  setShipmentData: (data: Shipment[], source: string, version: string, hash: string) => void;
  clearData: () => void;
  setCriteriaWeights: (weights: CriteriaWeights) => void;
  
  // Queries
  hasSyncedFrom: (source: string) => boolean;
  hasMockData: () => boolean;
}

// Create the store
export const useBaseDataStore = create<BaseDataStore>((set, get) => ({
  // Initial state
  shipmentData: [],
  isDataLoaded: false,
  dataSource: null,
  dataVersion: null,
  dataHash: null,
  
  criteriaWeights: {
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  },
  
  // Action to set shipment data
  setShipmentData: (data, source, version, hash) => set({
    shipmentData: data,
    isDataLoaded: true,
    dataSource: source,
    dataVersion: version,
    dataHash: hash
  }),
  
  // Action to clear data
  clearData: () => set({
    shipmentData: [],
    isDataLoaded: false,
    dataSource: null,
    dataVersion: null,
    dataHash: null
  }),
  
  // Action to set criteria weights
  setCriteriaWeights: (weights) => set({
    criteriaWeights: weights
  }),
  
  // Query to check if data is synced from a specific source
  hasSyncedFrom: (source) => {
    const state = get();
    return state.isDataLoaded && state.dataSource === source;
  },
  
  // Query to check if data is mocked
  hasMockData: () => {
    const state = get();
    return state.isDataLoaded && state.dataSource?.includes('mock');
  }
}));

// File guard function that throws error if data is not properly loaded
export const guardBaseData = () => {
  const store = useBaseDataStore.getState();
  
  if (!store.isDataLoaded) {
    throw new Error("System locked: Base data not loaded.");
  }
  
  if (store.hasMockData()) {
    throw new Error("DeepCAL cannot operate on mock or synthetic data.");
  }
  
  // If we get here, the data is valid and the system can operate
  return true;
};
