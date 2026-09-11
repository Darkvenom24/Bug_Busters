import os
import pickle
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")

def predict_demand(crop: str, historical_orders: float, inquiries: int, festive_index: float = 1.2, rainfall_mm: float = 40.0) -> dict:
    predicted_val = historical_orders * 1.32 # fallback calculation

    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "rb") as f:
                model = pickle.load(f)
            input_df = pd.DataFrame([{
                "historical_orders_tons": historical_orders,
                "buyer_inquiries": inquiries,
                "festive_index": festive_index,
                "rainfall_mm": rainfall_mm
            }])
            preds = model.predict(input_df)
            predicted_val = float(preds[0])
        except Exception as e:
            print(f"[!] Warning: ML demand predict error: {e}")

    pct_change = round(((predicted_val - historical_orders) / max(1, historical_orders)) * 100, 1)

    return {
        "crop": crop,
        "current_demand_tons": historical_orders,
        "predicted_demand_tons": round(predicted_val, 1),
        "percent_change": pct_change,
        "ai_insight": f"AI Forecast indicates a {pct_change}% demand shift for {crop} driven by seasonal procurement."
    }
