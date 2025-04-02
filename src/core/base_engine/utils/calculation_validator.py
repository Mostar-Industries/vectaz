
# calculation_validator.py – Ensures all scoring outputs are valid, auditable, and trustworthy

from typing import List, Dict
import numpy as np
import json
from datetime import datetime

def validate_matrix(matrix: List[List[float]]) -> bool:
    if not matrix or not isinstance(matrix[0], list):
        return False
    num_cols = len(matrix[0])
    return all(isinstance(row, list) and len(row) == num_cols for row in matrix)

def validate_weights(weights: Dict[str, float]) -> bool:
    total = sum(weights.values())
    return abs(total - 1.0) <= 0.05  # allow tiny float imprecision

def validate_scores(scores: List[float]) -> bool:
    return all(0.0 <= s <= 1.0 for s in scores)

def snapshot_decision(matrix, weights, scores, forwarders, metadata=None):
    now = datetime.utcnow().isoformat()
    log = {
        "timestamp": now,
        "matrix": matrix,
        "weights": weights,
        "scores": scores,
        "forwarders": forwarders,
        "engine_version": "v1.0.0",
        "metadata": metadata or {}
    }
    with open(f"logs/decision_snapshot_{now}.json", "w") as f:
        json.dump(log, f, indent=2)

def validate_all(matrix, weights, scores):
    return (
        validate_matrix(matrix) and
        validate_weights(weights) and
        validate_scores(scores)
    )
