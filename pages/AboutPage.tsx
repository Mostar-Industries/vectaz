import React from "react";
import { GlassContainer } from '@/components/ui/glass-effects';
import AnimatedBackground from '@/components/home/AnimatedBackground';
import { motion } from "framer-motion";

const ReasoningFlow = () => {
  return (
    <div className="my-16">
      <h2 className="text-[#00FFD1] text-2xl mb-8 text-center font-semibold">DeepCAL Cognitive Reasoning Flow</h2>
      <div className="flex flex-wrap justify-center gap-8">
        {[
          "Data Intake & Validation",
          "SHA256 Versioned Lineage",
          "Neutrosophic AHP Weight Calculation",
          "TOPSIS Ranking & Scoring",
          "Self-Learning Feedback Loop",
          "DeepTalk Conversational AI",
        ].map((stage, index) => (
          <motion.div
            key={index}
            className="bg-gradient-to-br from-[#00FFD1]/20 to-[#004455]/30 backdrop-blur-md border border-[#00FFD1]/20 shadow-xl rounded-2xl p-6 w-72 text-center text-gray-300"
            whileHover={{ scale: 1.08 }}
          >
            {stage}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const FirebaseDataIntake = () => {
  return (
    <div className="my-16">
      <h2 className="text-[#00FFD1] text-2xl mb-4 text-center font-semibold">Data Intake & Validation Layer (Phase 1)</h2>
      <p className="text-gray-400 text-center max-w-4xl mx-auto text-lg">
        CSV datasets are validated for missing fields, unit normalization, outlier correction, and cryptographically versioned using SHA256 lineage hashing. Upon successful validation, data is written to Firestore with full auditability.
      </p>
    </div>
  );
};

const DeepEngineKernel = () => {
  return (
    <div className="my-16">
      <h2 className="text-[#00FFD1] text-2xl mb-4 text-center font-semibold">Engine Kernel Preparation</h2>
      <p className="text-gray-400 text-center max-w-4xl mx-auto text-lg">
        The Core Algorithm (deepcal_core.py) operates Neutrosophic AHP-TOPSIS scoring, Grey intervals, pairwise matrices, score crispification, distance calculations and closeness coefficients with deterministic transparency.
      </p>
    </div>
  );
};

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden relative bg-gradient-to-bl from-[#050C1B] to-[#0A1A2F]">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-gradient-to-bl from-[#050C1B] to-[#0A1A2F] z-0" />
      <div className="relative z-10 w-full pt-24 px-6">
        <div className="max-w-6xl mx-auto">
          <GlassContainer className="mb-12 p-8 shadow-2xl">
            <h1 className="text-4xl font-extrabold text-center text-[#00FFD1] tracking-wide">DeepCAL: Cognitive Emergency Logistics</h1>
            <p className="text-lg text-center text-gray-300 mt-4 max-w-3xl mx-auto">
              DeepCAL is a field-proven, deterministic decision support platform built for humanitarian logistics under extreme uncertainty. Powered by explainable symbolic reasoning, scientific rigor, and operational resilience.
            </p>
          </GlassContainer>

          <div className="bg-gradient-to-br from-[#131C2B]/70 to-[#0D1A30]/80 backdrop-blur-md rounded-3xl p-10 border border-[#00FFD1]/20 shadow-2xl">
            <h2 className="text-[#00FFD1] text-2xl font-semibold mb-6">Mission Protocol: No Data, No Feature</h2>
            <p className="text-gray-300 mb-8 text-lg">
              DeepCAL enforces absolute data validation discipline. Without confirmed datasets, computations are fully locked, guaranteeing every decision is rooted in traceable evidence.
            </p>

            <h2 className="text-[#00FFD1] text-2xl font-semibold mb-6">Symbolic Reasoning Pipeline</h2>
            <ul className="list-disc pl-8 text-gray-300 mb-8 space-y-2 text-lg">
              <li>Versioned CSV Intake (SHA256 lineage integrity)</li>
              <li>Validation, normalization & outlier corrections</li>
              <li>Neutrosophic AHP multi-criteria weight calculation</li>
              <li>TOPSIS scoring via closeness coefficients</li>
              <li>Real-time self-learning & performance adjustments</li>
              <li>Conversational AI integration (DeepTalk)</li>
            </ul>

            <ReasoningFlow />
            <FirebaseDataIntake />
            <DeepEngineKernel />

            <h2 className="text-[#00FFD1] text-2xl font-semibold mb-6">Unique Differentiators</h2>
            <ul className="list-disc pl-8 text-gray-300 mb-8 space-y-2 text-lg">
              <li>Auditability-first architecture (full determinism)</li>
              <li>Field-ready offline operation with async sync</li>
              <li>Self-reinforcing adaptive reasoning with each shipment</li>
              <li>Transparent publishable methodology (scientific-grade)</li>
              <li>Compliance-grade audit trails (NGOs, donors, regulators)</li>
            </ul>

            <h2 className="text-[#00FFD1] text-2xl font-semibold mb-6">Mission Impact Field Use</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Tested under real-world humanitarian field conditions: cross-border crisis logistics, disrupted supply routes, offline-first refugee operations, and disaster response simulations.
            </p>

            <h2 className="text-[#00FFD1] text-2xl font-semibold mb-6">Scientific Integrity & Publication Readiness</h2>
            <p className="text-gray-300 mb-8 text-lg">
              DeepCAL conforms to strict reproducibility: Saaty's CR validation, fully documented scoring formulas, versioned data lineage, and transparent audit logs enabling publishable scientific outputs.
            </p>

            <h2 className="text-[#00FFD1] text-2xl font-semibold mb-6">Contact & Credits</h2>
            <p className="text-gray-300 text-lg">
              Powered by Mostar Industries. For deployment, partnership or academic collaborations, contact the DeepCAL Systems Engineering Core.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;