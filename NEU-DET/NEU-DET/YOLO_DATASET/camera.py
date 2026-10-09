from pathlib import Path
import cv2
from ultralytics import YOLO

# This script expects camera.py to be inside YOLO_DATASET.
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "runs" / "detect" / "train-7" / "weights" / "best.pt"

IMAGE_SIZE = 256
CONFIDENCE = 0.25
CAMERA_INDEX = 0  # Try 1 if your webcam is not detected at index 0


def main():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Trained model not found:\n{MODEL_PATH}\n"
            "Make sure camera.py is inside YOLO_DATASET and train-7/weights/best.pt exists."
        )

    model = YOLO(str(MODEL_PATH))
    cap = cv2.VideoCapture(CAMERA_INDEX)

    if not cap.isOpened():
        raise RuntimeError(
            "Could not open the webcam. Close apps using the camera, "
            "check Windows camera permission, or change CAMERA_INDEX to 1."
        )

    print("Live steel defect detection started.")
    print("Press Q in the camera window to stop.")

    try:
        while True:
            ok, frame = cap.read()
            if not ok:
                print("Could not read a frame from the webcam.")
                break

            # Run YOLO inference on the current camera frame.
            results = model.predict(
                source=frame,
                imgsz=IMAGE_SIZE,
                conf=CONFIDENCE,
                device="cpu",
                verbose=False,
            )

            annotated_frame = results[0].plot()

            # Display a clear reminder that this is a prototype.
            cv2.putText(
                annotated_frame,
                "Steel Defect Detection | Press Q to quit",
                (10, 25),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.55,
                (255, 255, 255),
                2,
                cv2.LINE_AA,
            )

            cv2.imshow("Live Steel Defect Detection", annotated_frame)

            key = cv2.waitKey(1) & 0xFF
            if key == ord("q") or key == ord("Q"):
                break

    finally:
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
