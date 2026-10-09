import { Product, Batch, Inspection, Alert, User, AuditLogEntry, ModelMetric, AppSettings } from '../types';

// High-fidelity SVG industrial product images with authentic component details
export const SAMPLE_IMAGES = {
  steelPlateDefect: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23d6dce5"/><stop offset="50%" stop-color="%23b8c2d1"/><stop offset="100%" stop-color="%239aa8bd"/></linearGradient><pattern id="brushed" width="10" height="2" patternUnits="userSpaceOnUse"><line x1="0" y1="1" x2="10" y2="1" stroke="%238a98ab" stroke-width="0.5" opacity="0.3"/></pattern></defs><rect width="600" height="400" fill="%23e2e8f0"/><rect x="40" y="30" width="520" height="340" rx="8" fill="url(%23metal)" stroke="%2364748b" stroke-width="3"/><rect x="40" y="30" width="520" height="340" fill="url(%23brushed)"/><circle cx="70" cy="60" r="8" fill="%23475569"/><circle cx="530" cy="60" r="8" fill="%23475569"/><circle cx="70" cy="340" r="8" fill="%23475569"/><circle cx="530" cy="340" r="8" fill="%23475569"/><path d="M 180 140 Q 210 148, 250 142 T 310 156" stroke="%232b2b2b" stroke-width="3.5" fill="none" opacity="0.85"/><circle cx="210" cy="145" r="4" fill="%231a1a1a"/><circle cx="280" cy="150" r="5" fill="%231a1a1a"/><ellipse cx="420" cy="240" rx="18" ry="12" fill="%23383838" opacity="0.75"/><circle cx="430" cy="242" r="3" fill="%230f172a"/><text x="60" y="365" font-family="monospace" font-size="12" fill="%23334155">LOT-%238829-SPEC-ST-400</text></svg>`,
  
  pcbDefect: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%230f172a"/><rect x="30" y="30" width="540" height="340" rx="10" fill="%23064e3b" stroke="%23047857" stroke-width="4"/><path d="M 60 70 L 140 70 L 140 180 L 220 180" stroke="%2310b981" stroke-width="3" fill="none"/><path d="M 60 120 L 180 120 L 220 220" stroke="%2310b981" stroke-width="2" fill="none"/><rect x="220" y="140" width="90" height="90" fill="%231e293b" stroke="%2394a3b8" stroke-width="2"/><text x="235" y="190" font-family="monospace" font-size="14" fill="%23f8fafc">IC-CONTROLLER</text><circle cx="380" cy="140" r="8" fill="%23fbbf24"/><circle cx="410" cy="140" r="8" fill="%23fbbf24"/><circle cx="440" cy="140" r="8" fill="%23fbbf24"/><path d="M 380 140 L 410 140" stroke="%23b45309" stroke-width="5"/><circle cx="395" cy="140" r="10" fill="%23ef4444" opacity="0.4"/><line x1="160" y1="280" x2="280" y2="280" stroke="%2310b981" stroke-width="4"/><line x1="210" y1="275" x2="225" y2="285" stroke="%23ef4444" stroke-width="4"/><text x="50" y="350" font-family="monospace" font-size="11" fill="%236ee7b7">PCB-REV-C // PIN BRIDGE DETECTED</text></svg>`,
  
  cleanPart: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><defs><linearGradient id="cleanAlum" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23f1f5f9"/><stop offset="50%" stop-color="%23e2e8f0"/><stop offset="100%" stop-color="%23cbd5e1"/></linearGradient></defs><rect width="600" height="400" fill="%23f8fafc"/><rect x="50" y="40" width="500" height="320" rx="12" fill="url(%23cleanAlum)" stroke="%2394a3b8" stroke-width="2"/><circle cx="150" cy="200" r="60" fill="%23cbd5e1" stroke="%2364748b" stroke-width="3"/><circle cx="150" cy="200" r="30" fill="%2394a3b8"/><circle cx="420" cy="200" r="50" fill="%23cbd5e1" stroke="%2364748b" stroke-width="2"/><path d="M 210 200 L 370 200" stroke="%2364748b" stroke-width="8" stroke-dasharray="10 10"/><rect x="250" y="175" width="80" height="50" fill="%2364748b" rx="4"/><text x="80" y="340" font-family="monospace" font-size="12" fill="%23475569">QC-CERTIFIED // ZERO ANOMALY DETECTED</text></svg>`,

  bearingFlaw: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%231e293b"/><circle cx="300" cy="200" r="140" fill="%2394a3b8" stroke="%23cbd5e1" stroke-width="8"/><circle cx="300" cy="200" r="85" fill="%230f172a" stroke="%2364748b" stroke-width="6"/><circle cx="300" cy="200" r="40" fill="%23475569"/><circle cx="300" cy="90" r="18" fill="%23e2e8f0"/><circle cx="380" cy="130" r="18" fill="%23e2e8f0"/><circle cx="410" cy="200" r="18" fill="%23e2e8f0"/><circle cx="380" cy="270" r="18" fill="%23e2e8f0"/><circle cx="300" cy="310" r="18" fill="%23e2e8f0"/><circle cx="220" cy="270" r="18" fill="%23e2e8f0"/><circle cx="190" cy="200" r="18" fill="%23e2e8f0"/><circle cx="220" cy="130" r="18" fill="%23e2e8f0"/><path d="M 292 82 L 308 98" stroke="%23b91c1c" stroke-width="3"/><path d="M 308 82 L 292 98" stroke="%23b91c1c" stroke-width="3"/><text x="40" y="380" font-family="monospace" font-size="12" fill="%23cbd5e1">ROLLER-BEARING-6204 // CRACK ON ROLLER 1</text></svg>`,
};

