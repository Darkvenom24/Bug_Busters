import React, { useState, useRef } from 'react';
import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
import { Severity } from '../types';
import { SAMPLE_IMAGES } from '../data/mockData';
import {
  UploadCloud,
  FileImage,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  Cpu,
  Trash2
} from 'lucide-react';

interface ImageDetectionResult {
  result: string;
  defectType: string;
  confidence: number;
  severity: Severity;
  box: { x: number; y: number; width: number; height: number };
  inferenceTimeMs: number;
  modelVersion: string;
}

export const ImageTestPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(SAMPLE_IMAGES.steelPlateDefect);
  const [stage, setStage] = useState<'IDLE' | 'UPLOADING' | 'PROCESSING' | 'DETECTED'>('DETECTED');
  const [progress, setProgress] = useState(100);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulated detection output for the active test image
  const [detectionResult, setDetectionResult] = useState<ImageDetectionResult>({
    result: 'FAIL',
    defectType: 'Surface Inclusion & Crack',
    confidence: 94.8,
    severity: 'HIGH',
    box: { x: 28, y: 32, width: 26, height: 16 },
    inferenceTimeMs: 38,
    modelVersion: 'EdgeVision-ResNet101-v3.4'
  });

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setSelectedImage(dataUrl);
      runInference(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const runInference = (_imgUrl: string) => {
    setStage('UPLOADING');
    setProgress(30);

    setTimeout(() => {
      setStage('PROCESSING');
      setProgress(75);

      setTimeout(() => {
        setStage('DETECTED');
        setProgress(100);
        setDetectionResult({
          result: 'FAIL',
          defectType: 'Transverse Anomaly Detected',
          confidence: 93.4,
          severity: 'HIGH',
          box: { x: 32, y: 28, width: 28, height: 22 },
          inferenceTimeMs: 41,
          modelVersion: 'EdgeVision-ResNet101-v3.4'
        });
      }, 700);
    }, 500);
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Image Testing & Diagnostic Workbench
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Offline diagnostic image inference sandbox for ad-hoc component inspection and model verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedImage(SAMPLE_IMAGES.pcbDefect);
              runInference(SAMPLE_IMAGES.pcbDefect);
            }}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 rounded-xl"
          >
            Load PCB Test Sample
          </button>
          <button
            onClick={() => {
              setSelectedImage(SAMPLE_IMAGES.cleanPart);
              setStage('PROCESSING');
              setTimeout(() => {
                setStage('DETECTED');
                setDetectionResult({
                  result: 'PASS',
                  defectType: 'No Defect (Pass)',
                  confidence: 99.4,
                  severity: 'NONE',
                  box: { x: 0, y: 0, width: 0, height: 0 },
                  inferenceTimeMs: 29,
                  modelVersion: 'EdgeVision-ResNet101-v3.4'
                });
              }, 400);
            }}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-emerald-700"
          >
            Load Flawless Sample
          </button>
        </div>
      </div>

      {/* Main Grid: Upload Area & Detection Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left 7 cols: Optical Viewer */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E5EAF2] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Diagnostic Frame</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 text-xs font-semibold bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <UploadCloud size={14} />
                <span>Upload Custom Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </div>
          </div>

          {/* Viewer Area */}
          <div className="relative rounded-xl overflow-hidden bg-[#0F172A] min-h-[380px] flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Test frame"
                className="w-full h-full object-contain select-none"
              />
            ) : (
              <div className="text-center p-8 text-slate-400">
                <FileImage size={40} className="mx-auto mb-2 opacity-40" />
                <p className="text-xs">No image loaded. Drop a file or click Upload.</p>
              </div>
            )}

            {/* Bounding box if detected and fail */}
            {stage === 'DETECTED' && detectionResult.result === 'FAIL' && detectionResult.box.width > 0 && (
              <div
                className="absolute border-2 border-red-500 bg-red-500/15 rounded"
                style={{
                  left: `${detectionResult.box.x}%`,
                  top: `${detectionResult.box.y}%`,
                  width: `${detectionResult.box.width}%`,
                  height: `${detectionResult.box.height}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow">
                  {detectionResult.defectType} ({detectionResult.confidence.toFixed(1)}%)
                </div>
              </div>
            )}

            {/* Processing Overlay */}
            {(stage === 'UPLOADING' || stage === 'PROCESSING') && (
              <div className="absolute inset-0 bg-[#0F172A]/75 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-3">
                <div className="w-10 h-10 border-3 border-[#4169E1] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold">
                  {stage === 'UPLOADING' ? 'Uploading Optical Frame...' : 'Running Edge Neural Vision Inference...'}
                </p>
                <div className="w-48 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4169E1] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Processing Stages Indicators */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <span className={`font-semibold ${stage === 'UPLOADING' ? 'text-[#4169E1]' : 'text-slate-400'}`}>
              1. Uploading
            </span>
            <span className="text-slate-300">→</span>
            <span className={`font-semibold ${stage === 'PROCESSING' ? 'text-[#4169E1]' : 'text-slate-400'}`}>
              2. Pre-Processing
            </span>
            <span className="text-slate-300">→</span>
            <span className={`font-semibold ${stage === 'DETECTED' ? 'text-[#15976A]' : 'text-slate-400'}`}>
              3. AI Detection Complete
            </span>
          </div>
        </div>

        {/* Right 5 cols: Inference Diagnostics */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase">Inference Report</span>
              <StatusBadge status={detectionResult.result} size="md" />
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#EDF3FF] border border-blue-100">
                <span className="text-[10px] font-semibold text-blue-900 block">AI Confidence Score</span>
                <span className="font-mono font-black text-2xl text-[#4169E1] mt-0.5 block">
                  {detectionResult.confidence.toFixed(1)}%
                </span>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Latency: {detectionResult.inferenceTimeMs} ms per frame
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F8FAFD] border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-500 block">Identified Classification</span>
                <span className="font-bold text-[#172338] text-sm mt-0.5 block">
                  {detectionResult.defectType}
                </span>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Assessed Severity:</span>
                  <SeverityBadge severity={detectionResult.severity} size="sm" />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Model Engine</span>
                  <span className="font-mono text-slate-800">{detectionResult.modelVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Inference Device</span>
                  <span className="font-mono text-slate-800">Edge TPU Acceleration</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bounding Box Coord</span>
                  <span className="font-mono text-slate-800 text-[11px]">
                    [{detectionResult.box.x}, {detectionResult.box.y}, {detectionResult.box.width}, {detectionResult.box.height}]
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (selectedImage) runInference(selectedImage);
            }}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            <span>Re-Run Optical Pipeline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
