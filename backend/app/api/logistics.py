from fastapi import APIRouter
from typing import List, Dict, Any
from app.ai.routing.optimizer import optimize_route

router = APIRouter(prefix="/logistics", tags=["Logistics & Routes"])

DEFAULT_STOPS = [
    {"id": "stop-1", "name": "Farm A — Ramesh Patel", "role": "farm", "crop": "Tomato", "quantity_kg": 300, "freshness_priority": "High"},
    {"id": "stop-2", "name": "Farm B — Savita Devi", "role": "farm", "crop": "Spinach", "quantity_kg": 200, "freshness_priority": "Very High"},
    {"id": "stop-3", "name": "FPO Central Collection Hub", "role": "fpo_hub", "crop": "Sorting Batch", "quantity_kg": 500, "freshness_priority": "Medium"},
    {"id": "stop-4", "name": "GreenLeaf Grand Restaurant", "role": "buyer", "crop": "Tomato Delivery", "quantity_kg": 300, "freshness_priority": "High"},
]

@router.get("/current-route")
def get_current_optimized_route():
    return optimize_route(DEFAULT_STOPS)

@router.post("/optimize")
def optimize_custom_route(stops: List[Dict[str, Any]]):
    return optimize_route(stops)