export const INITIAL_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Marcus Vance',
    email: 'admin@defectiq.ai',
    role: 'Admin',
    status: 'active',
    createdAt: '2026-01-10',
    lastLogin: '2026-10-09 11:20:00',
  },
  {
    id: 'USR-002',
    name: 'Elena Rostova',
    email: 'operator@defectiq.ai',
    role: 'Operator',
    status: 'active',
    createdAt: '2026-02-14',
    lastLogin: '2026-10-09 10:45:00',
  },
  {
    id: 'USR-003',
    name: 'Kenji Takahashi',
    email: 'kenji.t@defectiq.ai',
    role: 'Operator',
    status: 'active',
    createdAt: '2026-03-01',
    lastLogin: '2026-10-08 16:30:00',
  },
  {
    id: 'USR-004',
    name: 'Sarah Jenkins',
    email: 'sarah.j@defectiq.ai',
    role: 'Admin',
    status: 'active',
    createdAt: '2026-01-20',
    lastLogin: '2026-10-07 09:12:00',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'PRD-1024',
    name: 'Rolled Precision Steel Plate 12mm',
    category: 'Structural Metallurgy',
    description: 'High-tensile structural plate used in high-load engineering frames. Inspected for micro-cracks, inclusions, and scratches.',
    status: 'active',
    confidenceThreshold: 88,
    createdAt: '2026-01-15',
    qualityRules: [
      { id: 'QR-1', defectType: 'Surface Inclusion', maxAllowedCount: 0, criticalThresholdConfidence: 85, autoReject: true },
      { id: 'QR-2', defectType: 'Crack', maxAllowedCount: 0, criticalThresholdConfidence: 80, autoReject: true },
      { id: 'QR-3', defectType: 'Scratch', maxAllowedCount: 2, criticalThresholdConfidence: 90, autoReject: false }
    ]
  },
  {
    id: 'PRD-2048',
    name: 'Multi-Layer Power Controller PCB',
    category: 'Electronics & Avionics',
    description: 'Automotive grade 8-layer controller board. Inspected for solder bridging, missing SMD chips, and trace breakage.',
    status: 'active',
    confidenceThreshold: 92,
    createdAt: '2026-02-01',
    qualityRules: [
      { id: 'QR-4', defectType: 'Solder Bridge', maxAllowedCount: 0, criticalThresholdConfidence: 88, autoReject: true },
      { id: 'QR-5', defectType: 'Cold Solder', maxAllowedCount: 0, criticalThresholdConfidence: 90, autoReject: true },
      { id: 'QR-6', defectType: 'Trace Void', maxAllowedCount: 0, criticalThresholdConfidence: 92, autoReject: true }
    ]
  },
  {
    id: 'PRD-3090',
    name: 'Heavy Duty Flanged Hub Assembly',
    category: 'Automotive Powertrain',
    description: 'CNC machined forged alloy hub. Inspected for blowholes, bore misalignment, and surface pitting.',
    status: 'active',
    confidenceThreshold: 85,
    createdAt: '2026-03-11',
    qualityRules: [
      { id: 'QR-7', defectType: 'Blowhole / Porosity', maxAllowedCount: 0, criticalThresholdConfidence: 82, autoReject: true },
      { id: 'QR-8', defectType: 'Thread Burrs', maxAllowedCount: 1, criticalThresholdConfidence: 85, autoReject: false }
    ]
  },
  {
    id: 'PRD-4012',
    name: 'Sealed Deep-Groove Ball Bearing 6204',
    category: 'Industrial Rotating Machinery',
    description: 'Grade 5 precision ball bearing. Inspected for race flaking, roller micro-cracks, and seal displacement.',
    status: 'active',
    confidenceThreshold: 90,
    createdAt: '2026-04-05',
    qualityRules: [
      { id: 'QR-9', defectType: 'Roller Micro-crack', maxAllowedCount: 0, criticalThresholdConfidence: 85, autoReject: true },
      { id: 'QR-10', defectType: 'Seal Deformation', maxAllowedCount: 0, criticalThresholdConfidence: 88, autoReject: true }
    ]
  }
];

