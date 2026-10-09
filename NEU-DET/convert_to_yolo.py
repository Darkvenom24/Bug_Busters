import os
import shutil
import random
import xml.etree.ElementTree as ET

# =========================
# PATHS
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMAGE_DIR = os.path.join(BASE_DIR, "IMAGES")
ANNOTATION_DIR = os.path.join(BASE_DIR, "ANNOTATIONS")
OUTPUT_DIR = os.path.join(BASE_DIR, "YOLO_DATASET")

# =========================
# SETTINGS
# =========================

TRAIN_RATIO = 0.80
VAL_RATIO = 0.10
TEST_RATIO = 0.10

random.seed(42)

# =========================
# READ XML FILES
# =========================

records = []
classes = set()

xml_files = [
    f for f in os.listdir(ANNOTATION_DIR)
    if f.lower().endswith(".xml")
]

print("XML files found:", len(xml_files))

for xml_file in xml_files:

    xml_path = os.path.join(ANNOTATION_DIR, xml_file)

    tree = ET.parse(xml_path)
    root = tree.getroot()

    filename = root.findtext("filename")

    size = root.find("size")

    width = int(size.findtext("width"))
    height = int(size.findtext("height"))

    objects = []

    for obj in root.findall("object"):

        class_name = obj.findtext("name").strip()

        bbox = obj.find("bndbox")

        xmin = float(bbox.findtext("xmin"))
        ymin = float(bbox.findtext("ymin"))
        xmax = float(bbox.findtext("xmax"))
        ymax = float(bbox.findtext("ymax"))

        classes.add(class_name)

        objects.append({
            "class": class_name,
            "xmin": xmin,
            "ymin": ymin,
            "xmax": xmax,
            "ymax": ymax
        })

    if filename and objects:
        records.append({
            "filename": filename,
            "width": width,
            "height": height,
            "objects": objects
        })


# =========================
# CREATE CLASS IDs
# =========================

classes = sorted(classes)

class_to_id = {
    name: i for i, name in enumerate(classes)
}

print("\nClasses found:")

for name, class_id in class_to_id.items():
    print(class_id, "=", name)

# =========================
# CREATE FOLDERS
# =========================

for split in ["train", "val", "test"]:

    os.makedirs(
        os.path.join(OUTPUT_DIR, "images", split),
        exist_ok=True
    )

    os.makedirs(
        os.path.join(OUTPUT_DIR, "labels", split),
        exist_ok=True
    )


# =========================
# SHUFFLE DATA
# =========================

random.shuffle(records)

total = len(records)

train_end = int(total * TRAIN_RATIO)
val_end = train_end + int(total * VAL_RATIO)

train_records = records[:train_end]
val_records = records[train_end:val_end]
test_records = records[val_end:]


splits = {
    "train": train_records,
    "val": val_records,
    "test": test_records
}


# =========================
# FIND IMAGE
# =========================

def find_image(filename):

    possible_extensions = [
        filename,
        filename + ".jpg",
        filename + ".jpeg",
        filename + ".png"
    ]

    for name in possible_extensions:

        path = os.path.join(IMAGE_DIR, name)

        if os.path.exists(path):
            return path

    return None


# =========================
# CONVERT TO YOLO
# =========================

for split, split_records in splits.items():

    print(f"\nProcessing {split}: {len(split_records)} images")

    for record in split_records:

        filename = record["filename"]

        image_path = find_image(filename)

        if image_path is None:

            print("WARNING: Image not found:", filename)
            continue

        # Copy image
        destination_image = os.path.join(
            OUTPUT_DIR,
            "images",
            split,
            os.path.basename(image_path)
        )

        shutil.copy2(image_path, destination_image)

        # Label filename
        base_name = os.path.splitext(
            os.path.basename(image_path)
        )[0]

        label_path = os.path.join(
            OUTPUT_DIR,
            "labels",
            split,
            base_name + ".txt"
        )

        with open(label_path, "w") as label_file:

            for obj in record["objects"]:

                class_id = class_to_id[obj["class"]]

                xmin = obj["xmin"]
                ymin = obj["ymin"]
                xmax = obj["xmax"]
                ymax = obj["ymax"]

                # Convert VOC → YOLO
                center_x = ((xmin + xmax) / 2) / record["width"]
                center_y = ((ymin + ymax) / 2) / record["height"]

                box_width = (xmax - xmin) / record["width"]
                box_height = (ymax - ymin) / record["height"]

                label_file.write(
                    f"{class_id} "
                    f"{center_x:.6f} "
                    f"{center_y:.6f} "
                    f"{box_width:.6f} "
                    f"{box_height:.6f}\n"
                )


# =========================
# CREATE data.yaml
# =========================

yaml_path = os.path.join(OUTPUT_DIR, "data.yaml")

with open(yaml_path, "w") as f:

    f.write(f"path: {OUTPUT_DIR.replace(chr(92), '/')}\n")
    f.write("train: images/train\n")
    f.write("val: images/val\n")
    f.write("test: images/test\n\n")

    f.write(f"nc: {len(classes)}\n")

    f.write("names:\n")

    for i, class_name in enumerate(classes):
        f.write(f"  {i}: {class_name}\n")


# =========================
# FINAL RESULT
# =========================

print("\n================================")
print("CONVERSION COMPLETED")
print("================================")

print("Total images:", len(records))
print("Train:", len(train_records))
print("Validation:", len(val_records))
print("Test:", len(test_records))

print("\nClasses:")

for name, class_id in class_to_id.items():
    print(f"{class_id}: {name}")

print("\nYOLO dataset created at:")
print(OUTPUT_DIR)

print("\nNext step: Verify the generated dataset.")