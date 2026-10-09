import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { Product, QualityRule } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Boxes,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  CheckCircle,
  XCircle,
  Sliders,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface ProductsPageProps {
  onNavigate: (path: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onNavigate }) => {
  const { products, addProduct, updateProduct, toggleProductStatus, inspections } = useApp();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Structural Metallurgy');
  const [description, setDescription] = useState('');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Structural Metallurgy');
    setDescription('');
    setConfidenceThreshold(85);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category);
    setDescription(prod.description);
    setConfidenceThreshold(prod.confidenceThreshold);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name,
        category,
        description,
        confidenceThreshold
      });
    } else {
      addProduct({
        name,
        category,
        description,
        status: 'active',
        confidenceThreshold,
        qualityRules: [
          {
            id: `QR-${Date.now()}`,
            defectType: 'Critical Structural Crack',
            maxAllowedCount: 0,
            criticalThresholdConfidence: confidenceThreshold,
            autoReject: true
          }
        ]
      });
    }
    setIsModalOpen(false);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            Product Master Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage product specifications, optical inspection parameters, and defect acceptance rules.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Add New Product</span>
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
            placeholder="Search by Product ID, Name, or Category..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filtered.length}</strong> registered products
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-4">
        {filtered.map((product) => {
          const productInspections = inspections.filter((i) => i.productId === product.id);
          const passed = productInspections.filter((i) => i.result === 'PASS').length;
          const total = productInspections.length;
          const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '100.0';

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-[#E5EAF2] p-5 shadow-xs flex flex-col justify-between hover:border-blue-200 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#4169E1] bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                        {product.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          product.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {product.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#172338] mt-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500">{product.category}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit specifications"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => toggleProductStatus(product.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Toggle active status"
                    >
                      {product.status === 'active' ? (
                        <XCircle size={15} className="text-slate-400 hover:text-red-500" />
                      ) : (
                        <CheckCircle size={15} className="text-slate-400 hover:text-emerald-500" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                {/* Quality Rules snapshot */}
                <div className="rounded-xl bg-[#F8FAFD] border border-slate-100 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
                    <span>Enforced Rules ({product.qualityRules.length})</span>
                    <span>Min Confidence: {product.confidenceThreshold}%</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.qualityRules.map((rule) => (
                      <span
                        key={rule.id}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700"
                      >
                        <Shield size={10} className="text-[#4169E1]" />
                        <span>{rule.defectType}</span>
                        {rule.autoReject && <strong className="text-red-600">(Auto-Reject)</strong>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom stats & action */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Inspections</span>
                    <span className="font-mono font-bold text-slate-800">{total}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Pass Rate</span>
                    <span className="font-mono font-bold text-emerald-600">{passRate}%</span>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate(`/products/${product.id}`)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#4169E1] hover:text-[#2546B8] hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Eye size={13} />
                  <span>View Specifications</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product Specification' : 'Add New Manufacturing Product'}
        subtitle="Configure component telemetry and quality rules"
        maxWidth="md"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rolled Precision Steel Plate 12mm"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Industry Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            >
              <option value="Structural Metallurgy">Structural Metallurgy</option>
              <option value="Electronics & Avionics">Electronics & Avionics</option>
              <option value="Automotive Powertrain">Automotive Powertrain</option>
              <option value="Industrial Rotating Machinery">Industrial Rotating Machinery</option>
              <option value="Precision Optics & Glass">Precision Optics & Glass</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Minimum AI Confidence Threshold ({confidenceThreshold}%)
            </label>
            <input
              type="range"
              min="70"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-[#4169E1]"
            />
            <p className="text-[11px] text-slate-400 mt-0.5">
              Predictions below {confidenceThreshold}% will automatically route to Manual Review.
            </p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Quality Specs</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline engineering tolerance, material grade, and inspection focal points..."
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            />
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
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
