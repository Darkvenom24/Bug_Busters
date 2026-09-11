from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
def get_notifications():
    return [
        {"id": "n1", "title": "New High-Value Buyer Requirement", "message": "Tomato 300kg at ₹32/kg", "time": "10 mins ago"},
        {"id": "n2", "title": "AI Price Advisory Alert", "message": "Tomato benchmark increased to ₹30-₹33/kg", "time": "1 hour ago"}
    ]
