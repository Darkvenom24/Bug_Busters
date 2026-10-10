import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../lib/store';
import { InspectionViewer } from '../components/inspection/InspectionViewer';
import { ProductInfoPanel } from '../components/inspection/ProductInfoPanel';
import { RemoveProductModal } from '../components/common/RemoveProductModal';
import { Inspection, DefectItem, QualityStatus, Severity } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';
import {
  checkBackendHealth,
  fetchBackendInspections,
  fetchBackendStats,
  postBackendInspection,
  BackendAnalyticsStats
} from '../lib/inspectionApi';
import {
  Boxes,
  Layers,
  Sparkles,
  Camera,
  RotateCw,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Activity,
  Zap,
  Radio,
  Server,
  Play,
  Pause,
  RefreshCw,
  Clock,
  ShieldCheck,
  Flame,
  ArrowRight
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
    inspections: storeInspections,
    addInspection,
    rejectAndRemoveProduct,
    liveInspectionCounter,
    incrementInspectionCounter,
    currentUser,
    settings
  } = useApp();

  // Active product & batch objects from store
  const selectedProduct = products.find(p => p.id === activeProductId) || products[0];
  const selectedBatch = batches.find(b => b.id === activeBatchId) || batches[0];

  // Primary inspection states
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(() => storeInspections[0] || null);
  const [recentFeed, setRecentFeed] = useState<Inspection[]>(() => storeInspections.slice(0, 8));
  const [isInspecting, setIsInspecting] = useState<boolean>(true);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(29.8);
  const [useWebcam, setUseWebcam] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);

  // Backend connection & real-time stats
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendLatency, setBackendLatency] = useState<number>(0);
  const [backendStats, setBackendStats] = useState<BackendAnalyticsStats | null>(null);
  const [autoLoopActive, setAutoLoopActive] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  // Webcam stream refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const loopTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial Backend Health Check and Initial Ingestion Sync
  const syncWithBackend = useCallback(async () => {
    try {
      const health = await checkBackendHealth();
      setBackendConnected(health.ok);
      setBackendLatency(health.latencyMs);

      if (health.ok) {
        const [inspRes, statsRes] = await Promise.allSettled([
          fetchBackendInspections(12),
          fetchBackendStats()
        ]);

        if (inspRes.status === 'fulfilled' && inspRes.value.items.length > 0) {
          const fetchedItems = inspRes.value.items;
          setRecentFeed(fetchedItems);
          // Set current inspection to latest if none or currently showing older
          setCurrentInspection(prev => {
            if (!prev) return fetchedItems[0];
            // If already viewing one, check if there's a newer one
            return fetchedItems[0] || prev;
          });
        }

        if (statsRes.status === 'fulfilled' && statsRes.value) {
          setBackendStats(statsRes.value);
        }

        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Backend sync error:', err);
      setBackendConnected(false);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
    // Poll backend every 6 seconds to capture background camera events
    const pollInterval = setInterval(() => {
      syncWithBackend();
    }, 6000);
    return () => clearInterval(pollInterval);
  }, [syncWithBackend]);

  // 2. FPS Jitter Simulation
  useEffect(() => {
    if (!isInspecting || isPaused) return;
    const interval = setInterval(() => {
      setFps(28 + Math.random() * 3.5);
    }, 1200);
    return () => clearInterval(interval);
  }, [isInspecting, isPaused]);

  // 3. Automated Live Conveyor Inspection Stream
  const triggerDynamicInspection = useCallback(async (presetType?: string, customImage?: string) => {
    setIsAnalyzing(true);
    incrementInspectionCounter();

    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newId = `INSP-${Math.floor(2100 + Math.random() * 500)}`;

    // Determine type: if presetType is given, use it; otherwise randomize realistic conveyor distribution
    let mode = presetType;
    if (!mode) {
      // 70% chance of PASS, 30% chance of defect
      const roll = Math.random();
      if (roll < 0.70) {
        mode = 'cleanPart';
      } else if (roll < 0.85) {
        mode = 'steelCrack';
      } else {
        mode = 'pcbBridge';
      }
    }

    let payload: any;
    let localInspection: Inspection;

    if (mode === 'cleanPart') {
      payload = {
        product_name: selectedProduct.name,
        batch_number: selectedBatch.id,
        confidence_score: 0.992,
        status: 'PASS',
        defects: [],
        evidence: [{ image_url: customImage || SAMPLE_IMAGES.cleanPart }]
      };

      localInspection = {
        id: newId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        batchId: selectedBatch.id,
        timestamp,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'PASS',
        overallConfidence: 99.2,
        overallSeverity: 'NONE',
        imageUrl: customImage || SAMPLE_IMAGES.cleanPart,
        modelVersion: 'EdgeVision-ResNet101-v3.4',
        defects: [],
        recommendation: {
          possibleCause: 'Zero surface variance. Optical reflectance conforms to Grade-A standard.',
          processCheck: 'Periodic sensor calibration routine.',
          suggestedAction: 'Allow automated conveyor to route to packaging cell.'
        },
        operatorDecision: 'Accepted'
      };
    } else if (mode === 'steelCrack') {
      payload = {
        product_name: 'Rolled Precision Steel Plate 12mm',
        batch_number: selectedBatch.id,
        confidence_score: 0.958,
        status: 'FAIL',
        defects: [
          {
            category: 'Surface Crack',
            bounding_box: { x: 28, y: 32, width: 26, height: 16 },
            confidence: 0.958
          }
        ],
        evidence: [{ image_url: customImage || SAMPLE_IMAGES.steelPlateDefect }]
      };

      localInspection = {
        id: newId,
        productId: 'PRD-1024',
        productName: 'Rolled Precision Steel Plate 12mm',
        productCategory: 'Structural Metallurgy',
        batchId: selectedBatch.id,
        timestamp,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'FAIL',
        overallConfidence: 95.8,
        overallSeverity: 'HIGH',
        imageUrl: customImage || SAMPLE_IMAGES.steelPlateDefect,
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
    } else if (mode === 'pcbBridge') {
      payload = {
        product_name: 'Multi-Layer Power Controller PCB',
        batch_number: 'BATCH-103',
        confidence_score: 0.964,
        status: 'FAIL',
        defects: [
          {
            category: 'Solder Bridge',
            bounding_box: { x: 62, y: 32, width: 14, height: 12 },
            confidence: 0.964
          }
        ],
        evidence: [{ image_url: customImage || SAMPLE_IMAGES.pcbDefect }]
      };

      localInspection = {
        id: newId,
        productId: 'PRD-2048',
        productName: 'Multi-Layer Power Controller PCB',
        productCategory: 'Electronics & Avionics',
        batchId: 'BATCH-103',
        timestamp,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'FAIL',
        overallConfidence: 96.4,
        overallSeverity: 'CRITICAL',
        imageUrl: customImage || SAMPLE_IMAGES.pcbDefect,
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
    } else {
      // General defect / Edge trigger
      payload = {
        product_name: selectedProduct.name,
        batch_number: selectedBatch.id,
        confidence_score: 0.925,
        status: 'FAIL',
        defects: [
          {
            category: 'Surface Dent',
            bounding_box: { x: 38, y: 35, width: 22, height: 18 },
            confidence: 0.925
          }
        ],
        evidence: [{ image_url: customImage || SAMPLE_IMAGES.steelPlateDefect }]
      };

      localInspection = {
        id: newId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productCategory: selectedProduct.category,
        batchId: selectedBatch.id,
        timestamp,
        operatorId: currentUser?.id || 'USR-002',
        operatorName: currentUser?.name || 'Operator',
        result: 'FAIL',
        overallConfidence: 92.5,
        overallSeverity: 'HIGH',
        imageUrl: customImage || SAMPLE_IMAGES.steelPlateDefect,
        modelVersion: 'EdgeVision-ResNet101-v3.4',
        defects: [
          {
            id: 'DEF-ANOM',
            type: 'Surface Dent',
            confidence: 92.5,
            severity: 'HIGH',
            location: 'Center Zone C3',
            box: { x: 38, y: 35, width: 22, height: 18 },
            description: 'Depression anomaly exceeding depth tolerance.'
          }
        ],
        recommendation: {
          possibleCause: 'Tooling impact during mechanical handling transfer.',
          processCheck: 'Inspect manipulator clamp pads and cushion bumpers.',
          suggestedAction: 'Isolate component and measure indentation depth.'
        }
      };
    }

    // Try posting to FastAPI backend to save real record in SQLite database
    let finalInspection = localInspection;
    if (backendConnected) {
      try {
        const saved = await postBackendInspection(payload);
        finalInspection = {
          ...saved,
          imageUrl: customImage || saved.imageUrl
        };
      } catch (err) {
        console.warn('Backend ingestion failed, using fallback:', err);
      }
    }

    setCurrentInspection(finalInspection);
    addInspection(finalInspection);
    setRecentFeed(prev => [finalInspection, ...prev.slice(0, 9)]);
    setIsAnalyzing(false);

    // Halt conveyor if defect encountered
    if (finalInspection.result === 'FAIL') {
      setIsPaused(true);
    }
  }, [backendConnected, currentUser, incrementInspectionCounter, selectedBatch.id, selectedProduct, addInspection]);

  // 4. Automated Conveyor Interval Loop
  useEffect(() => {
    if (!autoLoopActive || !isInspecting || isPaused) {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
      return;
    }

    loopTimerRef.current = setInterval(() => {
      triggerDynamicInspection();
    }, 4500);

    return () => {
      if (loopTimerRef.current) clearInterval(loopTimerRef.current);
    };
  }, [autoLoopActive, isInspecting, isPaused, triggerDynamicInspection]);

  // 5. Handle Webcam Stream Toggle
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
        // Pause automated conveyor loop while using active webcam
        setAutoLoopActive(false);
      } catch (err) {
        console.warn('Webcam permission not granted or device not available:', err);
        alert('Camera device access unavailable or permission denied. Reverting to optical simulation.');
        setUseWebcam(false);
      }
    }
  };

  // 6. Webcam Snapshot Capture & Real-time AI Inspection
  const handleCaptureWebcam = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        // Run inspection with webcam frame
        triggerDynamicInspection('simulateEdge', dataUrl);
      }
    } catch (err) {
      console.error('Failed to capture frame from webcam:', err);
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

  // 7. Custom File Upload
  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      triggerDynamicInspection('simulateEdge', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // 8. Operator Controls
  const handleStartInspection = () => {
    setIsInspecting(true);
    setIsPaused(false);
    setAutoLoopActive(true);
    triggerDynamicInspection('cleanPart');
  };

  const handlePauseInspection = () => {
    setIsPaused(true);
  };

  const handleResumeInspection = () => {
    setIsPaused(false);
    setAutoLoopActive(true);
    triggerDynamicInspection('cleanPart');
  };

  const handleRetryInspection = () => {
    if (currentInspection) {
      triggerDynamicInspection(currentInspection.result === 'PASS' ? 'cleanPart' : 'steelCrack');
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

      // Auto-resume conveyor loop after defective piece removed
      setTimeout(() => {
        setIsPaused(false);
        setAutoLoopActive(true);
        triggerDynamicInspection('cleanPart');
      }, 700);
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
      // Resume conveyor
      setIsPaused(false);
    }
  };

  // Total and Pass metrics (computed live from backend stats or store)
  const displayTotal = backendStats ? backendStats.total_inspected : liveInspectionCounter;
  const displayPassRate = backendStats ? backendStats.pass_rate : 97.4;
  const displayDefectRate = backendStats ? backendStats.defect_rate : 2.6;

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto pb-6">
      {/* 1. Header & Live System Status Ribbon */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-[#172338] tracking-tight">
              Live Inspection Workspace
            </h2>

            {/* Line status badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isPaused
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : isInspecting
                ? 'bg-blue-50 text-[#4169E1] border-blue-200'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                isPaused ? 'bg-amber-500' : isInspecting ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`} />
              {isPaused ? 'DETECTION PAUSED' : isInspecting ? 'CONVEYOR ACTIVE' : 'SYSTEM STANDBY'}
            </span>

            {/* Backend connection pill */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              backendConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              <Server size={12} className={backendConnected ? 'text-emerald-600' : 'text-amber-500'} />
              <span>{backendConnected ? `FastAPI :8000 (${backendLatency}ms)` : 'Mock Simulation Mode'}</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Real-time optical defect classifier synchronized with edge camera inference logs.
          </p>
        </div>

        {/* Product & Batch Selectors + Mode Toggles */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Conveyor Auto-Stream Toggle */}
          <button
            onClick={() => {
              setAutoLoopActive(!autoLoopActive);
              if (!autoLoopActive && isPaused) setIsPaused(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              autoLoopActive
                ? 'bg-[#EDF3FF] text-[#4169E1] border-blue-200 hover:bg-blue-100'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle automated continuous feed of parts"
          >
            <Radio size={13} className={autoLoopActive ? 'text-[#4169E1] animate-pulse' : 'text-slate-400'} />
            <span>{autoLoopActive ? 'Auto Conveyor' : 'Manual Trigger'}</span>
          </button>

          {/* Product selector */}
          <div className="flex items-center gap-2 bg-[#F8FAFD] border border-[#E5EAF2] rounded-xl px-3 py-1.5 text-xs">
            <Boxes size={15} className="text-[#4169E1]" />
            <span className="text-slate-400 font-medium hidden sm:inline">Product:</span>
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
            <span className="text-slate-400 font-medium hidden sm:inline">Batch:</span>
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

          {/* Refresh backend sync */}
          <button
            onClick={syncWithBackend}
            title={`Last synced: ${lastSyncTime}. Click to refresh.`}
            className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-[#4169E1] hover:bg-slate-50 rounded-xl transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* 2. Live Dynamic KPI Micro-Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-[#E5EAF2] shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#4169E1]">
            <Activity size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Total Inspected</span>
            <span className="font-bold text-sm font-mono text-[#172338]">
              {displayTotal.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Yield / Pass Rate</span>
            <span className="font-bold text-sm font-mono text-emerald-700">
              {displayPassRate.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <Flame size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Defect Rate</span>
            <span className="font-bold text-sm font-mono text-rose-700">
              {displayDefectRate.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-[#7563E8]">
            <Zap size={18} />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Camera Line Speed</span>
            <span className="font-bold text-sm font-mono text-[#172338]">
              {fps.toFixed(1)} FPS
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recent Live Stream Carousel / Reel */}
      {recentFeed.length > 0 && (
        <div className="bg-white p-3 rounded-2xl border border-[#E5EAF2] shadow-xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Live Conveyor Stream
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Showing last {recentFeed.length} captures
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {recentFeed.map((item, idx) => {
              const isSelected = currentInspection?.id === item.id;
              const isItemPass = item.result === 'PASS';
              return (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => setCurrentInspection(item)}
                  className={`flex-shrink-0 flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#4169E1] bg-blue-50/70 shadow-xs'
                      : 'border-slate-200 bg-[#F8FAFD] hover:bg-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${isItemPass ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#172338]">
                        {item.id}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        isItemPass ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.result}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block truncate max-w-[110px]">
                      {item.productName || item.productId}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. 60:40 Desktop Workspace Layout */}
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
            onSelectPreset={(preset) => triggerDynamicInspection(preset)}
            videoRef={videoRef}
            useWebcam={useWebcam}
            onCaptureWebcam={handleCaptureWebcam}
            backendConnected={backendConnected}
            isAnalyzing={isAnalyzing}
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

      {/* 5. Remove Product Confirmation Modal */}
      <RemoveProductModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        inspection={currentInspection}
        onConfirm={handleConfirmRemoval}
      />
    </div>
  );
};
