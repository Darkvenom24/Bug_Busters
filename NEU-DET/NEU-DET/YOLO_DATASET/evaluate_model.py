"""
Evaluate the existing Steel Defect Detection YOLO model.
Run from the YOLO_DATASET folder:
    python evaluate_model.py

Checks:
1) Evaluates train-7 on the dataset's TEST split (if configured in data.yaml).
2) Optionally scans a folder of NON-STEEL images to measure false detections.
This script does not retrain or modify the model.
"""

from pathlib import Path
import csv
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "runs" / "detect" / "train-7" / "weights" / "best.pt"
DATA_YAML = ROOT / "data.yaml"
RESULTS_DIR = ROOT / "evaluation_results"
NON_STEEL_DIR = ROOT / "non_steel_test"
CONFIDENCE = 0.25
IMAGE_SIZE = 256


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model weights not found: {MODEL_PATH}")
    if not DATA_YAML.exists():
        raise FileNotFoundError(f"data.yaml not found: {DATA_YAML}")

    RESULTS_DIR.mkdir(exist_ok=True)
    model = YOLO(str(MODEL_PATH))

    print("\n=== TEST SPLIT EVALUATION ===")
    metrics = model.val(
        data=str(DATA_YAML),
        split="test",
        imgsz=IMAGE_SIZE,
        conf=CONFIDENCE,
        device="cpu",
        plots=True,
        project=str(RESULTS_DIR),
        name="train7_test",
        exist_ok=True,
        verbose=True,
    )
    print("\nTest evaluation complete.")
    print(f"Precision (overall): {getattr(metrics.box, 'mp', float('nan')):.4f}")
    print(f"Recall (overall):    {getattr(metrics.box, 'mr', float('nan')):.4f}")
    print(f"mAP50:               {getattr(metrics.box, 'map50', float('nan')):.4f}")
    print(f"mAP50-95:            {getattr(metrics.box, 'map', float('nan')):.4f}")
    print(f"Detailed plots/results: {RESULTS_DIR / 'train7_test'}")

    if not NON_STEEL_DIR.exists():
        NON_STEEL_DIR.mkdir(exist_ok=True)
        print(
            "\n=== NON-STEEL FALSE-POSITIVE CHECK SKIPPED ===\n"
            f"Folder created: {NON_STEEL_DIR}\n"
            "Add ordinary non-steel images (people, wall, desk, tools, etc.) "
            "to this folder, then run this script again."
        )
        return

    image_exts = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    images = [p for p in NON_STEEL_DIR.rglob("*") if p.suffix.lower() in image_exts]
    if not images:
        print(f"\nNo images found in {NON_STEEL_DIR}. Add non-steel test images and rerun.")
        return

    print(f"\n=== NON-STEEL FALSE-POSITIVE CHECK ({len(images)} images) ===")
    rows = []
    false_positive_images = 0
    total_boxes = 0
    for path in images:
        prediction = model.predict(
            source=str(path), imgsz=IMAGE_SIZE, conf=CONFIDENCE,
            device="cpu", verbose=False
        )[0]
        boxes = prediction.boxes
        count = 0 if boxes is None else len(boxes)
        total_boxes += count
        if count:
            false_positive_images += 1
        labels = []
        max_conf = 0.0
        if boxes is not None:
            for box in boxes:
                class_id = int(box.cls[0].item())
                conf = float(box.conf[0].item())
                labels.append(f"{prediction.names.get(class_id, class_id)} ({conf:.3f})")
                max_conf = max(max_conf, conf)
        rows.append([str(path), count, "; ".join(labels) if labels else "None", f"{max_conf:.4f}"])

    out_csv = RESULTS_DIR / "non_steel_false_positives.csv"
    with out_csv.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f)
        writer.writerow(["image_path", "detections", "predicted_classes_confidence", "max_confidence"])
        writer.writerows(rows)

    print(f"Images with false detections: {false_positive_images}/{len(images)}")
    print(f"Total boxes on non-steel images: {total_boxes}")
    print(f"False-positive image rate: {false_positive_images / len(images):.1%}")
    print(f"CSV report: {out_csv}")
    print("\nReview the saved CSV and images before changing the confidence threshold.")


if __name__ == "__main__":
    main()
