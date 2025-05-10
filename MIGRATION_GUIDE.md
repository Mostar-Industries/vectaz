# Decision Engine Consolidation Migration Guide

## Overview
This document outlines the changes made during the decision engine consolidation and provides step-by-step instructions for migrating to the new unified `DecisionCore`.

## Key Changes
1. Consolidated 4 separate engines (deepEngine, topsisEngine, ahpModule, analyticsUtils) into single `DecisionCore`
2. Unified type definitions
3. Simplified component architecture

## Migration Steps

### 1. Decision Engine Migration
Replace:
```typescript
import { deepEngine } from '@/services/deepEngine';
import { applyTOPSIS } from '@/services/topsisEngine';
import { computeNeutrosophicWeights } from '@/services/ahpModule';
```
With:
```typescript
import { DecisionCore } from '@/core/DecisionCore';

// Usage example:
const core = new DecisionCore(shipments);
const analysis = core.analyze(); // Returns { kpis, risks, optimization }
```

### 2. Type System Updates
All types are now consolidated in `src/types/deeptrack.ts`. Update imports accordingly.

### 3. Component Updates
Components should now consume data from the unified analysis object rather than individual services.

## Timeline
- Phase 1: Core Consolidation (Complete)
- Phase 2: Component Unification (Next)
- Phase 3: Type System Migration
- Phase 4: Service Gateway Implementation

## Testing
Run the test suite after migration:
```bash
npm test
```
