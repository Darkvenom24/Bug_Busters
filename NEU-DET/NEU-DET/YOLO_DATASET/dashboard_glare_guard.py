import csv
import sqlite3
import threading
import time
from datetime import datetime
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk

import cv2
import numpy as np
from PIL import Image, ImageTk
from ultralytics import YOLO

APP_DIR = Path(__file__).resolve().parent
MODEL_PATH = APP_DIR / "runs" / "detect" / "train-7" / "weights" / "best.pt"
DB_PATH = APP_DIR / "inspection_history.db"
OUTPUT_DIR = APP_DIR / "inspection_outputs"
OUTPUT_DIR.mkdir(exist_ok=True)
CONFIDENCE = 0.40
IMAGE_SIZE = 256


class Dashboard:
    def __init__(self, root):
        self.root = root
        root.title("Steel Defect Detection | Quality Control Dashboard")
        root.geometry("1180x740")
        root.minsize(950, 620)
        root.configure(bg="#edf2f7")
        self.model = None
        self.camera = None
        self.camera_running = False
        self.photo = None
        self.last_save = 0
        self.latest_annotated = None
        self.latest_detections = []
        self.total = self.passed = self.failed = self.defects = 0
        self._database()
        self._ui()
        self._load_model()
        self._load_stats()
        self._history()
        root.protocol("WM_DELETE_WINDOW", self.close)

    def _database(self):
        with sqlite3.connect(DB_PATH) as db:
            db.execute("""CREATE TABLE IF NOT EXISTS inspections (
                id INTEGER PRIMARY KEY AUTOINCREMENT, inspected_at TEXT,
                source TEXT, result TEXT, defect_count INTEGER,
                defects TEXT, max_confidence REAL, image_path TEXT)""")

    def _ui(self):
        header = tk.Frame(self.root, bg="#172b4d", padx=18, pady=13)
        header.pack(fill="x")
        tk.Label(header, text="STEEL DEFECT DETECTION", bg="#172b4d", fg="white",
                 font=("Segoe UI", 20, "bold")).pack(side="left")
        tk.Label(header, text="QUALITY CONTROL DASHBOARD", bg="#172b4d", fg="#b8d5ff",
                 font=("Segoe UI", 10, "bold")).pack(side="right")

        bar = ttk.Frame(self.root, padding=10)
        bar.pack(fill="x")
        self.start_btn = ttk.Button(bar, text="Start Camera", command=self.start_camera)
        self.start_btn.pack(side="left", padx=4)
        ttk.Button(bar, text="Stop Camera", command=self.stop_camera).pack(side="left", padx=4)
        ttk.Button(bar, text="Inspect Image", command=self.inspect_image).pack(side="left", padx=4)
        ttk.Button(bar, text="Save Inspection", command=self.save_current_inspection).pack(side="left", padx=4)
        ttk.Button(bar, text="Export CSV", command=self.export_csv).pack(side="left", padx=4)
        ttk.Button(bar, text="Export PDF", command=self.export_pdf).pack(side="left", padx=4)
        self.model_text = ttk.Label(bar, text="Loading model...")
        self.model_text.pack(side="right")

        cards = ttk.Frame(self.root, padding=(10, 0, 10, 10))
        cards.pack(fill="x")
        self.stats = {}
        for key, title in [("total", "INSPECTIONS"), ("pass", "PASS"),
                           ("fail", "FAIL"), ("defects", "DETECTIONS")]:
            card = tk.Frame(cards, bg="white", padx=15, pady=8,
                            highlightbackground="#d5deeb", highlightthickness=1)
            card.pack(side="left", fill="x", expand=True, padx=4)
            tk.Label(card, text=title, bg="white", fg="#52637a",
                     font=("Segoe UI", 9, "bold")).pack(anchor="w")
            var = tk.StringVar(value="0")
            self.stats[key] = var
            tk.Label(card, textvariable=var, bg="white", fg="#172b4d",
                     font=("Segoe UI", 22, "bold")).pack(anchor="w")

        split = ttk.Panedwindow(self.root, orient="horizontal")
        split.pack(fill="both", expand=True, padx=12, pady=(0, 12))
        left = ttk.LabelFrame(split, text="Camera / Image Preview", padding=8)
        right = ttk.LabelFrame(split, text="Recent Inspections", padding=8)
        split.add(left, weight=3)
        split.add(right, weight=2)
        self.preview = tk.Label(left, text="Start camera or choose an image",
                                bg="#111827", fg="white", font=("Segoe UI", 13))
        self.preview.pack(fill="both", expand=True)
        self.status = tk.StringVar(value="Ready")
        ttk.Label(left, textvariable=self.status).pack(anchor="w", pady=(7, 0))
        self.result = tk.StringVar(value="Result: waiting")
        self.result_label = tk.Label(left, textvariable=self.result,
                                     bg="#edf2f7", fg="#172b4d",
                                     font=("Segoe UI", 13, "bold"), pady=8)
        self.result_label.pack(fill="x")

        cols = ("time", "result", "count", "confidence")
        self.table = ttk.Treeview(right, columns=cols, show="headings", height=18)
        for col, label, width in [
            ("time", "Time", 125), ("result", "Result", 65),
            ("count", "Defects", 65), ("confidence", "Max conf.", 85)
        ]:
            self.table.heading(col, text=label)
            self.table.column(col, width=width, anchor="center")
        self.table.pack(fill="both", expand=True)
        ttk.Label(right, text=f"Saved in {DB_PATH.name}").pack(anchor="w", pady=(7, 0))

    def _load_model(self):
        if not MODEL_PATH.exists():
            self.model_text.configure(text="Model file missing")
            self.status.set(f"Missing: {MODEL_PATH}")
            messagebox.showerror(
                "YOLO weights not found",
                f"Expected model file:\n{MODEL_PATH}\n\n"
                "Save dashboard.py in your YOLO_DATASET folder and check that "
                "runs\\detect\\train-7\\weights\\best.pt exists."
            )
            return
        try:
            self.model = YOLO(str(MODEL_PATH))
            self.model_text.configure(text="Model: train-7 | CPU")
            self.status.set("Model loaded. Ready.")
        except Exception as exc:
            self.status.set("Model load failed")
            messagebox.showerror("Model error", str(exc))

    def _glare_ratio(self, frame, xyxy):
        """Estimate near-white glare inside a predicted box; heuristic only."""
        h, w = frame.shape[:2]
        x1, y1, x2, y2 = [int(v) for v in xyxy]
        x1, x2 = max(0, min(w, x1)), max(0, min(w, x2))
        y1, y2 = max(0, min(h, y1)), max(0, min(h, y2))
        if x2 <= x1 or y2 <= y1:
            return 0.0
        roi = frame[y1:y2, x1:x2]
        if roi.size == 0:
            return 0.0
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        # Conservative definition of possible glare: very bright + low saturation.
        glare = (hsv[:, :, 2] >= 245) & (hsv[:, :, 1] <= 35)
        return float(np.count_nonzero(glare)) / float(glare.size)

    def predict(self, frame):
        if self.model is None:
            raise RuntimeError("Model is not loaded. Check train-7\\weights\\best.pt.")
        result = self.model.predict(frame, imgsz=IMAGE_SIZE, conf=CONFIDENCE,
                                    device="cpu", verbose=False)[0]

        # NOTE: this is a conservative heuristic, not a guaranteed glare detector.
        # Suppress only boxes whose area is overwhelmingly near-white glare.
        # Validate on labelled images because a real bright defect can be suppressed.
        GLARE_RATIO_THRESHOLD = 0.75
        detections = []
        annotated = frame.copy()

        if result.boxes is not None:
            for box in result.boxes:
                cid = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                xyxy = box.xyxy[0].cpu().tolist()
                ratio = self._glare_ratio(frame, xyxy)

                if ratio >= GLARE_RATIO_THRESHOLD:
                    continue

                x1, y1, x2, y2 = [int(v) for v in xyxy]
                class_name = str(result.names.get(cid, cid))
                detections.append({
                    "class": class_name,
                    "confidence": conf,
                    "box": (x1, y1, x2, y2),
                    "glare_ratio": ratio,
                })
                label = f"{class_name} {conf:.2f}"
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (40, 220, 120), 2)
                cv2.putText(annotated, label, (x1, max(22, y1 - 7)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (40, 220, 120), 2,
                            cv2.LINE_AA)

        return annotated, detections

    def show_frame(self, frame, detections=None, source="Camera"):
        if detections is not None:
            self.latest_annotated = frame.copy()
            self.latest_detections = list(detections)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        im = Image.fromarray(rgb)
        im.thumbnail((740, 480))
        self.photo = ImageTk.PhotoImage(im)
        self.preview.configure(image=self.photo, text="")
        self.status.set(f"{source} | {datetime.now():%H:%M:%S}")
        if detections is not None:
            self.show_result(detections)

    def show_result(self, detections):
        count = len(detections)
        confidence = max((d["confidence"] for d in detections), default=0.0)
        if count:
            classes = ", ".join(sorted(set(d["class"] for d in detections)))
            self.result.set(f"FAIL | {count} defect(s): {classes} | Max confidence {confidence:.1%}")
            self.result_label.configure(fg="#b42318")
        else:
            self.result.set("PASS | No defect detected above confidence threshold")
            self.result_label.configure(fg="#067647")
        self.stats["total"].set(str(self.total))
        self.stats["pass"].set(str(self.passed))
        self.stats["fail"].set(str(self.failed))
        self.stats["defects"].set(str(self.defects))

    def record(self, source, detections, annotated):
        now = datetime.now()
        count = len(detections)
        max_conf = max((d["confidence"] for d in detections), default=0.0)
        result = "FAIL" if count else "PASS"
        names = ", ".join(d["class"] for d in detections) if count else "None"
        image_path = OUTPUT_DIR / f"{now:%Y%m%d_%H%M%S_%f}.jpg"
        cv2.imwrite(str(image_path), annotated)
        with sqlite3.connect(DB_PATH) as db:
            db.execute("""INSERT INTO inspections
                (inspected_at, source, result, defect_count, defects, max_confidence, image_path)
                VALUES (?, ?, ?, ?, ?, ?, ?)""",
                (now.strftime("%Y-%m-%d %H:%M:%S"), source, result, count,
                 names, max_conf, str(image_path)))
        self._load_stats()
        self.show_result(detections)
        self._history()


    def _load_stats(self):
        """Load dashboard totals from persistent inspection history."""
        with sqlite3.connect(DB_PATH) as db:
            row = db.execute("""
                SELECT COUNT(*),
                       COALESCE(SUM(CASE WHEN result='PASS' THEN 1 ELSE 0 END), 0),
                       COALESCE(SUM(CASE WHEN result='FAIL' THEN 1 ELSE 0 END), 0),
                       COALESCE(SUM(defect_count), 0)
                FROM inspections
            """).fetchone()
        self.total, self.passed, self.failed, self.defects = map(int, row)
        self.stats["total"].set(str(self.total))
        self.stats["pass"].set(str(self.passed))
        self.stats["fail"].set(str(self.failed))
        self.stats["defects"].set(str(self.defects))

    def save_current_inspection(self):
        """Save exactly one record for the currently displayed camera frame."""
        if self.latest_annotated is None:
            messagebox.showinfo("No inspection result", "Start the camera or inspect an image first.")
            return
        source = "Camera session" if self.camera_running else "Current image/frame"
        self.record(source, self.latest_detections, self.latest_annotated.copy())
        messagebox.showinfo("Inspection saved", "One inspection record has been saved.")

    def export_pdf(self):
        """Export a summary and recent inspection history to a PDF report."""
        path = filedialog.asksaveasfilename(
            title="Export inspection report", defaultextension=".pdf",
            filetypes=[("PDF files", "*.pdf")]
        )
        if not path:
            return
        try:
            from reportlab.lib import colors
            from reportlab.lib.pagesizes import A4, landscape
            from reportlab.lib.styles import getSampleStyleSheet
            from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
        except ImportError:
            messagebox.showerror(
                "Missing library",
                "PDF export requires reportlab. Install it in your active environment with:\n"
                "python -m pip install reportlab"
            )
            return

        with sqlite3.connect(DB_PATH) as db:
            rows = db.execute("""
                SELECT inspected_at, source, result, defect_count, defects, max_confidence
                FROM inspections ORDER BY id DESC LIMIT 500
            """).fetchall()

        doc = SimpleDocTemplate(path, pagesize=landscape(A4), rightMargin=28, leftMargin=28,
                                topMargin=28, bottomMargin=28)
        styles = getSampleStyleSheet()
        story = [
            Paragraph("Steel Defect Detection — Quality Control Report", styles["Title"]),
            Spacer(1, 8),
            Paragraph(
                f"Generated: {datetime.now():%Y-%m-%d %H:%M:%S}<br/>"
                f"Inspections in database: {self.total} | PASS: {self.passed} | "
                f"FAIL: {self.failed} | Total detected boxes: {self.defects}",
                styles["Normal"]
            ),
            Spacer(1, 14)
        ]
        data = [["Time", "Source", "Result", "Defects", "Defect classes", "Max confidence"]]
        for stamp, source, result, count, names, confidence in rows:
            data.append([
                str(stamp or ""), str(source or "")[:30], str(result or ""),
                str(count), str(names or "")[:65], f"{float(confidence or 0):.1%}"
            ])
        table = Table(data, repeatRows=1, colWidths=[105, 105, 55, 50, 260, 85])
        table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#172b4d")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#cbd5e1")),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f1f5f9")]),
        ]))
        story.append(table)
        try:
            doc.build(story)
            messagebox.showinfo("PDF exported", f"Report saved to:\n{path}")
        except Exception as exc:
            messagebox.showerror("PDF export error", str(exc))

    def start_camera(self):
        if self.camera_running:
            return
        if self.model is None:
            messagebox.showerror("Model unavailable", "Check the model weights path.")
            return
        self.camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)
        if not self.camera.isOpened():
            self.camera.release()
            self.camera = None
            messagebox.showerror("Camera error", "Could not open webcam. Close other camera apps.")
            return
        self.camera_running = True
        self.start_btn.configure(state="disabled")
        threading.Thread(target=self._camera_loop, daemon=True).start()
        self.status.set("Camera running")

    def _camera_loop(self):
        frame_no = 0
        while self.camera_running and self.camera is not None:
            ok, frame = self.camera.read()
            if not ok:
                time.sleep(0.05)
                continue
            frame_no += 1
            if frame_no % 2 == 0:
                try:
                    annotated, detections = self.predict(frame)
                    # Live frames are displayed continuously; save only when user clicks Save Inspection.
                    self.root.after(0, self.show_frame, annotated.copy(), detections, "Camera")
                except Exception as exc:
                    self.root.after(0, lambda e=str(exc): self.status.set(f"Prediction error: {e}"))
            else:
                self.root.after(0, self.show_frame, frame.copy(), None, "Camera")
            time.sleep(0.01)

    def stop_camera(self):
        self.camera_running = False
        if self.camera is not None:
            self.camera.release()
            self.camera = None
        self.start_btn.configure(state="normal")
        self.status.set("Camera stopped")

    def inspect_image(self):
        if self.model is None:
            messagebox.showerror("Model unavailable", "Check the model weights path.")
            return
        path = filedialog.askopenfilename(
            title="Select steel surface image",
            filetypes=[("Image files", "*.jpg *.jpeg *.png *.bmp *.webp")]
        )
        if not path:
            return
        frame = cv2.imread(path)
        if frame is None:
            messagebox.showerror("Image error", "Could not read selected image.")
            return
        try:
            annotated, detections = self.predict(frame)
            self.show_frame(annotated, detections, "Image")
            self.record(Path(path).name, detections, annotated)
        except Exception as exc:
            messagebox.showerror("Prediction error", str(exc))

    def _history(self):
        for item in self.table.get_children():
            self.table.delete(item)
        with sqlite3.connect(DB_PATH) as db:
            rows = db.execute("""SELECT inspected_at, result, defect_count, max_confidence
                FROM inspections ORDER BY id DESC LIMIT 100""").fetchall()
        for stamp, result, count, confidence in rows:
            self.table.insert("", "end", values=(stamp, result, count, f"{confidence:.1%}"))

    def export_csv(self):
        path = filedialog.asksaveasfilename(
            title="Export inspection history", defaultextension=".csv",
            filetypes=[("CSV files", "*.csv")]
        )
        if not path:
            return
        with sqlite3.connect(DB_PATH) as db:
            rows = db.execute("""SELECT inspected_at, source, result, defect_count,
                defects, max_confidence, image_path FROM inspections ORDER BY id DESC""").fetchall()
        try:
            with open(path, "w", newline="", encoding="utf-8-sig") as file:
                writer = csv.writer(file)
                writer.writerow(["Inspected At", "Source", "Result", "Defect Count",
                                 "Defects", "Max Confidence", "Image Path"])
                writer.writerows(rows)
            messagebox.showinfo("Export complete", f"Exported {len(rows)} records.")
        except OSError as exc:
            messagebox.showerror("Export error", str(exc))

    def close(self):
        self.stop_camera()
        self.root.destroy()


if __name__ == "__main__":
    root = tk.Tk()
    Dashboard(root)
    root.mainloop()
