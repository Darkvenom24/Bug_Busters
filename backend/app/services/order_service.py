from typing import Dict, Any

class OrderService:
    @staticmethod
    def calculate_commission(total_price: float) -> float:
        # FarmSetu charges 0% farmer commission
        return 0.0
