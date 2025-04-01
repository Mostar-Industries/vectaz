# deepcal_engine/ranking.py
import numpy as np

class AlternativeRanking:
    def __init__(self, criteria, weights, benefit_flags):
        self.criteria = criteria
        self.weights = weights
        self.benefit_flags = benefit_flags
        self.decision_matrix = None
        self.alternatives = []

    def load_alternatives(self, names, matrix):
        self.alternatives = names
        self.decision_matrix = matrix

    def rank(self):
        norm = np.linalg.norm(self.decision_matrix, axis=0)
        normalized = self.decision_matrix / norm
        weighted = normalized * self.weights

        ideal, anti_ideal = [], []
        for j, crit in enumerate(self.criteria):
            col = weighted[:, j]
            if self.benefit_flags[crit]:
                ideal.append(np.max(col))
                anti_ideal.append(np.min(col))
            else:
                ideal.append(np.min(col))
                anti_ideal.append(np.max(col))

        d_plus = np.linalg.norm(weighted - ideal, axis=1)
        d_minus = np.linalg.norm(weighted - anti_ideal, axis=1)
        closeness = d_minus / (d_plus + d_minus)

        return sorted(zip(self.alternatives, closeness), key=lambda x: x[1], reverse=True)