export const INITIAL_BATCHES: Batch[] = [
  {
    id: 'BATCH-102',
    productId: 'PRD-1024',
    productName: 'Rolled Precision Steel Plate 12mm',
    productionDate: '2026-10-09',
    shift: 'Morning (06:00 - 14:00)',
    quantity: 1248,
    inspectedQuantity: 1248,
    passedQuantity: 1086,
    rejectedQuantity: 162,
    status: 'In Production',
    qualityScore: 87.0
  },
  {
    id: 'BATCH-103',
    productId: 'PRD-2048',
    productName: 'Multi-Layer Power Controller PCB',
    productionDate: '2026-10-09',
    shift: 'Morning (06:00 - 14:00)',
    quantity: 850,
    inspectedQuantity: 720,
    passedQuantity: 694,
    rejectedQuantity: 26,
    status: 'Inspection In Progress',
    qualityScore: 96.4
  },
  {
    id: 'BATCH-101',
    productId: 'PRD-4012',
    productName: 'Sealed Deep-Groove Ball Bearing 6204',
    productionDate: '2026-10-08',
    shift: 'Afternoon (14:00 - 22:00)',
    quantity: 2100,
    inspectedQuantity: 2100,
    passedQuantity: 1980,
    rejectedQuantity: 120,
    status: 'Completed',
    qualityScore: 94.3
  },
  {
    id: 'BATCH-100',
    productId: 'PRD-3090',
    productName: 'Heavy Duty Flanged Hub Assembly',
    productionDate: '2026-10-08',
    shift: 'Night (22:00 - 06:00)',
    quantity: 600,
    inspectedQuantity: 600,
    passedQuantity: 522,
    rejectedQuantity: 78,
    status: 'Quarantined',
    qualityScore: 87.0
  }
];

