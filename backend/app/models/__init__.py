from .user import User, UserRole
from .product import Product
from .inspection import Inspection, InspectionStatus
from .defect import Defect
from .alert import Alert, AlertSeverity

# This __init__.py ensures all models are imported so Base.metadata.create_all() finds them
