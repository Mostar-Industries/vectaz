#!/usr/bin/env python3
"""DeepCAL CLI – Validate Neutrosophic-AHP + TOPSIS decision

This script loads (mock) shipment decision-matrix data, derives criteria weights
via neutrosophic AHP, applies TOPSIS ranking, then validates every output using
calculation_validator.  A JSON snapshot is written to the engine logs folder.

Usage (all flags optional):
  python cli_validate_decision.py \
      --matrix data/decision_matrix.csv \
      --criteria "Cost,Reliability,Responsiveness" \
      --strict

If --strict is passed the script exits with code 1 on any validation error.
"""
from __future__ import annotations

import argparse
import sys
import os
import json
from datetime import datetime
from pathlib import Path
from typing import List, Dict

# --- Local imports ---------------------------------------------------------
# Allow running this script directly regardless of cwd
CUR_DIR = Path(__file__).resolve().parent
if str(CUR_DIR) not in sys.path:
    sys.path.insert(0, str(CUR_DIR))

try:
    # Local engine modules (same folder)
    import utils as engine_utils
    from weighting import CriteriaWeighting
    from ranking import AlternativeRanking
    from feedback import FeedbackLoop  # optional demonstration
except ImportError as e:  # pragma: no cover
    print("[ERR] Could not import engine modules – ensure you're running from repository root.")
    raise

# Validation helpers (one directory up)
VALIDATOR_PATH = CUR_DIR.parent / "utils" / "calculation_validator.py"
if VALIDATOR_PATH.exists():
    sys.path.insert(0, str(VALIDATOR_PATH.parent))
    from calculation_validator import (
        validate_matrix,
        validate_weights,
        validate_scores,
        validate_all,
        snapshot_decision,
    )
else:  # pragma: no cover
    raise RuntimeError("calculation_validator.py not found – cannot continue")

# ---------------------------------------------------------------------------
DEFAULT_CRITERIA = ["Cost", "Reliability", "Responsiveness"]
DEFAULT_TNN: Dict[tuple[str, str], tuple[float, float, float]] = {
    ("Cost", "Reliability"): (0.3, 0.1, 0.6),
    ("Cost", "Responsiveness"): (0.7, 0.1, 0.2),
    ("Reliability", "Responsiveness"): (0.8, 0.1, 0.1),
}
BENEFIT_FLAGS = {"Cost": False, "Reliability": True, "Responsiveness": True}
FORWARDERS = ["A", "B", "C", "D"]

# ---------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="DeepCAL Decision Validation CLI")
    p.add_argument(
        "--matrix",
        help="Path to decision-matrix CSV (defaults to built-in mock)",
        default="data/decision_matrix.csv",
    )
    p.add_argument(
        "--criteria",
        help="Comma-separated list of criteria (default: Cost,Reliability,Responsiveness)",
    )
    p.add_argument(
        "--strict",
        action="store_true",
        help="Exit with non-zero status code if any validation fails",
    )
    return p.parse_args()


def load_decision_matrix(path: str) -> List[List[float]]:
    """Wrapper around engine_utils.load_decision_matrix() with fail-safe."""
    if os.path.exists(path):
        return engine_utils.load_decision_matrix(path).tolist()
    # Fallback to utils default (numpy array) then convert -> list
    return engine_utils.load_decision_matrix().tolist()


def main():
    args = parse_args()

    criteria = (
        [c.strip() for c in args.criteria.split(",") if c.strip()]
        if args.criteria
        else DEFAULT_CRITERIA
    )

    print("📥 Loading decision matrix …")
    matrix = load_decision_matrix(args.matrix)
    print(f"Loaded matrix shape: {len(matrix)}x{len(matrix[0]) if matrix else 0}")

    print("🧮 Deriving criteria weights using Neutrosophic AHP …")
    weight_engine = CriteriaWeighting(criteria, DEFAULT_TNN)
    weights = weight_engine.compute_weights()
    weights_dict = dict(zip(criteria, [float(w) for w in weights]))
    print("Weights:", {k: round(v, 4) for k, v in weights_dict.items()})

    print("⚖️  Running TOPSIS ranking …")
    rank_engine = AlternativeRanking(criteria, weights, BENEFIT_FLAGS)
    rank_engine.load_alternatives(FORWARDERS, engine_utils.np.array(matrix))
    results = rank_engine.rank()
    print("Results (descending):")
    for i, (name, score) in enumerate(results, 1):
        print(f"  {i}. {name}  —  Ci = {score:.4f}")

    print("🔍 Validating outputs …")
    scores = [float(score) for _, score in results]
    valid_all = validate_all(matrix, weights_dict, scores)
    print("Validation status:")
    print("  Matrix valid:       ", validate_matrix(matrix))
    print("  Weights sum to 1:   ", validate_weights(weights_dict))
    print("  Scores within [0,1]:", validate_scores(scores))

    if valid_all:
        print("✅ ALL VALID – snapshotting decision artefacts …")
        log_metadata = {
            "criteria": criteria,
            "generator": "cli_validate_decision.py",
            "timestamp": datetime.utcnow().isoformat(),
        }
        snapshot_decision(matrix, weights_dict, scores, FORWARDERS, metadata=log_metadata)
        print("Snapshot saved in logs/ folder.")
    else:
        print("❌ Validation failed – snapshot skipped.")
        if args.strict:
            sys.exit(1)

    # Optional feedback demonstration
    feedback = FeedbackLoop()
    feedback.update_on_performance("C", success=False)


if __name__ == "__main__":
    main()