export const INITIAL_INSPECTIONS: Inspection[] = [
  {
    id: 'INSP-2041',
    productId: 'PRD-1024',
    productName: 'Rolled Precision Steel Plate 12mm',
    productCategory: 'Structural Metallurgy',
    batchId: 'BATCH-102',
    timestamp: '2026-10-09 11:28:40',
    operatorId: 'USR-002',
    operatorName: 'Elena Rostova',
    result: 'FAIL',
    overallConfidence: 94.7,
    overallSeverity: 'HIGH',
    imageUrl: SAMPLE_IMAGES.steelPlateDefect,
    modelVersion: 'EdgeVision-ResNet101-v3.4',
    defects: [
      {
        id: 'DEF-01',
        type: 'Surface Crack',
        confidence: 94.7,
        severity: 'HIGH',
        location: 'Zone B2 (Central-Left)',
        box: { x: 28, y: 32, width: 26, height: 16 },
        description: 'Transverse micro-fissure along longitudinal rolling direction.'
      },
      {
        id: 'DEF-02',
        type: 'Slag Inclusion',
        confidence: 89.2,
        severity: 'MEDIUM',
        location: 'Zone D4 (Lower-Right)',
        box: { x: 67, y: 55, width: 14, height: 18 },
        description: 'Localized mineral impurity entrapped beneath outer skin.'
      }
    ],
    recommendation: {
      possibleCause: 'Cooling roll pressure disparity or thermal quenching gradient.',
      processCheck: 'Verify roller station #4 hydraulic pressure calibration and water spray nozzle alignment.',
      suggestedAction: 'Reject piece immediately. Inspect upstream rolling mill bearing temperature.'
    },
    operatorDecision: 'Remove Product',
    rejectionReason: 'Exceeded critical defect threshold: Transverse crack present.',
    verification: {
      isVerified: true,
      decision: 'Correct',
      remarks: 'Confirmed crack severity exceeds ASTME-45 standards.',
      reviewer: 'Elena Rostova',
      verifiedAt: '2026-10-09 11:30:10'
    }
  },
  {
    id: 'INSP-2040',
    productId: 'PRD-1024',
    productName: 'Rolled Precision Steel Plate 12mm',
    productCategory: 'Structural Metallurgy',
    batchId: 'BATCH-102',
    timestamp: '2026-10-09 11:24:12',
    operatorId: 'USR-002',
    operatorName: 'Elena Rostova',
    result: 'PASS',
    overallConfidence: 98.4,
    overallSeverity: 'NONE',
    imageUrl: SAMPLE_IMAGES.cleanPart,
    modelVersion: 'EdgeVision-ResNet101-v3.4',
    defects: [],
    recommendation: {
      possibleCause: 'Normal operational variance within standard tolerances.',
      processCheck: 'Regular periodic sensor recalibration.',
      suggestedAction: 'Allow automated conveyancing to continue to next finishing cell.'
    },
    operatorDecision: 'Accepted'
  },
  {
    id: 'INSP-2039',
    productId: 'PRD-2048',
    productName: 'Multi-Layer Power Controller PCB',
    productCategory: 'Electronics & Avionics',
    batchId: 'BATCH-103',
    timestamp: '2026-10-09 11:15:05',
    operatorId: 'USR-003',
    operatorName: 'Kenji Takahashi',
    result: 'FAIL',
    overallConfidence: 96.1,
    overallSeverity: 'CRITICAL',
    imageUrl: SAMPLE_IMAGES.pcbDefect,
    modelVersion: 'AoiNeural-SMD-v4.1',
    defects: [
      {
        id: 'DEF-03',
        type: 'Solder Bridge',
        confidence: 96.1,
        severity: 'CRITICAL',
        location: 'IC-Pin Pad 14-15',
        box: { x: 62, y: 32, width: 14, height: 12 },
        description: 'Excessive solder paste bridging adjacent microcontroller high-voltage pins.'
      }
    ],
    recommendation: {
      possibleCause: 'Stencil clogging at 0.3mm pitch sector or reflow profiling peak overshoot.',
      processCheck: 'Examine stencil wipe cycle counter and flux viscosity.',
      suggestedAction: 'Halt SMD line 2 board feeder for aperture wipe.'
    },
    operatorDecision: 'Remove Product',
    rejectionReason: 'Critical short-circuit hazard detected on high-voltage IC pins.'
  },
  {
    id: 'INSP-2038',
    productId: 'PRD-4012',
    productName: 'Sealed Deep-Groove Ball Bearing 6204',
    productCategory: 'Industrial Rotating Machinery',
    batchId: 'BATCH-101',
    timestamp: '2026-10-09 10:55:18',
    operatorId: 'USR-002',
    operatorName: 'Elena Rostova',
    result: 'MANUAL REVIEW',
    overallConfidence: 78.4,
    overallSeverity: 'MEDIUM',
    imageUrl: SAMPLE_IMAGES.bearingFlaw,
    modelVersion: 'RotaryVision-v2.0',
    defects: [
      {
        id: 'DEF-04',
        type: 'Ball Surface Anomaly',
        confidence: 78.4,
        severity: 'MEDIUM',
        location: 'Top Ball Bearing Sector',
        box: { x: 47, y: 19, width: 8, height: 8 },
        description: 'Specular reflection anomaly or micro-scratch near contact track.'
      }
    ],
    recommendation: {
      possibleCause: 'Ambient ring lighting glare mimicking surface scratch.',
      processCheck: 'Inspect optical diffuse dome illuminator cleanliness.',
      suggestedAction: 'Send to manual optical microscope station for verification.'
    },
    operatorDecision: 'Sent for Manual Review',
    verification: {
      isVerified: false
    }
  },
  {
    id: 'INSP-2037',
    productId: 'PRD-1024',
    productName: 'Rolled Precision Steel Plate 12mm',
    productCategory: 'Structural Metallurgy',
    batchId: 'BATCH-102',
    timestamp: '2026-10-09 10:42:01',
    operatorId: 'USR-002',
    operatorName: 'Elena Rostova',
    result: 'PASS',
    overallConfidence: 99.1,
    overallSeverity: 'NONE',
    imageUrl: SAMPLE_IMAGES.cleanPart,
    modelVersion: 'EdgeVision-ResNet101-v3.4',
    defects: [],
    operatorDecision: 'Accepted'
  },
  {
    id: 'INSP-2036',
    productId: 'PRD-3090',
    productName: 'Heavy Duty Flanged Hub Assembly',
    productCategory: 'Automotive Powertrain',
    batchId: 'BATCH-100',
    timestamp: '2026-10-08 21:14:30',
    operatorId: 'USR-003',
    operatorName: 'Kenji Takahashi',
    result: 'INSPECTION ERROR',
    overallConfidence: 42.0,
    overallSeverity: 'LOW',
    imageUrl: SAMPLE_IMAGES.steelPlateDefect,
    modelVersion: 'MachinedFeature-v2.5',
    defects: [],
    recommendation: {
      possibleCause: 'Camera lens condensation or conveyor strobe synchronization jitter.',
      processCheck: 'Clean optical lens shroud and trigger photocell.',
      suggestedAction: 'Rerun cycle with manual trigger.'
    },
    notes: 'Trigger frame blur exceeded motion threshold.'
  }
];

