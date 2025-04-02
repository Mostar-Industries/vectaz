
from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import requests

API_BASE = "http://localhost:8000"

class ActionGetRankings(Action):
    def name(self) -> Text:
        return "action_get_rankings"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        res = requests.post(f"{API_BASE}/rankings", json={
            "matrix": [[1200, 92, 5], [1000, 85, 9], [1300, 97, 3], [1100, 90, 4]],
            "forwarders": ["A", "B", "C", "D"]
        })
        results = res.json()
        message = "\n".join([f"{r['forwarder']}: {r['closenessCoefficient']}" for r in results])
        dispatcher.utter_message(text=f"📊 Forwarder Rankings:\n{message}")
        return []

class ActionExplainRanking(Action):
    def name(self) -> Text:
        return "action_explain_ranking"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="DeepCAL ranks forwarders based on cost, reliability, and responsiveness using AHP-TOPSIS.")
        return []

class ActionGetDeepSightAlerts(Action):
    def name(self) -> Text:
        return "action_get_deep_sight_alerts"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        dispatcher.utter_message(text="🧠 DeepSight: No disruption flags currently. You're clear to ship.")
        return []
