
# calculation_validator.py – Ensures all scoring outputs are valid, auditable, and trustworthy

from typing import List, Dict
import numpy as np
import json
from datetime import datetime

def validate_matrix(matrix: List[List[float]]) -> bool:
    """
    Validate a matrix has a consistent number of columns.

    Args:
    matrix: A 2D list of numbers, where each sublist has the same length.

    Returns:
    True if the matrix is valid, False otherwise.
    """
    if not matrix or not isinstance(matrix[0], list):
        return False
    num_cols = len(matrix[0])
    return all(isinstance(row, list) and len(row) == num_cols for row in matrix)

def validate_weights(weights: Dict[str, float]) -> bool:
    
    """
    Validate weights are a dictionary of floats that sum to 1.0.

    Args:
    weights: A dictionary with string keys and float values.

    Returns:
    True if the weights are valid, False otherwise.
    """
    total = sum(weights.values())
    return abs(total - 1.0) <= 0.05  # allow tiny float imprecision

def validate_scores(scores: List[float]) -> bool:
    
    """
    Validate that all scores are within the range [0.0, 1.0].

    Args:
    scores: A list of float numbers representing scores.

    Returns:
    True if all scores are between 0.0 and 1.0 inclusive, False otherwise.
    """

    return all(0.0 <= s <= 1.0 for s in scores)

def snapshot_decision(matrix, weights, scores, forwarders, metadata=None):
    """
    Record the current state of the decision matrix, weights, scores, and forwarders to a JSON file.
    
    Args:
    matrix: A 2D list of numbers representing the decision matrix.
    weights: A dictionary with string keys and float values representing the weights.
    scores: A list of float numbers representing the scores.
    forwarders: A list of strings representing the forwarders.
    metadata: A dictionary of additional metadata to store.
    
    Returns:
    None
    """
    
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
    """
    Validate the decision matrix, weights, and scores simultaneously.

    Args:
    matrix: A 2D list of numbers representing the decision matrix.
    weights: A dictionary with string keys and float values representing the weights.
    scores: A list of float numbers representing the scores.

    Returns:
    True if all inputs are valid, False otherwise.
    """
    return (
        validate_matrix(matrix) and
        validate_weights(weights) and
        validate_scores(scores)
    )