export const INITIAL_ALERTS: Alert[] = [
  {
    id: 'ALT-501',
    type: 'CRITICAL DEFECT',
    title: 'Critical Crack Detected',
    message: 'High-severity surface crack detected on steel plate. Automatic reject triggered.',
    productId: 'PRD-1024',
    batchId: 'BATCH-102',
    inspectionId: 'INSP-2041',
    timestamp: '2026-10-09 11:28:40',
    severity: 'CRITICAL',
    status: 'unacknowledged'
  },
  {
    id: 'ALT-502',
    type: 'HIGH DEFECT RATE',
    title: 'Batch Rejection Rate Spiked',
    message: 'Batch BATCH-102 defect ratio reached 13.0%, surpassing nominal threshold 8.0%.',
    productId: 'PRD-1024',
    batchId: 'BATCH-102',
    timestamp: '2026-10-09 11:25:00',
    severity: 'HIGH',
    status: 'unacknowledged'
  },
  {
    id: 'ALT-503',
    type: 'MANUAL REVIEW REQUIRED',
    title: 'Low Confidence Anomaly Flagged',
    message: 'Inspection #INSP-2038 confidence is 78.4% (< 85% rule). Operator inspection required.',
    productId: 'PRD-4012',
    batchId: 'BATCH-101',
    inspectionId: 'INSP-2038',
    timestamp: '2026-10-09 10:55:18',
    severity: 'MEDIUM',
    status: 'unacknowledged'
  },
  {
    id: 'ALT-504',
    type: 'QUALITY RISK',
    title: 'Repeated Solder Bridge Trend',
    message: '3 consecutive solder bridge incidents detected on SMD controller Line 2.',
    productId: 'PRD-2048',
    batchId: 'BATCH-103',
    timestamp: '2026-10-09 10:30:15',
    severity: 'HIGH',
    status: 'acknowledged',
    acknowledgedBy: 'Marcus Vance',
    acknowledgedAt: '2026-10-09 10:40:00'
  },
  {
    id: 'ALT-505',
    type: 'INSPECTION ERROR',
    title: 'Frame Blur Sensor Interruption',
    message: 'Optical frame dropped on Hub Assembly conveyor photocell #3.',
    productId: 'PRD-3090',
    batchId: 'BATCH-100',
    inspectionId: 'INSP-2036',
    timestamp: '2026-10-08 21:14:30',
    severity: 'LOW',
    status: 'acknowledged',
    acknowledgedBy: 'Kenji Takahashi',
    acknowledgedAt: '2026-10-08 21:18:00'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-901',
    userId: 'USR-002',
    userName: 'Elena Rostova',
    action: 'Product Removal',
    date: '2026-10-09',
    time: '11:29:10',
    record: 'INSP-2041 (PRD-1024)',
    reason: 'Confirmed critical crack in Zone B2. Conveyor diverter activated.'
  },
  {
    id: 'AUD-902',
    userId: 'USR-002',
    userName: 'Elena Rostova',
    action: 'Result Correction',
    date: '2026-10-09',
    time: '11:30:10',
    record: 'INSP-2041 (PRD-1024)',
    reason: 'Verified AI prediction as Correct under ASTM standards.'
  },
  {
    id: 'AUD-903',
    userId: 'USR-001',
    userName: 'Marcus Vance',
    action: 'Settings Changed',
    date: '2026-10-09',
    time: '09:15:22',
    record: 'Global Thresholds',
    reason: 'Adjusted minimum confidence threshold from 80% to 85% for PRD-1024.'
  },
  {
    id: 'AUD-904',
    userId: 'USR-002',
    userName: 'Elena Rostova',
    action: 'Login',
    date: '2026-10-09',
    time: '06:02:11',
    record: 'Terminal #2 (Station Alpha)',
    reason: 'Operator shift check-in.'
  },
  {
    id: 'AUD-905',
    userId: 'USR-001',
    userName: 'Marcus Vance',
    action: 'Batch Created',
    date: '2026-10-09',
    time: '05:45:00',
    record: 'BATCH-102',
    reason: 'Scheduled morning shift batch production run (1,248 units).'
  }
];

