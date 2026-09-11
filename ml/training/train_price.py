"""
FarmSetu ML - Price Recommendation Regression Trainer
Predicts optimal advisory farm gate price bounds
"""

import os
import pickle
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_squared_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), '../datasets/prices.csv')
MODEL_SAVE_PATH = os.path.join(os.path.dirname(__file__), '../models/price_model.pkl')
BACKEND_MODEL_PATH = os.path.join(os.path.dirname(__file__), '../../backend/app/ai/pricing/model.pkl')

def train():
    print(f"[*] Loading pricing dataset from: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)

    features = ['mandi_ref_price', 'demand_score', 'supply_score', 'quality_grade', 'is_organic', 'distance_km']
    X = df[features]
    y = df['fair_price_min']

    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore'), ['quality_grade']),
        ],
        remainder='passthrough'
    )

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', Ridge(alpha=1.0))
    ])

    pipeline.fit(X, y)
    print(f"[OK] Price Recommendation Model fitted successfully!")

    # Serialize model
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    with open(MODEL_SAVE_PATH, 'wb') as f:
        pickle.dump(pipeline, f)
    print(f"[OK] Model saved to {MODEL_SAVE_PATH}")

    # Sync to backend
    os.makedirs(os.path.dirname(BACKEND_MODEL_PATH), exist_ok=True)
    with open(BACKEND_MODEL_PATH, 'wb') as f:
        pickle.dump(pipeline, f)
    print(f"[OK] Model synced to backend: {BACKEND_MODEL_PATH}")

if __name__ == '__main__':
    train()
