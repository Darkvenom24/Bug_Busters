from typing import List, Dict, Any

def match_farmers_for_requirement(requirement: Dict[str, Any], produce_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    matches = []
    req_crop = requirement.get("crop", "").lower()
    req_qty = float(requirement.get("quantity_kg", 500))
    req_max_price = float(requirement.get("max_price_per_kg", 35))
    req_dist = float(requirement.get("max_distance_km", 50))
    req_grade = requirement.get("quality_grade", "Grade A")

    for item in produce_items:
        prod_crop = item.get("crop", "").lower()
        if req_crop not in prod_crop and prod_crop not in req_crop:
            continue

        prod_price = float(item.get("price_per_kg", 30))
        prod_qty = float(item.get("quantity_kg", 500))
        prod_grade = item.get("quality_grade", "Grade A")
        dist = float(item.get("distance_km", 25))

        dist_score = max(0, 100 - (dist / req_dist) * 60)
        price_score = 95 - ((prod_price / req_max_price) * 10) if prod_price <= req_max_price else max(40, 100 - (prod_price - req_max_price) * 15)
        qty_ratio = min(prod_qty / req_qty, 1.2)
        qty_score = 95 if qty_ratio >= 0.8 else (qty_ratio / 0.8) * 90
        grade_score = 95 if prod_grade == req_grade else 78
        reliability_score = 92.0

        # Weighted calculation
        total_score = round(
            dist_score * 0.25 +
            price_score * 0.30 +
            qty_score * 0.20 +
            grade_score * 0.15 +
            reliability_score * 0.10
        )

        matches.append({
            "farmer_id": item.get("farmer_id"),
            "farmer_name": item.get("farmer_name"),
            "produce_id": item.get("id"),
            "crop": item.get("crop"),
            "location": item.get("location"),
            "distance_km": dist,
            "match_score": min(99, max(60, total_score)),
            "offered_price": prod_price,
            "available_kg": prod_qty,
            "quality_grade": prod_grade,
        })

    matches.sort(key=lambda x: x["match_score"], reverse=True)
    return matches
