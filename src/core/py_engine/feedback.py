# deepcal_engine/feedback.py
class FeedbackLoop:
    def __init__(self):
        self.history = {}

    def update_on_performance(self, forwarder, success=True):
        if forwarder not in self.history:
            self.history[forwarder] = []
        self.history[forwarder].append(success)

        if not success and self.history[forwarder].count(False) > 2:
            print(f"⚠️ Warning: Forwarder {forwarder} has underperformed multiple times.")
            # This would trigger TNN degradation or re-weighting in a real model
            # e.g., reduce trust (T) or increase falsity (F) in the TNN matrix
