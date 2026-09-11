import os
import sys
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))

from app.ai.demand.predict import predict_demand
from app.ai.pricing.predict import predict_fair_price
from app.ai.matching.matcher import match_farmers_for_requirement
from app.ai.routing.optimizer import optimize_route
from app.ai.assistant.gemini_service import parse_farmer_intent

def test_demand_forecasting():
    res = predict_demand("Tomato", 1200.0, 190)
    assert res["crop"] == "Tomato"
    assert res["predicted_demand_tons"] > 0
    assert "percent_change" in res

def test_price_recommendation():
    res = predict_fair_price("Tomato", 28.0, "Grade A", is_organic=True)
    assert res["recommended_min"] >= 28.0
    assert res["recommended_max"] >= res["recommended_min"]

def test_matching_algorithm():
    req = {"crop": "Tomato", "quantity_kg": 300, "max_price_per_kg": 35, "max_distance_km": 50, "quality_grade": "Grade A"}
    produce = [{"id": "p1", "farmer_id": "f1", "farmer_name": "Ramesh", "crop": "Tomato", "price_per_kg": 31, "quantity_kg": 500, "quality_grade": "Grade A", "location": "Rajkot", "distance_km": 20}]
    matches = match_farmers_for_requirement(req, produce)
    assert len(matches) == 1
    assert matches[0]["match_score"] >= 80

def test_route_optimization():
    stops = [
        {"name": "Farm A", "role": "farm", "quantity_kg": 200, "freshness_priority": "High"},
        {"name": "Farm B", "role": "farm", "quantity_kg": 300, "freshness_priority": "Very High"},
    ]
    res = optimize_route(stops)
    assert res["total_stops"] == 2
    assert res["cost_saved_percent"] > 0

def test_gujarati_voice_intent():
    res = parse_farmer_intent("Mare 500 kilo dungri vechvi che")
    assert res["intent"] == "SELL_PRODUCE"
    assert res["crop"] == "Onion"
    assert res["quantity_kg"] == 500
    assert res["language"] == "Gujarati"
