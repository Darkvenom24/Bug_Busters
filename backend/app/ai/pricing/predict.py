import os
import pickle
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

def predict_fair_price(crop: str, mandi_ref_price: float, quality_grade: str = "Grade A", is_organic: bool = False, distance_km: float = 25.0) -> dict:
    min_price = mandi_ref_price + 2.0
    if quality_grade == "Grade A":
        min_price += 1.5
    if is_organic:
        min_price += 3.0

    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                pipeline = pickle.load(f)
            input_df = pd.DataFrame([{
                "mandi_ref_price": mandi_ref_price,
                "demand_score": 0.85,
                "supply_score": 0.50,
                "quality_grade": quality_grade,
                "is_organic": 1 if is_organic else 0,
                "distance_km": distance_km
            }])
            pred = pipeline.predict(input_df)
            min_price = float(pred[0])
        except Exception as e:
            print(f"[!] Warning: Pricing regression error: {e}")

    rec_min = max(10, round(min_price))
    rec_max = max(12, round(min_price + 3.0))

    return {
        "crop": crop,
        "mandi_reference_price": mandi_ref_price,
        "recommended_min": rec_min,
        "recommended_max": rec_max,
        "quality_grade": quality_grade,
        "logistics_est_per_kg": round(1.5 + (distance_km * 0.04), 2),
        "confidence_score": 93
    }
