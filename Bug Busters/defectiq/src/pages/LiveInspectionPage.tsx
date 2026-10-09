import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../lib/store';
import { InspectionViewer } from '../components/inspection/InspectionViewer';
import { ProductInfoPanel } from '../components/inspection/ProductInfoPanel';
import { RemoveProductModal } from '../components/common/RemoveProductModal';
import { Inspection, DefectItem } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';
import {
  Boxes,
  Layers,
  Sparkles,
  Camera,
  RotateCw,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface LiveInspectionPageProps {
  onNavigate: (path: string) => void;
}

export const LiveInspectionPage: React.FC<LiveInspectionPageProps> = ({ onNavigate }) => {
  const {
    products,
    batches,
    activeProductId,
    setActiveProductId,
    activeBatchId,
    setActiveBatchId,
    inspections,
    addInspection,
    rejectAndRemoveProduct,
    liveInspectionCounter,
    incrementInspectionCounter,
    currentUser,
    settings
  } = useApp();

  // Active product & batch objects
  const selectedProduct = products.find(p => p.id === activeProductId) || products[0];
  const selectedBatch = batches.find(b => b.id === activeBatchId) || batches[0];

  // Inspection states
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(() => inspections[0] || null);
  const [isInspecting, setIsInspecting] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(29.8);
  const [useWebcam, setUseWebcam] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [autoLoopActive, setAutoLoopActive] = useState<boolean>(true);

  // Webcam video element ref & stream ref
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // FPS simulation jitter
  useEffect(() => {
    if (!isInspecting || isPaused) return;
    const interval = setInterval(() => {
      setFps(28 + Math.random() * 3.5);
    }, 1200);
    return () => clearInterval(interval);
  }, [isInspecting, isPaused]);

  // Handle webcam toggle
  const toggleCamera = async () => {
    if (useWebcam) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setUseWebcam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setUseWebcam(true);
      } catch (err) {
        console.warn('Webcam permission not granted or device not available:', err);
        alert('Camera device access unavailable or permission denied. Reverting to optical simulation.');
        setUseWebcam(false);
      }
    }
  };

  // Cleanup webcam stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Preset defect generator
  const triggerPresetInspection = (presetKey: string) => {
    incrementInspectionCounter();
    const newId = `INSP-${Math.floor(2050 + Math.random() * 400)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    if (presetKey === 'cleanPart') {
      const passInsp: Inspection = {
        id: newId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        batchId: selectedBatch.id,
        timestamp: now,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'PASS',
        overallConfidence: 99.2,
        overallSeverity: 'NONE',
        imageUrl: SAMPLE_IMAGES.cleanPart,
        modelVersion: 'EdgeVision-ResNet101-v3.4',
        defects: [],
        recommendation: {
          possibleCause: 'Zero surface variance. Optical reflectance conforms to Grade-A standard.',
          processCheck: 'Periodic sensor calibration routine.',
          suggestedAction: 'Allow automated conveyor to route to packaging cell.'
        },
        operatorDecision: 'Accepted'
      };
      setCurrentInspection(passInsp);
      addInspection(passInsp);

      // Automatic continuation loop for PASS
      if (settings.autoResumeOnPass && autoLoopActive) {
        // Continue detection loop
      }
    } else if (presetKey === 'steelCrack') {
      const crackInsp: Inspection = {
        id: newId,
        productId: 'PRD-1024',
        productName: 'Rolled Precision Steel Plate 12mm',
        productCategory: 'Structural Metallurgy',
        batchId: selectedBatch.id,
        timestamp: now,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'FAIL',
        overallConfidence: 95.8,
        overallSeverity: 'HIGH',
        imageUrl: SAMPLE_IMAGES.steelPlateDefect,
        modelVersion: 'EdgeVision-ResNet101-v3.4',
        defects: [
          {
            id: 'DEF-CRK',
            type: 'Surface Crack',
            confidence: 95.8,
            severity: 'HIGH',
            location: 'Zone B2 (Central-Left)',
            box: { x: 28, y: 32, width: 26, height: 16 },
            description: 'Transverse micro-crack along longitudinal rolling direction.'
          }
        ],
        recommendation: {
          possibleCause: 'Cooling roll pressure disparity or thermal quenching gradient.',
          processCheck: 'Check roll stand #4 hydraulic cylinder pressure and cooling manifold.',
          suggestedAction: 'Divert workpiece immediately. Alert metallurgical supervisor.'
        }
      };
      setCurrentInspection(crackInsp);
      addInspection(crackInsp);
      setIsPaused(true); // Halt on defect per workflow
    } else if (presetKey === 'pcbBridge') {
      const pcbInsp: Inspection = {
        id: newId,
        productId: 'PRD-2048',
        productName: 'Multi-Layer Power Controller PCB',
        productCategory: 'Electronics & Avionics',
        batchId: 'BATCH-103',
        timestamp: now,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'FAIL',
        overallConfidence: 96.4,
        overallSeverity: 'CRITICAL',
        imageUrl: SAMPLE_IMAGES.pcbDefect,
        modelVersion: 'AoiNeural-SMD-v4.1',
        defects: [
          {
            id: 'DEF-BRG',
            type: 'Solder Bridge',
            confidence: 96.4,
            severity: 'CRITICAL',
            location: 'IC Pin Sector 14-15',
            box: { x: 62, y: 32, width: 14, height: 12 },
            description: 'Short circuit solder accumulation bridging controller leads.'
          }
        ],
        recommendation: {
          possibleCause: 'Excessive solder paste deposition or aperture misalignment.',
          processCheck: 'Execute automated stencil under-wipe cycle and check solder paste rheology.',
          suggestedAction: 'Divert board to rework bin; pause SMD line if defect repeats.'
        }
      };
      setCurrentInspection(pcbInsp);
      addInspection(pcbInsp);
      setIsPaused(true);
    } else if (presetKey === 'uncertain') {
      const reviewInsp: Inspection = {
        id: newId,
        productId: 'PRD-4012',
        productName: 'Sealed Deep-Groove Ball Bearing 6204',
        productCategory: 'Industrial Rotating Machinery',
        batchId: 'BATCH-101',
        timestamp: now,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'MANUAL REVIEW',
        overallConfidence: 77.2,
        overallSeverity: 'MEDIUM',
        imageUrl: SAMPLE_IMAGES.bearingFlaw,
        modelVersion: 'RotaryVision-v2.0',
        defects: [
          {
            id: 'DEF-UNC',
            type: 'Specular Anomaly',
            confidence: 77.2,
            severity: 'MEDIUM',
            location: 'Upper Race Orbit',
            box: { x: 47, y: 19, width: 8, height: 8 },
            description: 'Glitter/optical flare or shallow scratch on bearing contact track.'
          }
        ],
        recommendation: {
          possibleCause: 'Ring lighting glare reflection mimicking surface scratch.',
          processCheck: 'Inspect diffuser ring cleanliness.',
          suggestedAction: 'Manual operator inspection required under polarising microscope.'
        }
      };
      setCurrentInspection(reviewInsp);
      addInspection(reviewInsp);
    }
  };

  // Custom File Upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      incrementInspectionCounter();
      const newId = `INSP-${Math.floor(2050 + Math.random() * 400)}`;
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

      // Analyze or generate bounding box for test image
      const customInsp: Inspection = {
        id: newId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        batchId: selectedBatch.id,
        timestamp: now,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'FAIL',
        overallConfidence: 91.5,
        overallSeverity: 'HIGH',
        imageUrl: dataUrl,
        modelVersion: 'EdgeVision-ResNet101-v3.4',
        defects: [
          {
            id: 'DEF-UPLOAD',
            type: 'Surface Non-Conformity',
            confidence: 91.5,
            severity: 'HIGH',
            location: 'Center Region',
            box: { x: 35, y: 30, width: 30, height: 25 },
            description: `Detected in uploaded file "${file.name}".`
          }
        ],
        recommendation: {
          possibleCause: 'Surface defect detected via uploaded optical capture.',
          processCheck: 'Confirm dimensional tolerance with mechanical gauge.',
          suggestedAction: 'Review defect markers.'
        }
      };
      setCurrentInspection(customInsp);
      addInspection(customInsp);
      setIsPaused(true);
    };
    reader.readAsDataURL(file);
  };

  // Operator Actions
  const handleStartInspection = () => {
    setIsInspecting(true);
    setIsPaused(false);
    triggerPresetInspection('cleanPart');
  };

  const handlePauseInspection = () => {
    setIsPaused(true);
  };

  const handleResumeInspection = () => {
    setIsPaused(false);
    triggerPresetInspection('cleanPart');
  };

  const handleRetryInspection = () => {
    if (currentInspection) {
      triggerPresetInspection('cleanPart');
    }
  };

  const handleConfirmRemoval = (reason: string) => {
    if (currentInspection) {
      rejectAndRemoveProduct(currentInspection.id, reason);
      setCurrentInspection(prev => prev ? {
        ...prev,
        result: 'FAIL',
        operatorDecision: 'Remove Product',
        rejectionReason: reason
      } : null);
      // Resume detection loop
      setTimeout(() => {
        setIsPaused(false);
        triggerPresetInspection('cleanPart');
      }, 600);
    }
  };

  const handleSendManualReview = () => {
    if (currentInspection) {
      setCurrentInspection(prev => prev ? {
        ...prev,
        result: 'MANUAL REVIEW',
        operatorDecision: 'Sent for Manual Review'
      } : null);
    }
  };

  const handleAcceptProduct = () => {
    if (currentInspection) {
      setCurrentInspection(prev => prev ? {
        ...prev,
        result: 'PASS',
        operatorDecision: 'Accepted'
      } : null);
    }
  };

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* 7.1 Inspection Page Header & Selection Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-[#172338] tracking-tight">
              Live Inspection Workspace
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#4169E1] border border-blue-200">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse'}`} />
              {isPaused ? 'DETECTION PAUSED' : 'CONTINUOUS ACTIVE'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            High-speed optical inspection line & real-time automated defect classifier
          </p>
        </div>

        {/* Product & Batch Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Product selector */}
          <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-xs">
            <Boxes size={15} className="text-[#4169E1]" />
            <span className="text-slate-400 font-medium">Product:</span>
            <select
              value={activeProductId}
              onChange={(e) => setActiveProductId(e.target.value)}
              className="bg-transparent font-semibold text-[#172338] focus:outline-none cursor-pointer"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Batch selector */}
          <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-xs">
            <Layers size={15} className="text-[#7563E8]" />
            <span className="text-slate-400 font-medium">Batch:</span>
            <select
              value={activeBatchId}
              onChange={(e) => setActiveBatchId(e.target.value)}
              className="bg-transparent font-semibold text-[#172338] focus:outline-none cursor-pointer"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} ({b.shift.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 60:40 Desktop Workspace Layout (Section 7.0 & 7.2 & 7.3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left 60%: Optical Inspection Viewer */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
          <InspectionViewer
            currentInspection={currentInspection}
            isInspecting={isInspecting}
            cameraActive={isInspecting}
            fps={fps}
            counter={liveInspectionCounter}
            isPaused={isPaused}
            onToggleCamera={toggleCamera}
            onFileUpload={handleFileUpload}
            onSelectPreset={triggerPresetInspection}
            videoRef={videoRef}
            useWebcam={useWebcam}
          />
        </div>

        {/* Right 40%: Product Information & AI Diagnostics Panel */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
          <ProductInfoPanel
            inspection={currentInspection}
            product={selectedProduct}
            batch={selectedBatch}
            isInspecting={isInspecting}
            isPaused={isPaused}
            onStartInspection={handleStartInspection}
            onPauseInspection={handlePauseInspection}
            onResumeInspection={handleResumeInspection}
            onRetryInspection={handleRetryInspection}
            onOpenRemoveModal={() => setIsRemoveModalOpen(true)}
            onSendManualReview={handleSendManualReview}
            onAcceptProduct={handleAcceptProduct}
            onViewDetails={(id) => onNavigate(`/inspections/${id}`)}
          />
        </div>
      </div>

      {/* Remove Product Confirmation Modal (Section 7.7) */}
      <RemoveProductModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        inspection={currentInspection}
        onConfirm={handleConfirmRemoval}
      />
    </div>
  );
};
