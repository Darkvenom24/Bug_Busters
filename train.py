
from ultralytics import YOLO

DATA_YAML = (
    "NEU-DET/NEU-DET/YOLO_DATASET/data.yaml"
)

model = YOLO(
    "NEU-DET/NEU-DET/YOLO_DATASET/runs/detect/train-7/weights/best.pt"
)

model.train(
    data=DATA_YAML,
    epochs=50,
    imgsz=256,
    batch=8,
    device="cpu",
    project="runs/detect",
    name="train_negative_v1",
    workers=0
)
