import React, { useRef, useEffect } from 'react';
import { Inspection, DefectItem } from '../../types';
import { Camera, RefreshCw, Zap, ShieldAlert, CheckCircle2, AlertOctagon, Sliders } from 'lucide-react';

interface InspectionViewerProps {
  currentInspection: Inspection | null;
  isInspecting: boolean;
  cameraActive: boolean;
  fps: number;
  counter: number;
  isPaused: boolean;
  onToggleCamera: () => void;
  onFileUpload: (file: File) => void;
  onSelectPreset: (presetKey: string) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  useWebcam: boolean;
  onCaptureWebcam?: () => void;
  backendConnected?: boolean;
  isAnalyzing?: boolean;
}

export const InspectionViewer: React.FC<InspectionViewerProps> = ({
  currentInspection,
  isInspecting,
  cameraActive,
  fps,
  counter,
  isPaused,
  onToggleCamera,
  onFileUpload,
  onSelectPreset,
  videoRef,
  useWebcam,
  onCaptureWebcam,
  backendConnected = false,
  isAnalyzing = false
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getSeverityBorderColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-600 bg-red-600/15 text-red-700';
      case 'HIGH': return 'border-orange-500 bg-orange-500/15 text-orange-700';
      case 'MEDIUM': return 'border-amber-500 bg-amber-500/15 text-amber-700';
      default: return 'border-blue-500 bg-blue-500/15 text-blue-700';
    }
  };

  const getSeverityTagBg = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-600 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-amber-500 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
      {/* Viewer Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-[#E5EAF2] bg-[#F8FAFD]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                cameraActive ? (isPaused ? 'bg-amber-400' : 'bg-emerald-500 animate-pulse') : 'bg-slate-300'
              }`}
            />
            <span className="text-xs font-semibold text-[#172338]">
              {cameraActive ? (isPaused ? 'INSPECTION PAUSED' : 'LIVE CONVEYOR FEED') : 'FEED STANDBY'}
            </span>
          </div>

          <span className="text-slate-300 text-xs">|</span>

          <span className="font-mono text-xs font-medium text-slate-500">
            FRAME #{counter.toLocaleString()}
          </span>

          {backendConnected && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              API SYNCED
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {cameraActive && !isPaused && (
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Zap size={11} /> {fps.toFixed(1)} FPS
            </span>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleCamera}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
                useWebcam
                  ? 'bg-[#EDF3FF] text-[#4169E1] border-blue-200 hover:bg-blue-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title="Toggle Live Webcam Device"
            >
              <Camera size={13} />
              <span>{useWebcam ? 'Webcam Active' : 'Use Webcam'}</span>
            </button>

            {useWebcam && onCaptureWebcam && (
              <button
                onClick={onCaptureWebcam}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#4169E1] text-white hover:bg-[#3457C2] transition-colors flex items-center gap-1.5 shadow-2xs"
                title="Capture current video frame and run AI inspection"
              >
                <Camera size={13} />
                <span>Capture Frame</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Upload Test
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileUpload(file);
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Optical Display Area */}
      <div className="relative flex-1 min-h-[360px] sm:min-h-[440px] bg-[#0F172A] flex items-center justify-center overflow-hidden">
        {/* If Webcam is active */}
        {useWebcam ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-contain"
          />
        ) : (
          /* High-resolution preview image */
          currentInspection?.imageUrl ? (
            <img
              src={currentInspection.imageUrl}
              alt="Inspection component target"
              className="w-full h-full object-contain select-none"
            />
          ) : (
            <div className="text-center p-8 text-slate-400">
              <Camera size={44} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">Ready for Inspection</p>
              <p className="text-xs text-slate-500 mt-1">Select a sample preset or click Start Inspection</p>
            </div>
          )
        )}

        {/* Optical Scanning Beam Animation while actively scanning */}
        {isInspecting && !isPaused && (
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#4169E1] to-transparent shadow-[0_0_12px_#4169E1] pointer-events-none scanner-beam" />
        )}

        {/* Reticle / Industrial Alignment Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            {/* Center target crosshair */}
            <circle cx="50%" cy="50%" r="40" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="6 6" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="6 6" />
          </svg>
        </div>

        {/* Bounding Boxes Overlay for Detected Defects */}
        {currentInspection && currentInspection.defects && currentInspection.defects.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {currentInspection.defects.map((defect: DefectItem) => (
              <div
                key={defect.id}
                className={`absolute rounded border-2 transition-all duration-300 ${getSeverityBorderColor(defect.severity)}`}
                style={{
                  left: `${defect.box.x}%`,
                  top: `${defect.box.y}%`,
                  width: `${defect.box.width}%`,
                  height: `${defect.box.height}%`,
                }}
              >
                {/* Floating Tag with Label & Confidence */}
                <div
                  className={`absolute -top-7 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded shadow-md text-[11px] font-bold tracking-tight uppercase whitespace-nowrap ${getSeverityTagBg(
                    defect.severity
                  )}`}
                >
                  <span>{defect.type}</span>
                  <span className="font-mono text-[10px] opacity-90">{defect.confidence.toFixed(1)}%</span>
                </div>

                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white" />
              </div>
            ))}
          </div>
        )}

        {/* Inspection Status Watermark on bottom left of viewer */}
        <div className="absolute bottom-3 left-3 bg-[#0F172A]/85 backdrop-blur-md rounded-xl p-2.5 border border-slate-700/80 text-white pointer-events-none flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">STATUS</span>
            <span className="font-bold text-xs tracking-wide">
              {currentInspection?.result || 'AWAITING RUN'}
            </span>
          </div>
          <div className="h-6 w-px bg-slate-700" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">MODEL</span>
            <span className="font-mono text-[11px] text-slate-300">
              {currentInspection?.modelVersion || 'ResNet101-v3.4'}
            </span>
          </div>
        </div>

        {/* Analyzing / Processing AI Indicator */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-[#0F172A]/70 backdrop-blur-xs flex flex-col items-center justify-center pointer-events-none z-10 animate-in fade-in">
            <div className="w-10 h-10 rounded-full border-3 border-blue-500/30 border-t-blue-400 animate-spin mb-2" />
            <span className="text-xs font-semibold text-white tracking-wide">
              AI INFERENCE IN PROGRESS...
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
              Analyzing surface texture & bounding boxes
            </span>
          </div>
        )}

        {/* Quick Sample Presets bar inside viewer bottom-right */}
        <div className="absolute bottom-3 right-3 bg-[#0F172A]/85 backdrop-blur-md rounded-xl p-1.5 border border-slate-700/80 flex flex-wrap items-center gap-1 z-20">
          <span className="text-[10px] font-semibold text-slate-400 px-2 uppercase">Presets:</span>
          <button
            onClick={() => onSelectPreset('steelCrack')}
            className="px-2 py-1 text-[11px] font-medium bg-red-950/60 text-red-200 hover:bg-red-900 border border-red-800 rounded transition-colors"
          >
            Crack Defect
          </button>
          <button
            onClick={() => onSelectPreset('pcbBridge')}
            className="px-2 py-1 text-[11px] font-medium bg-orange-950/60 text-orange-200 hover:bg-orange-900 border border-orange-800 rounded transition-colors"
          >
            PCB Bridge
          </button>
          <button
            onClick={() => onSelectPreset('cleanPart')}
            className="px-2 py-1 text-[11px] font-medium bg-emerald-950/60 text-emerald-200 hover:bg-emerald-900 border border-emerald-800 rounded transition-colors"
          >
            Flawless (PASS)
          </button>
          <button
            onClick={() => onSelectPreset('simulateEdge')}
            className="px-2 py-1 text-[11px] font-semibold bg-[#4169E1]/30 text-blue-200 hover:bg-[#4169E1]/50 border border-blue-500/50 rounded transition-colors flex items-center gap-1"
            title="Simulate edge camera trigger and post to FastAPI backend"
          >
            <Zap size={10} className="text-blue-400" />
            Edge Trigger
          </button>
        </div>
      </div>
    </div>
  );
};
