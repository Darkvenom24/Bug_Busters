# DefectSense AI — Industrial Defect Detection Platform

> Real-time quality control for **plastic bottle manufacturing** using computer vision and AI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Vanilla CSS (dark-mode design system) |
| Backend | Python 3.11 + FastAPI |
| AI Model | YOLOv8 (Ultralytics) |
| Computer Vision | OpenCV |
| Database | PostgreSQL |
| Auth | JWT (python-jose + passlib) |
| Charts | Recharts |
| Image upload | react-dropzone |

---

## Project Structure

```
defect-detection-app/
├── backend/
│   ├── app/
│   │   ├── api/routes/      # auth, inspections, products, reports, alerts, users, defects
│   │   ├── core/            # config, database, security (JWT)
│   │   ├── models/          # SQLAlchemy models: User, Product, Inspection, Defect, Alert
│   │   ├── services/        # detection.py (YOLO + OpenCV AI service)
│   │   └── main.py          # FastAPI app
│   ├── ml/weights/          # Place your YOLOv8 .pt model file here
│   ├── uploads/inspections/ # Uploaded + annotated images
│   ├── requirements.txt
│   └── .env.example         # Copy to .env and configure
└── frontend/
    ├── src/
    │   ├── api/client.js    # Axios instance with JWT interceptor
    │   ├── components/      # Layout (sidebar)
    │   ├── context/         # AuthContext
    │   └── pages/           # Dashboard, Inspect, InspectionResult, History, Alerts, Products
    ├── index.html
    └── vite.config.js       # Dev proxy → FastAPI :8000
```

---

## Getting Started

### 1. Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your PostgreSQL credentials

# Run dev server
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install      # already done
npm run dev
```

App: http://localhost:5173

---

## AI Model Setup

The detection service has two modes:

- **Demo mode** (default): Runs without a model file and returns simulated defects so you can develop the UI immediately.
- **YOLO mode**: Download or train a YOLOv8 model and place it at `backend/ml/weights/yolov8_defects.pt`.

### Defect classes (plastic bottles)
| Class | Severity |
|---|---|
| crack | high |
| missing_cap | critical |
| deformed | high |
| scratch | low |
| discoloration | medium |

### Datasets
- **MVTec AD** — anomaly detection across many materials
- **NEU Surface Defect Database** — surface defects
- Collect and label your own bottles for best results

---

## Database Schema

| Table | Key fields |
|---|---|
| users | id, name, email, hashed_password, role |
| products | id, name, category, quality thresholds |
| inspections | id, product_id, batch_id, result, image_path |
| defects | id, inspection_id, defect_type, severity, confidence, bbox |
| alerts | id, inspection_id, priority, message, is_acknowledged |

---

## User Roles

`admin` · `factory_manager` · `quality_inspector` · `production_supervisor` · `worker` · `viewer`

---

## Pages Implemented

- **Login** — JWT auth with role-based access
- **Dashboard** — stats, bar/pie charts, recent inspections
- **Inspect Product** — drag-and-drop upload, AI detection trigger
- **Inspection Result** — pass/fail banner, defect list with confidence bars
- **Inspection History** — filterable table with all past results
- **Alerts** — unread/acknowledged alerts with priority badges
- **Products** — manage product lines and quality thresholds

---

## YOLO Licensing

Ultralytics YOLO is free under AGPL-3.0 for academic/personal/hackathon use. A commercial production deployment requires a separate Ultralytics Enterprise license.

---

*Based on the README_Industrial_Defect_Detection.md specification.*
