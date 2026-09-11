"""
FarmSetu ML - Demand Forecasting Model Trainer
Uses Scikit-Learn RandomForestRegressor & Polynomial Features
"""

import os
import pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), '../datasets/demand.csv')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../models/demand_model.pkl')
BACKEND_MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../backend/app/ai/demand/model.pkl')

def train():
    print(f"[*] Loading demand dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)

    # Feature engineering
    feature_cols = ['historical_orders_tons', 'buyer_inquiries', 'festive_index', 'rainfall_mm']
    X = df[feature_cols]
    y = df['predicted_demand_tons']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    mae = mean_absolute_error(y_test, preds)
    print(f"[OK] Demand Model Trained Successfully! Test MAE: {mae:.2f} tons")

    # Serialize model
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    with open(MODEL_SAVE_PATH, 'wb') as f:
        pickle.dump(model, f)
    print(f"[OK] Model saved to {MODEL_SAVE_PATH}")

    # Copy to backend
    os.makedirs(os.path.dirname(BACKEND_MODEL_PATH), exist_ok=True)
    with open(BACKEND_MODEL_PATH, 'wb') as f:
        pickle.dump(model, f)
    print(f"[OK] Model synced to backend: {BACKEND_MODEL_PATH}")

if __name__ == '__main__':
    train()
