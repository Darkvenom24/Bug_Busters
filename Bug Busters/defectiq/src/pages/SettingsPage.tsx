import React, { useState } from 'react';
import { useApp } from '../lib/store';
import {
  Sliders,
  User,
  Camera,
  Bell,
  Shield,
  CheckCircle,
  Save,
  Volume2,
  Monitor,
  Cpu
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'inspection' | 'camera' | 'notifications' | 'profile' | 'security'>('inspection');
  const [confidenceThreshold, setConfidenceThreshold] = useState(settings.confidenceThreshold);
  const [alertThresholdPercent, setAlertThresholdPercent] = useState(settings.alertThresholdPercent);
  const [autoResumeOnPass, setAutoResumeOnPass] = useState(settings.autoResumeOnPass);
  const [cameraSource, setCameraSource] = useState(settings.cameraSource);
  const [resolution, setResolution] = useState(settings.resolution);
  const [targetFps, setTargetFps] = useState(settings.targetFps);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled);
  const [browserAlerts, setBrowserAlerts] = useState(settings.browserAlerts);
  const [emailAlerts, setEmailAlerts] = useState(settings.emailAlerts);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      confidenceThreshold,
      alertThresholdPercent,
      autoResumeOnPass,
      cameraSource,
      resolution,
      targetFps,
      soundEnabled,
      browserAlerts,
      emailAlerts
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            System & Optical Inspection Settings
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure defect detection thresholds, industrial camera hardware interfaces, and event notification policies.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle size={14} /> Settings Saved & Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Navigation Tabs - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-[#E5EAF2] p-3 shadow-xs space-y-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('inspection')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors ${
              activeTab === 'inspection' ? 'bg-[#EDF3FF] text-[#4169E1] font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Sliders size={16} />
            <span>Inspection & AI Thresholds</span>
          </button>

          <button
            onClick={() => setActiveTab('camera')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors ${
              activeTab === 'camera' ? 'bg-[#EDF3FF] text-[#4169E1] font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Camera size={16} />
            <span>GigE Camera & Hardware</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors ${
              activeTab === 'notifications' ? 'bg-[#EDF3FF] text-[#4169E1] font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bell size={16} />
            <span>Alerts & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors ${
              activeTab === 'profile' ? 'bg-[#EDF3FF] text-[#4169E1] font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User size={16} />
            <span>Operator Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 p-3 rounded-xl transition-colors ${
              activeTab === 'security' ? 'bg-[#EDF3FF] text-[#4169E1] font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield size={16} />
            <span>Security & Session</span>
          </button>
        </div>

        {/* Tab Body - 9 cols */}
        <div className="lg:col-span-9 bg-white rounded-2xl border border-[#E5EAF2] p-6 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5 text-xs">
            {activeTab === 'inspection' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#172338]">Inspection & Quality Parameters</h3>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">
                      Minimum AI Confidence Threshold for Auto-Pass
                    </label>
                    <span className="font-mono font-bold text-[#4169E1] text-sm">
                      {confidenceThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="70"
                    max="99"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-[#4169E1]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optical inferences with certainty below {confidenceThreshold}% are automatically routed to Manual Review.
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-semibold text-slate-700">
                      Batch Defect Spiked Alert Threshold
                    </label>
                    <span className="font-mono font-bold text-[#DC4545] text-sm">
                      {alertThresholdPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="25"
                    value={alertThresholdPercent}
                    onChange={(e) => setAlertThresholdPercent(Number(e.target.value))}
                    className="w-full accent-[#DC4545]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Triggers a plant-wide "HIGH DEFECT RATE" alarm whenever a lot's cumulative defect ratio exceeds {alertThresholdPercent}%.
                  </p>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFD]">
                  <div>
                    <span className="font-bold text-slate-800 block">Automatic Loop Continuation on PASS</span>
                    <span className="text-[11px] text-slate-500">
                      Advance optical line to the next conveyor piece without requiring operator confirmation.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoResumeOnPass}
                    onChange={(e) => setAutoResumeOnPass(e.target.checked)}
                    className="w-4 h-4 accent-[#4169E1] rounded cursor-pointer"
                  />
                </div>
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#172338]">Camera & Machine Vision Interface</h3>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Optical Sensor Source</label>
                  <select
                    value={cameraSource}
                    onChange={(e) => setCameraSource(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-[#F8FAFD]"
                  >
                    <option value="Industrial GigE Camera #01 (Lens 25mm)">Industrial GigE Camera #01 (Lens 25mm)</option>
                    <option value="Top-Mount Coaxial Vision Sensor #02">Top-Mount Coaxial Vision Sensor #02</option>
                    <option value="Local USB/Webcam Direct Stream">Local USB/Webcam Direct Stream</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Native Resolution</label>
                    <select
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-[#F8FAFD]"
                    >
                      <option value="1920x1080 @ 60 FPS">1920x1080 (Full HD)</option>
                      <option value="2560x1440 @ 30 FPS">2560x1440 (2K QHD)</option>
                      <option value="1280x720 @ 120 FPS">1280x720 (High-Speed Line)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Inspection Rate (FPS)</label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={targetFps}
                      onChange={(e) => setTargetFps(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-300 bg-[#F8FAFD]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#172338]">Notification Channels</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-800 block">Acoustic Floor Alarm (Sound)</span>
                      <span className="text-[11px] text-slate-400">Audio chime on critical defect detection</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#4169E1]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-800 block">Browser Desktop Push</span>
                      <span className="text-[11px] text-slate-400">Desktop toasts for lot quarantine events</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={browserAlerts}
                      onChange={(e) => setBrowserAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#4169E1]"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-800 block">Email Shift Digest</span>
                      <span className="text-[11px] text-slate-400">Send end-of-shift report to QA managers</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={(e) => setEmailAlerts(e.target.checked)}
                      className="w-4 h-4 accent-[#4169E1]"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#172338]">Current Operator Dossier</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.name || ''}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Work Email</label>
                    <input
                      type="text"
                      disabled
                      value={currentUser?.email || ''}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-700"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#172338]">Security & Session Configuration</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <p className="font-semibold text-slate-800">Session Security Policy</p>
                  <p className="text-slate-500 text-[11px]">
                    Role-Based Access Control (RBAC) enforced with JWT bearer authentication tokens and SHA256 audit hashing.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#4169E1] hover:bg-[#3457C2] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save size={14} />
                <span>Save Inspection Settings</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
