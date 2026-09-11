from typing import List, Dict, Any
from app.ai.matching.matcher import match_farmers_for_requirement

class MatchingService:
    @staticmethod
    def match(requirement: Dict[str, Any], produce_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        return match_farmers_for_requirement(requirement, produce_items)
