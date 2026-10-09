import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Batch } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Layers,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  Play,
  Calendar,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface BatchesPageProps {
  onNavigate: (path: string) => void;
}

export const BatchesPage: React.FC<BatchesPageProps> = ({ onNavigate }) => {
  const { batches, products, addBatch, setActiveBatchId, setActiveProductId } = useApp();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [productId, setProductId] = useState(products[0]?.id || 'PRD-1024');
  const [productionDate, setProductionDate] = useState('2026-10-09');
  const [shift, setShift] = useState<Batch['shift']>('Morning (06:00 - 14:00)');
  const [quantity, setQuantity] = useState(1200);

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const product = products.find((p) => p.id === productId);
    addBatch({
      productId,
      productName: product?.name || 'Standard Component',
      productionDate,
      shift,
      quantity,
      status: 'In Production'
    });
    setIsModalOpen(false);
  };

  const handleInspectBatch = (batch: Batch) => {
    setActiveBatchId(batch.id);
    setActiveProductId(batch.productId);
    onNavigate('/inspection/live');
  };

  const filtered = batches.filter(
    (b) =>
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.productName.toLowerCase().includes(search.toLowerCase()) ||
      b.productId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Production Batch Monitoring
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor lot throughput, pass/fail yields, and quality scores per manufacturing run.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Schedule New Batch</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5EAF2] shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Batch ID, Product..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filtered.length}</strong> production lots
        </div>
      </div>

      {/* Batches Table & Cards */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">Batch ID</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Production Date</th>
                <th className="py-3.5 px-4">Shift</th>
                <th className="py-3.5 px-4">Lot Size</th>
                <th className="py-3.5 px-4">Inspected</th>
                <th className="py-3.5 px-4">Passed</th>
                <th className="py-3.5 px-4">Rejected</th>
                <th className="py-3.5 px-4">Quality Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((batch) => {
                const defectRatio =
                  batch.inspectedQuantity > 0
                    ? ((batch.rejectedQuantity / batch.inspectedQuantity) * 100).toFixed(1)
                    : '0.0';

                return (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#4169E1]">{batch.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#172338]">{batch.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{batch.productId}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{batch.productionDate}</td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{batch.shift.split(' ')[0]}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">{batch.quantity}</td>
                    <td className="py-3 px-4 font-mono text-slate-700">{batch.inspectedQuantity}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#15976A]">{batch.passedQuantity}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#DC4545]">{batch.rejectedQuantity}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-800">{batch.qualityScore}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full ${batch.qualityScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${batch.qualityScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          batch.status === 'Completed'
                            ? 'bg-slate-100 text-slate-700'
                            : batch.status === 'Quarantined'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {batch.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleInspectBatch(batch)}
                          className="px-2.5 py-1 text-xs font-semibold bg-[#4169E1] hover:bg-[#3457C2] text-white rounded-lg transition-colors flex items-center gap-1"
                          title="Load into Live Inspection station"
                        >
                          <Play size={11} />
                          <span>Inspect</span>
                        </button>
                        <button
                          onClick={() => onNavigate(`/batches/${batch.id}`)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View batch metrics"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Batch Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule New Production Batch"
        subtitle="Initiate a manufacturing lot for inspection"
        maxWidth="md"
      >
        <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id} — {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Production Date</label>
              <input
                type="date"
                value={productionDate}
                onChange={(e) => setProductionDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lot Quantity (Units)</label>
              <input
                type="number"
                min="50"
                max="50000"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Production Shift</label>
            <select
              value={shift}
              onChange={(e) => setShift(e.target.value as Batch['shift'])}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
            >
              <option value="Morning (06:00 - 14:00)">Morning (06:00 - 14:00)</option>
              <option value="Afternoon (14:00 - 22:00)">Afternoon (14:00 - 22:00)</option>
              <option value="Night (22:00 - 06:00)">Night (22:00 - 06:00)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-600 rounded-lg hover:bg-slate-100 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white font-semibold rounded-lg shadow-xs"
            >
              Schedule Batch
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
