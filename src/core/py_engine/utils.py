# deepcal_engine/utils.py
import numpy as np
import csv
import os


def load_decision_matrix(path='data/decision_matrix.csv'):
    if not os.path.exists(path):
        return np.array([
            [1200, 92, 5],
            [1000, 85, 9],
            [1300, 97, 3],
            [1100, 90, 4],
        ])
    with open(path, 'r') as file:
        reader = csv.reader(file)
        return np.array([[float(cell) for cell in row] for row in reader])


def validate_input(matrix):
    return isinstance(matrix, np.ndarray) and matrix.ndim == 2 and not np.isnan(matrix).any()


def log_decision(criteria, weights, results, timestamp):
    print("\n[LOG] Decision Timestamp:", timestamp)
    print("[LOG] Criteria Weights:", dict(zip(criteria, [round(w, 3) for w in weights])))
    print("[LOG] Rankings:", results)


def explain_to_human(criteria, weights, results):
    best_name, best_score = results[0]
    primary_crit = criteria[np.argmax(weights)]
    return (
        f"We picked Forwarder {best_name} because they are best at what's most important now — {primary_crit}.\n"
        f"We checked everyone on Cost, Reliability, and Speed.\n"
        f"Then we picked the one closest to perfect — and furthest from bad." 
    )
