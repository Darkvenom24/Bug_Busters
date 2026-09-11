import re
from typing import Dict, Any
from app.core.config import settings

def parse_farmer_intent(text: str) -> Dict[str, Any]:
    text_lower = text.lower().strip()

    # Crop recognition (Gujarati, Hindi, English)
    crop = "Tomato"
    if any(w in text_lower for w in ["dungri", "kanda", "pyaz", "onion"]):
        crop = "Onion"
    elif any(w in text_lower for w in ["tomato", "tameta", "tamatar"]):
        crop = "Tomato"
    elif any(w in text_lower for w in ["palak", "spinach", "bhaji"]):
        crop = "Spinach (Palak)"
    elif any(w in text_lower for w in ["kela", "banana"]):
        crop = "Banana"
    elif any(w in text_lower for w in ["bataka", "batata", "aloo", "potato"]):
        crop = "Potato"

    # Quantity extraction
    qty_match = re.search(r"(\d+)\s*(kilo|kg|ton|kilos)?", text_lower)
    qty = int(qty_match.group(1)) if qty_match else 500

    # Language detection
    lang = "English"
    if any(w in text_lower for w in ["che", "mare", "vechvi", "shu", "bhav"]):
        lang = "Gujarati"
    elif any(w in text_lower for w in ["hai", "kya", "daam", "bechna"]):
        lang = "Hindi"

    # Intent detection
    if any(w in text_lower for w in ["vechvi", "vechvu", "bechna", "sell"]):
        intent = "SELL_PRODUCE"
        msg = f"મેં {qty} kg {crop} વેચવાની વિનંતી સ્વીકારી છે." if lang == "Gujarati" else f"Parsed request to sell {qty} kg {crop}."
    elif any(w in text_lower for w in ["status", "shu che", "track"]):
        intent = "ORDER_STATUS"
        msg = "તમારો ઓર્ડર #ORD-8821 ટ્રાન્ઝિટમાં છે." if lang == "Gujarati" else "Order #ORD-8821 is currently in transit."
    elif any(w in text_lower for w in ["bhav", "rate", "price", "daam"]):
        intent = "PRICE_INQUIRY"
        msg = f"આજે {crop} નો ભાવ ₹30 - ₹33 પ્રતિ કિલો છે." if lang == "Gujarati" else f"Today's recommended price for {crop} is ₹30-₹33/kg."
    else:
        intent = "GENERAL_ASSIST"
        msg = "FarmSetu AI સહાયકમાં આપનું સ્વાગત છે." if lang == "Gujarati" else "Welcome to FarmSetu AI Assistant."

    return {
        "intent": intent,
        "language": lang,
        "crop": crop,
        "quantity_kg": qty,
        "response_message": msg
    }
