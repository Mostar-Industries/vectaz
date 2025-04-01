
# 🚀 Welcome to the DeepCAL Project  
### *by Mostar Industries – Precision. Trust. Resilience.*

---

## 🧠 Project Overview

**DeepCAL** (Decision Engine for Emergency Logistics) is an intelligent multi-criteria freight forwarder evaluator. It leverages **Neutrosophic AHP-TOPSIS algorithms** to rank forwarders based on uncertainty-aware factors like:

- 💸 **Cost**
- 📦 **Reliability**
- ⚡ **Responsiveness**

This repository hosts the application logic, decision engine, and full-stack integration powered by:

- ⚙️ TypeScript + React  
- 🧪 Python Neutrosophic Models  
- 🔗 Supabase (data, auth, storage)  
- 🌀 Tailwind CSS & shadcn-ui

---

## 🛠️ Editing the DeepCAL Code

There are several ways to work with this codebase:

---

### 🧩 1. Edit in Your IDE (Recommended)

Clone and run locally for full control and flexibility.

```bash
# Step 1: Clone the repo
git clone <YOUR_GIT_URL>

# Step 2: Enter the project
cd deepcal

# Step 3: Install dependencies
npm install

# Step 4: Start development mode
npm run dev
```

---

🚨 **IMPORTANT INSTRUCTIONS FOR BUILDERS** 🚨

1. **DO NOT remove or refactor `algorithm.ts`.** This powers DeepCAL's intelligence layer.
2. Analytics tabs must call live functions and state (see `src/store/baseState.ts`)—no mock data.
3. Update metrics in each tab only after confirming results from live Supabase data.
4. Use functions in `/lib/analytics/` like `computeShipmentInsights()` for all KPIs.
5. Any changes to layout or data structure must be reviewed against `/src/core/engine.ts`.

If unsure, run diagnostics via DeepTalk → "Is the algorithm live?"

---

## 🤖 Key Components

- **Core Engine**: Implements AHP-TOPSIS methodology for decision making
- **Analytics Dashboard**: Visualizes shipment data and performance metrics
- **DeepTalk**: AI-powered assistant for logistics queries
- **Decision Support**: Provides recommendations for freight forwarder selection

---

## 💻 Development Guidelines

1. **Keep Algorithm Logic Intact**: The core algorithm in `/lib/algorithm.ts` must remain unchanged unless you fully understand the mathematics behind it.
2. **Use Live Data**: Always pull from the Zustand state store for analytics and computations, never hardcode metrics.
3. **Maintain Type Safety**: Follow the TypeScript interfaces defined in `/types/deeptrack.ts`.
4. **Component Structure**: Keep components small and focused. Use custom hooks for shared logic.
5. **Testing Changes**: Validate any changes against the expected output from the core algorithm.

---

## 🧪 Testing

Run tests to ensure all components are functioning correctly:

```bash
npm test
```

For more detailed documentation, see the project wiki.
