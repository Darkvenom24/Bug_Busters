# 🌾 FarmSetu

> **AI-Powered Direct Digital Marketplace for Farmers, FPOs & Buyers**  
> *Digital bridge between farm & buyer*  
> **Smart India Hackathon • Problem Statement ID: 26033 (DoCA)**  

---

## ⚡ Quick Start (Run the Project)

Open **two terminal windows**:

### Terminal 1 — Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
👉 Open in browser: **http://localhost:5173**

### Terminal 2 — Backend (Python + FastAPI)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
👉 API Swagger Docs: **http://localhost:8000/docs**

---

## 🧪 Run Automated Tests
```bash
python -m pytest tests/backend/test_api.py -v
```

---

## 🌾 Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts
- **Backend:** Python + FastAPI + SQLAlchemy + Pydantic + JWT (RBAC)
- **Database:** MySQL (with automatic SQLite fallback for zero-friction local run)
- **AI / ML:** Scikit-Learn (Demand Forecasting & Price Recommendation)
- **Optimization:** Google OR-Tools (Multi-Stop Vehicle Routing & Freshness Scheduling)
- **Voice AI:** Web Speech API + Gemini AI (Gujarati, Hindi, English)

---

## 🎯 Key Features

1. **Direct Digital Marketplace:** Direct produce listings with Grade A/B/C verification, zero middlemen.
2. **AI Demand Forecasting:** Predicts 30-day regional demand surges (+37.5% Tomato, +33.3% Onion).
3. **AI Price Recommendation:** ML regression calculating fair mandi benchmark price (₹30–₹33/kg).
4. **Smart Farmer-Buyer Matching:** Multi-criteria weighted matching (Distance, Price, Qty, Quality, Reliability) yielding 92% match scores.
5. **FPO Bulk Aggregation:** Combines smallholder harvests (200kg + 300kg + 500kg = 1,000kg batch) for bulk institutional supply.
6. **AI Route Optimization:** Google OR-Tools milk-run routing saving 28.4% transport costs with freshness prioritization (Spinach > Tomato > Banana > Potato).
7. **Multilingual Voice Assistant:** Natural voice/text interface supporting Gujarati, Hindi, and English (e.g. *"Mare 500 kilo dungri vechvi che"*).
8. **Digital Order Tracking:** 6-stage lifecycle tracking from harvest preparation to delivery with mutual ratings.

---

## 👥 Instant Demo Roles

Switch roles instantly from the top-right dropdown in the navigation bar:
- **Farmer (કિસાન):** Ramesh Patel (Rajkot, Gujarat)
- **FPO Producer Org:** Saurashtra Kisan Producer Co.
- **Buyer (Restaurant):** GreenLeaf Grand Restaurant & Banquets
- **Admin (DoCA):** Dr. Alok Verma (Dept. of Consumer Affairs)

---

## 📁 Project Structure

```
FarmSetu/
├── frontend/          # React + TS + Tailwind + Vite
├── backend/           # FastAPI + SQLAlchemy + AI Services
├── ml/                # Datasets + Scikit-Learn Training Scripts + Models (.pkl)
├── database/          # MySQL schema.sql & seed.sql
├── tests/             # Pytest automated test suite
├── docker-compose.yml # Containerized setup
└── README.md
```
