"""
Compare confidence thresholds for the existing YOLO train-7 model.
Run from the YOLO_DATASET folder:
    python compare_thresholds.py

Uses the test split from data.yaml and images in non_steel_test/.
Does not modify/retrain model weights.
"""

from pathlib import Path
import csv
from ultralytics import YOLO

ROOT = Path(__file__).resolve().parent
MODEL_PATH = ROOT / "runs" / "detect" / "train-7" / "weights" / "best.pt"
DATA_YAML = ROOT / "data.yaml"
NON_STEEL_DIR = ROOT / "non_steel_test"
OUT_DIR = ROOT / "threshold_comparison"
THRESHOLDS = [0.25, 0.40, 0.50, 0.60]
IMAGE_SIZE = 256
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Model weights not found: {MODEL_PATH}")
    if not DATA_YAML.exists():
        raise FileNotFoundError(f"data.yaml not found: {DATA_YAML}")

    OUT_DIR.mkdir(exist_ok=True)
    model = YOLO(str(MODEL_PATH))

    non_steel_images = []
    if NON_STEEL_DIR.exists():
        non_steel_images = sorted(
            p for p in NON_STEEL_DIR.rglob("*")
            if p.is_file() and p.suffix.lower() in IMAGE_EXTS
        )

    rows = []
    print("\nComparing confidence thresholds:", THRESHOLDS)
    print("Model:", MODEL_PATH)
    print("Dataset:", DATA_YAML)

    for threshold in THRESHOLDS:
        print(f"\n=== Threshold {threshold:.2f}: steel TEST split ===")
        metrics = model.val(
            data=str(DATA_YAML),
            split="test",
            imgsz=IMAGE_SIZE,
            conf=threshold,
            device="cpu",
            plots=False,
            project=str(OUT_DIR),
            name=f"steel_test_conf_{str(threshold).replace('.', '_')}",
            exist_ok=True,
            verbose=False,
        )
        precision = float(getattr(metrics.box, "mp", 0.0))
        recall = float(getattr(metrics.box, "mr", 0.0))
        map50 = float(getattr(metrics.box, "map50", 0.0))
        map5095 = float(getattr(metrics.box, "map", 0.0))

        fp_images = 0
        total_boxes = 0
        if non_steel_images:
            print(f"Checking {len(non_steel_images)} non-steel images...")
            for img in non_steel_images:
                pred = model.predict(
                    source=str(img),
                    imgsz=IMAGE_SIZE,
                    conf=threshold,
                    device="cpu",
                    verbose=False
                )[0]
                count = 0 if pred.boxes is None else len(pred.boxes)
                total_boxes += count
                if count:
                    fp_images += 1

        fp_rate = (fp_images / len(non_steel_images)) if non_steel_images else None
        rows.append({
            "confidence_threshold": threshold,
            "steel_precision": precision,
            "steel_recall": recall,
            "steel_mAP50": map50,
            "steel_mAP50_95": map5095,
            "non_steel_images": len(non_steel_images),
            "non_steel_images_with_detections": fp_images if non_steel_images else "",
            "non_steel_false_positive_image_rate": fp_rate if fp_rate is not None else "",
            "non_steel_total_boxes": total_boxes if non_steel_images else "",
        })
        print(f"Precision={precision:.4f}, Recall={recall:.4f}, "
              f"mAP50={map50:.4f}, mAP50-95={map5095:.4f}")
        if non_steel_images:
            print(f"Non-steel detections: {fp_images}/{len(non_steel_images)} images, "
                  f"{total_boxes} boxes")

    report = OUT_DIR / "threshold_comparison.csv"
    with report.open("w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    print("\n=== COMPARISON COMPLETE ===")
    print("CSV report:", report)
    print("Choose a threshold only after comparing false detections with steel recall.")
    print("A higher threshold can reduce false positives but may also miss real defects.")


if __name__ == "__main__":
    main()
