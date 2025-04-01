
export interface LoadingPhase {
  name: string;
  messages: string[];
}

export const loadingPhases: LoadingPhase[] = [
  {
    name: 'Core Initialization',
    messages: [
      'Initializing DeepCAL Core',
      'Establishing Quantum Network',
      'Calibrating Decision Engine'
    ]
  },
  {
    name: 'Data Verification',
    messages: [
      'Verifying Base Dataset Integrity',
      'Loading AHP Matrix',
      'Optimizing N-TOPSIS Algorithms'
    ]
  },
  {
    name: 'Network Sync',
    messages: [
      'Connecting to Supabase Cloud',
      'Syncing Remote Data Nodes',
      'Aligning Neutrosophic Vectors'
    ]
  },
  {
    name: 'Final Checks',
    messages: [
      'Running Integrity Verification',
      'Preparing Runtime Environment',
      'Finalizing System Boot Sequence'
    ]
  }
];
