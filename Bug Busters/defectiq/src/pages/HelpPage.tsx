import React, { useState } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Play,
  Trash2,
  Sliders,
  History,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Sparkles
} from 'lucide-react';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: React.ReactNode;
}

export const HelpPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openIds, setOpenIds] = useState<string[]>(['help-1', 'help-3']);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const faqItems: FAQItem[] = [
    {
      id: 'help-1',
      category: 'Operations',
      question: 'How do I start a real-time inspection run?',
      answer: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            1. Navigate to <strong>Live Inspection</strong> in the sidebar.
          </p>
          <p>
            2. In the top selection bar, pick your target <strong>Product</strong> specification (e.g. Rolled Steel Plate) and the scheduled <strong>Batch</strong> (e.g. BATCH-102).
          </p>
          <p>
            3. Ensure the GigE Camera Feed or Webcam is online, or select one of the demonstration defect presets.
          </p>
          <p>
            4. Click the blue <strong>Start Inspection</strong> button. The neural vision pipeline will immediately stream bounding boxes, class labels, and confidence evaluations.
          </p>
        </div>
      )
    },
    {
      id: 'help-2',
      category: 'Operations',
      question: 'How do I remove and divert a defective product from the line?',
      answer: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            When a defect (such as a transverse crack or solder bridge) violates configured quality standards:
          </p>
          <p>
            1. The system automatically halts conveyor auto-advance and displays the red <strong>QUALITY VIOLATION DETECTED</strong> banner.
          </p>
          <p>
            2. Click the red <strong>Remove Product</strong> button on the bottom of the right diagnostic panel.
          </p>
          <p>
            3. A confirmation dialog appears showing the Product ID, detected defect family, and assessed severity.
          </p>
          <p>
            4. Confirm the removal reason and press <strong>Confirm Removal</strong>. The unit is marked as <strong>REJECTED</strong>, a permanent traceability entry is written into the audit log, and the conveyor diverter gate is signaled.
          </p>
        </div>
      )
    },
    {
      id: 'help-3',
      category: 'Quality Standards',
      question: 'What is the crucial difference between AI Confidence and Defect Severity?',
      answer: (
        <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <strong className="text-[#4169E1] block">Model Confidence (Certainty)</strong>
            <span>
              Describes the neural network’s statistical probability that its visual classification is correct (e.g. 96.2%). A high confidence score only means the model is sure about what it sees.
            </span>
          </div>
          <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl">
            <strong className="text-[#DC4545] block">Defect Severity (Impact)</strong>
            <span>
              Describes how damaging the detected flaw is according to physical engineering tolerances (e.g. CRITICAL, HIGH, MEDIUM, LOW). A hairline scratch may have 98% confidence but LOW severity, whereas a micro-crack may have 86% confidence but CRITICAL severity.
            </span>
          </div>
          <p className="font-semibold text-slate-700">
            They are never interchangeable. Authoritative rejection decisions are determined by configured quality rules, not purely raw confidence.
          </p>
        </div>
      )
    },
    {
      id: 'help-4',
      category: 'Triage',
      question: 'How does the Manual Review queue handle uncertain predictions?',
      answer: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            When an optical inference falls below the configured confidence threshold (e.g. &lt;85%), or when ambient lighting glare introduces ambiguity, the result is flagged as <strong>MANUAL REVIEW</strong>.
          </p>
          <p>
            The unit is placed in the operator’s <strong>Manual Review</strong> queue. The operator can visually examine the enlarged frame, cross-reference dimensional measurements, and either <strong>Confirm</strong>, <strong>Correct</strong> (record a false alarm), or route the part to a secondary Metrology Lab.
          </p>
          <p>
            Original AI inferences are preserved forever to guarantee immutable traceability.
          </p>
        </div>
      )
    },
    {
      id: 'help-5',
      category: 'Reporting',
      question: 'How do I generate certified batch lot and quality reports?',
      answer: (
        <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
          <p>
            1. Open <strong>Reports</strong> from the sidebar.
          </p>
          <p>
            2. Choose between Daily, Weekly, Product Conformance, Batch Lot Certificate, or Defect Root Cause reports.
          </p>
          <p>
            3. Click <strong>Generate & Print PDF</strong> for formal hardcopy filing, or click <strong>Export CSV / Excel</strong> for ERP integration.
          </p>
        </div>
      )
    }
  ];

  const filteredFaqs = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5EAF2] shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            DefectIQ Operating Procedures & Documentation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Step-by-step guidance for optical line operators, quality control technicians, and plant supervisors.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-lg">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operating procedures, severity definitions, troubleshooting..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
          />
        </div>
      </div>

      {/* Accordion FAQ Items */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openIds.includes(faq.id);

          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-[#E5EAF2] overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4169E1] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {faq.category}
                  </span>
                  <span className="text-sm font-bold text-[#172338]">{faq.question}</span>
                </div>
                {isOpen ? (
                  <ChevronUp size={18} className="text-slate-400" />
                ) : (
                  <ChevronDown size={18} className="text-slate-400" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-slate-100 bg-[#F8FAFD]/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
