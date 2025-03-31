# py_engine/main.py
from deepcal_engine.weighting import CriteriaWeighting
from deepcal_engine.ranking import AlternativeRanking
from deepcal_engine.feedback import FeedbackLoop
from deepcal_engine.utils import load_decision_matrix, validate_input, log_decision, explain_to_human

import time
from datetime import datetime

# Constants
CRITERIA = ["Cost", "Reliability", "Responsiveness"]
BENEFIT_CRITERIA = {"Cost": False, "Reliability": True, "Responsiveness": False}
TNN_JUDGMENTS = {
    ("Cost", "Reliability"): (0.3, 0.1, 0.6),
    ("Cost", "Responsiveness"): (0.7, 0.1, 0.2),
    ("Reliability", "Responsiveness"): (0.8, 0.1, 0.1)
}

FORWARDERS = ["A", "B", "C", "D"]


def run_deepcal_simulation():
    # Load and validate decision matrix
    decision_matrix = load_decision_matrix()
    if not validate_input(decision_matrix):
        print("Invalid input data. Aborting.")
        return

    # Step 1: Weight Derivation
    weight_engine = CriteriaWeighting(CRITERIA, TNN_JUDGMENTS)
    weights = weight_engine.compute_weights()

    # Step 2: TOPSIS Ranking
    rank_engine = AlternativeRanking(CRITERIA, weights, BENEFIT_CRITERIA)
    rank_engine.load_alternatives(FORWARDERS, decision_matrix)
    results = rank_engine.rank()

    # Step 3: Feedback Learning
    feedback = FeedbackLoop()
    feedback.update_on_performance("C", success=False)

    # Step 4: Log and Display
    timestamp = datetime.utcnow().isoformat()
    log_decision(CRITERIA, weights, results, timestamp=timestamp)

    print("\n📦 DeepCAL Freight Forwarder Ranking")
    print("------------------------------------")
    for i, (name, score) in enumerate(results, start=1):
        print(f"{i}. Forwarder {name} — Closeness Score: {score:.4f}")

    print("\nWeights Used:", dict(zip(CRITERIA, [round(w, 3) for w in weights])))
    print("\n🧠 Explaining the Decision Like You're Five:")
    explanation = explain_to_human(CRITERIA, weights, results)
    print(explanation)


if __name__ == "__main__":
    try:
        while True:
            run_deepcal_simulation()
            time.sleep(20)
    except KeyboardInterrupt:
        print("\nSimulation manually stopped.")
