# Real-Time Industrial Defect Detection and Quality Control Assistant

A software-based inspection system that detects product defects from camera images or uploads, stores results, and shows quality analytics. Built to be practical for a hackathon and extendable into a real industrial product.

---

## 1. Tech Stack

| Component | Technology | Purpose |
|---|---|---|
| Frontend | React.js | Dashboard, inspection screens, results |
| UI design | Tailwind CSS | Responsive, consistent styling |
| Backend | Python + FastAPI | Business logic; connects frontend, AI and database |
| Computer vision | OpenCV | Frame capture, resizing, image processing |
| AI model | YOLO (Ultralytics) | Detect and locate defects |
| Database | PostgreSQL | Users, products, inspections, defects, reports |
| Image storage | Local folder (object storage later) | Inspection evidence images |
| Camera | USB webcam / browser camera | Live image capture |
| Charts | Recharts | Quality statistics and defect trends |
| Authentication | JWT with role-based access | Sessions and permissions |
| API testing | Postman | Test backend endpoints |
| Version control | Git + GitHub | Collaboration |
| Deployment | Render or similar | Hosting (optional for hackathon) |

---

## 2. Architecture

```
Image source (USB camera / browser camera / upload)
        ↓
React + Tailwind CSS  (UI, dashboards)
        ↓
FastAPI backend       (logic, API, auth)
        ↓
YOLO + OpenCV         (defect detection)
        ↓
PostgreSQL            (inspection records)
        ↓
Results & reporting   (defect highlights, alerts, history, analytics)
```

**Request flow:** user uploads an image → FastAPI receives it → model returns defect predictions → results saved in PostgreSQL → frontend shows the image, defects, and pass/fail status.

---

## 3. Camera Options

| Option | Use case | Notes |
|---|---|---|
| **USB webcam (recommended)** | Hackathon demo | Cheap, easy; laptop webcam works |
| Raspberry Pi camera | Compact edge prototype | Needs Raspberry Pi setup |
| Industrial machine-vision camera | Production line | Expensive, specialized setup |

Also support **image upload** so the demo works without a live camera. Lighting, camera position, resolution, and product placement strongly affect accuracy.

---

## 4. APIs

No paid external AI API is required. The model runs inside your own backend.

| API / service | Required? | Purpose |
|---|---|---|
| Own FastAPI endpoints | Yes | Connect frontend, model, database |
| AI inference function/service | Yes | Run the model on images |
| Browser camera access | For live mode | Capture live images |
| Email / WhatsApp notification API | Optional | Alerts |
| Cloud storage API | Optional | Store images/reports online |
| Factory system API | Optional | Integrate with manufacturing/inventory systems |

---

## 5. Datasets (real-world data)

**Public datasets** (check each license before use):
- **MVTec AD**: industrial anomaly detection across many product/texture categories
- **DAGM 2007**: synthetic surface texture defects
- **NEU Surface Defect Database**: steel surface defects

**Own images:** collect normal and defective samples of your chosen product (e.g., plastic bottles: dents, scratches, cracks, missing caps) and label them.

> A dataset must match your target product and defect types. A steel-defect dataset won't reliably detect plastic bottle defects. A general object-detection model may recognize a bottle but miss a small crack, so train or adapt the model for your specific defects.

**Two approaches:** supervised defect detection (YOLO, labeled defect classes) vs. anomaly detection (learn what "normal" looks like and flag deviations).

---

## 6. Database

**PostgreSQL (recommended).** Alternatives: MySQL, SQLite (small local prototype), MongoDB (flexible documents).

Do not store large images in database fields. Save files to a folder (or object storage) and keep the path/URL in PostgreSQL.

**Core tables (simplified):**

- `Users`: user_id, name, email, role
- `Products`: product_id, product_name, category
- `Inspections`: inspection_id, product_id, batch_id, result, date_time, image_path
- `Defects`: defect_id, inspection_id, defect_type, severity, confidence

Optional: batches, notifications, manual review records, corrective actions.

---

## 7. Cost

| Technology | Cost |
|---|---|
| React, Tailwind, Python, FastAPI, OpenCV, PostgreSQL, Recharts | Free / open source |
| Postman, GitHub | Free tier |
| Render | Limited free tier (free PostgreSQL: 1 GB, expires after 30 days) |
| YOLO (Ultralytics) | Free under AGPL-3.0, with conditions (see below) |
| USB webcam | Hardware cost if you don't already have one |

**Zero-cost prototype:** run everything locally (React, FastAPI, OpenCV, PostgreSQL), use your laptop webcam, a public dataset or your own images, store images locally, and demo locally.

### YOLO licensing note
Ultralytics YOLO is free for academic, personal, and learning use under AGPL-3.0. The AGPL requires sharing source code if you offer the software to others over a network, and a private commercial product would need a separate Ultralytics license. A local student/hackathon demo is fine; check the terms again if you deploy publicly or commercialize.

---

## 8. Decisions Before Coding

1. **Product category:** pick one (plastic bottles, metal parts, electronic boards). This fixes dataset, camera setup, and defect classes.
2. **Inspection mode:** start with image upload, then add live webcam.
3. **Model and dataset:** confirm you can get enough suitable labeled images for your chosen defects.

---

## 9. Recommended Hackathon Stack

**React + Tailwind CSS · FastAPI · YOLO + OpenCV · PostgreSQL · USB webcam · local image storage · JWT auth · GitHub**