export const INITIAL_MODEL_METRIC: ModelMetric = {
  name: 'EdgeVision-ResNet101-DefectCore',
  version: 'v3.4.2-prod',
  lastTrained: '2026-09-28 04:30 UTC',
  precision: 96.8,
  recall: 95.4,
  f1Score: 96.1,
  mAP: 94.2,
  datasetSize: 148500,
  classes: [
    { className: 'Surface Crack', precision: 97.4, recall: 96.1, f1Score: 96.7, sampleCount: 34200 },
    { className: 'Slag Inclusion', precision: 95.8, recall: 94.2, f1Score: 95.0, sampleCount: 28400 },
    { className: 'Solder Bridge', precision: 98.2, recall: 97.9, f1Score: 98.0, sampleCount: 41200 },
    { className: 'Cold Solder', precision: 94.1, recall: 92.8, f1Score: 93.4, sampleCount: 19500 },
    { className: 'Porosity / Blowhole', precision: 96.0, recall: 95.2, f1Score: 95.6, sampleCount: 25200 }
  ],
  confusionMatrix: {
    labels: ['Crack', 'Inclusion', 'Solder Bridge', 'Porosity', 'Clean'],
    matrix: [
      [962, 14, 2, 8, 14],
      [18, 940, 0, 22, 20],
      [0, 1, 982, 0, 17],
      [11, 24, 0, 951, 14],
      [9, 12, 11, 8, 1960]
    ]
  }
};

export const INITIAL_SETTINGS: AppSettings = {
  confidenceThreshold: 85,
  alertThresholdPercent: 10,
  soundEnabled: true,
  browserAlerts: true,
  emailAlerts: false,
  cameraSource: 'Industrial GigE Camera #01 (Lens 25mm)',
  resolution: '1920x1080 @ 60 FPS',
  targetFps: 30,
  autoResumeOnPass: true
};
