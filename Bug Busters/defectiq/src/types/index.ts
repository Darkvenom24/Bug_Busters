export type Role = 'Admin' | 'Operator';

export type QualityStatus = 'PASS' | 'FAIL' | 'MANUAL REVIEW' | 'INSPECTION ERROR';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
}

export interface QualityRule {
  id: string;
  defectType: string;
  maxAllowedCount: number;
  criticalThresholdConfidence: number;
  autoReject: boolean;
}

export interface Product {
  id: string; // e.g. PRD-1024
  name: string;
  category: string;
  description: string;
  status: 'active' | 'inactive';
  qualityRules: QualityRule[];
  confidenceThreshold: number; // default e.g. 85%
  createdAt: string;
}

export interface Batch {
  id: string; // e.g. BATCH-102
  productId: string;
  productName: string;
  productionDate: string;
  shift: 'Morning (06:00 - 14:00)' | 'Afternoon (14:00 - 22:00)' | 'Night (22:00 - 06:00)';
  quantity: number;
  inspectedQuantity: number;
  passedQuantity: number;
  rejectedQuantity: number;
  status: 'In Production' | 'Inspection In Progress' | 'Completed' | 'Quarantined';
  qualityScore: number; // e.g. 94.2
}

export interface BoundingBox {
  x: number; // % 0-100
  y: number; // % 0-100
  width: number; // % 0-100
  height: number; // % 0-100
}

export interface DefectItem {
  id: string;
  type: string;
  confidence: number; // e.g. 94.5%
  severity: Severity;
  location: string;
  box: BoundingBox;
  description?: string;
}

export interface Verification {
  isVerified: boolean;
  decision?: 'Correct' | 'False Alarm';
  finalClassification?: string;
  remarks?: string;
  reviewer?: string;
  verifiedAt?: string;
}

export interface AIRecommendation {
  possibleCause: string;
  processCheck: string;
  suggestedAction: string;
}

export interface Inspection {
  id: string; // e.g. INSP-2041
  productId: string;
  productName: string;
  productCategory: string;
  batchId: string;
  timestamp: string;
  operatorId: string;
  operatorName: string;
  result: QualityStatus;
  defects: DefectItem[];
  overallConfidence: number;
  overallSeverity: Severity;
  imageUrl: string;
  modelVersion: string;
  recommendation?: AIRecommendation;
  verification?: Verification;
  rejectionReason?: string;
  operatorDecision?: 'Remove Product' | 'Sent for Manual Review' | 'Accepted' | 'Pending';
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'CRITICAL DEFECT' | 'HIGH DEFECT RATE' | 'MANUAL REVIEW REQUIRED' | 'INSPECTION ERROR' | 'QUALITY RISK';
  title: string;
  message: string;
  productId?: string;
  batchId?: string;
  inspectionId?: string;
  timestamp: string;
  severity: Severity;
  status: 'unacknowledged' | 'acknowledged';
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: 'Login' | 'Logout' | 'Inspection Decision' | 'Product Removal' | 'Result Correction' | 'User Created' | 'User Updated' | 'Settings Changed' | 'Batch Created';
  date: string;
  time: string;
  record: string;
  reason: string;
}

export interface ModelMetric {
  name: string;
  version: string;
  lastTrained: string;
  precision: number;
  recall: number;
  f1Score: number;
  mAP: number;
  datasetSize: number;
  classes: {
    className: string;
    precision: number;
    recall: number;
    f1Score: number;
    sampleCount: number;
  }[];
  confusionMatrix: {
    labels: string[];
    matrix: number[][];
  };
}

export interface AppSettings {
  confidenceThreshold: number;
  alertThresholdPercent: number;
  soundEnabled: boolean;
  browserAlerts: boolean;
  emailAlerts: boolean;
  cameraSource: string;
  resolution: string;
  targetFps: number;
  autoResumeOnPass: boolean;
}
