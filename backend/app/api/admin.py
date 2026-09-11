from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/metrics")
def get_admin_metrics():
    return {
        "intermediary_markup_saved": 142300,
        "farmer_realization_rate": 82.4,
        "active_disputes": 2,
        "pending_verifications": 2,
        "total_deliveries_completed": 148,
        "carbon_saved_kg": 420.5
    }
