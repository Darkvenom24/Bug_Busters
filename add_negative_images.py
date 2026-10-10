"""
Safely add defect-free / non-steel negative images to an existing YOLO dataset.

Expected input:
  negative_images/
    clothes/
    background/
    shiny_steel_no_defect/
    non_steel_objects/

Expected dataset (YOLO format):
  YOLO_DATASET/
    images/train, images/val, images/test
    labels/train, labels/val, labels/test

This script COPIES images and creates empty label .txt files. It does not
change existing labels or images. Run first on a BACKUP of your dataset.
Use only images that genuinely contain no target steel defects.
Do not put curved steel images with real defects in this negative folder:
those must be annotated with the correct defect boxes/classes.
"""

from pathlib import Path
import random
import shutil
import hashlib

# Change these two paths to your real folders.
PROJECT_DIR = Path(__file__).resolve().parent
DATASET_DIR = PROJECT_DIR / "NEU-DET" / "NEU-DET" / "YOLO_DATASET"
NEGATIVE_DIR = PROJECT_DIR / "negative_images"

SPLIT_RATIOS = {"train": 0.80, "val": 0.10, "test": 0.10}
SEED = 42
IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".bmp", ".webp", ".tif", ".tiff"}


def sha1_file(path: Path) -> str:
    digest = hashlib.sha1()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main():
    if not DATASET_DIR.exists():
        raise SystemExit(
            f"Dataset folder not found: {DATASET_DIR}\n"
            "Edit DATASET_DIR in this script to match your data.yaml paths."
        )
    if not NEGATIVE_DIR.exists():
        NEGATIVE_DIR.mkdir(parents=True, exist_ok=True)
        for name in ("clothes", "background", "shiny_steel_no_defect", "non_steel_objects"):
            (NEGATIVE_DIR / name).mkdir(exist_ok=True)
        raise SystemExit(
            f"Created {NEGATIVE_DIR}\n"
            "Put verified defect-free/non-steel images into these subfolders, "
            "then run this script again."
        )

    images_root = DATASET_DIR / "images"
    labels_root = DATASET_DIR / "labels"
    for split in SPLIT_RATIOS:
        (images_root / split).mkdir(parents=True, exist_ok=True)
        (labels_root / split).mkdir(parents=True, exist_ok=True)

    files = [
        p for p in NEGATIVE_DIR.rglob("*")
        if p.is_file() and p.suffix.lower() in IMAGE_EXTS
    ]
    if not files:
        raise SystemExit(f"No images found under {NEGATIVE_DIR}")

    # Stable random split. Keep input images separated from target dataset.
    random.Random(SEED).shuffle(files)
    n = len(files)
    n_train = int(n * SPLIT_RATIOS["train"])
    n_val = int(n * SPLIT_RATIOS["val"])
    groups = {
        "train": files[:n_train],
        "val": files[n_train:n_train + n_val],
        "test": files[n_train + n_val:],
    }

    # Avoid copying exact duplicate image content already present in dataset.
    existing_hashes = set()
    for split in SPLIT_RATIOS:
        for p in (images_root / split).glob("*"):
            if p.is_file() and p.suffix.lower() in IMAGE_EXTS:
                try:
                    existing_hashes.add(sha1_file(p))
                except OSError:
                    pass

    copied = 0
    skipped_duplicates = 0
    for split, paths in groups.items():
        for src in paths:
            try:
                content_hash = sha1_file(src)
                if content_hash in existing_hashes:
                    skipped_duplicates += 1
                    continue

                # Prefix filename with category/subfolder to reduce name collisions.
                try:
                    category = src.parent.relative_to(NEGATIVE_DIR).as_posix().replace("/", "_")
                except ValueError:
                    category = "negative"
                stem = f"negative_{category}_{src.stem}"
                dst = images_root / split / f"{stem}{src.suffix.lower()}"

                # If a same-name file exists, append a number rather than overwrite.
                counter = 1
                while dst.exists():
                    dst = images_root / split / f"{stem}_{counter}{src.suffix.lower()}"
                    counter += 1

                shutil.copy2(src, dst)
                label_path = labels_root / split / f"{dst.stem}.txt"
                label_path.write_text("", encoding="utf-8")
                existing_hashes.add(content_hash)
                copied += 1
            except OSError as exc:
                print(f"SKIP {src}: {exc}")

    print("\nNegative-image import complete.")
    print(f"Input images found: {n}")
    print(f"Images copied: {copied}")
    print(f"Duplicate images skipped: {skipped_duplicates}")
    print(f"Dataset: {DATASET_DIR}")
    print("Split counts requested:", {k: len(v) for k, v in groups.items()})
    print("\nNext: inspect the copied images/empty labels, then retrain with your data.yaml.")
    print("Important: use a backup and ensure the same/similar image does not leak across splits.")


if __name__ == "__main__":
    main()
