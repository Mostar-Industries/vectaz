# deepcal_engine/weighting.py
import numpy as np

class CriteriaWeighting:
    def __init__(self, criteria, tnn_judgments):
        self.criteria = criteria
        self.tnn_judgments = tnn_judgments

    def score_tnn(self, tnn):
        # Basic neutrosophic scoring: S = T - F
        return tnn[0] - tnn[2]

    def compute_weights(self):
        n = len(self.criteria)
        comparison = np.ones((n, n))
        index = {c: i for i, c in enumerate(self.criteria)}

        for (a, b), tnn in self.tnn_judgments.items():
            i, j = index[a], index[b]
            s = self.score_tnn(tnn)
            val = 1 + s if s >= 0 else 1 / (1 - s)
            comparison[i, j] = val
            comparison[j, i] = 1 / val

        normalized = comparison / comparison.sum(axis=0)
        weights = normalized.mean(axis=1)
        return weights
