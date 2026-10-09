from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox

from ultralytics import YOLO

# Paths are relative to this detect.py file.
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "runs" / "detect" / "train-7" / "weights" / "best.pt"

# Start with a conservative confidence threshold; lower it if detections are missed.
CONFIDENCE = 0.25
IMAGE_SIZE = 256


def main():
    if not MODEL_PATH.exists():
        messagebox.showerror(
            "Model not found",
            f"Could not find the trained model:\n{MODEL_PATH}\n\n"
            "Check that detect.py is in YOLO_DATASET and that train-7/weights/best.pt exists."
        )
        return

    root = tk.Tk()
    root.withdraw()

    image_path = filedialog.askopenfilename(
        title="Select a steel-surface image",
        filetypes=[
            ("Image files", "*.jpg *.jpeg *.png *.bmp *.webp"),
            ("All files", "*.*"),
        ],
    )

    if not image_path:
        root.destroy()
        return

    try:
        model = YOLO(str(MODEL_PATH))
        results = model.predict(
            source=image_path,
            imgsz=IMAGE_SIZE,
            conf=CONFIDENCE,
            device="cpu",
            save=True,
            show=False,
            verbose=False,
        )

        result = results[0]
        names = result.names
        detections = []

        for box in result.boxes:
            class_id = int(box.cls[0].item())
            confidence = float(box.conf[0].item())
            xyxy = [round(float(v), 1) for v in box.xyxy[0].tolist()]
            detections.append(
                f"- {names[class_id]} — {confidence:.1%} confidence; "
                f"box (x1, y1, x2, y2) = {xyxy}"
            )

        save_dir = Path(result.save_dir) if hasattr(result, "save_dir") else None
        # Ultralytics normally saves to runs/detect/predict (or predict2, etc.).
        output_message = ""
        if save_dir:
            output_message = f"\n\nAnnotated image folder:\n{save_dir}"

        if detections:
            summary = "Defects detected:\n\n" + "\n".join(detections)
        else:
            summary = (
                "No defects detected above the confidence threshold "
                f"({CONFIDENCE:.0%}). This does not guarantee the surface is defect-free."
            )

        messagebox.showinfo("Steel Defect Detection", summary + output_message)
        print("\nSteel Defect Detection")
        print(summary)
        if output_message:
            print(output_message)

    except Exception as exc:
        messagebox.showerror("Detection error", f"Could not analyze this image:\n{exc}")
        raise
    finally:
        root.destroy()


if __name__ == "__main__":
    main()
