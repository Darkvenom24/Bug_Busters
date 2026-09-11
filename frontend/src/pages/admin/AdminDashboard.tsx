import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/cn';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Package,
  Truck,
  Activity,
  Award
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'kpi' | 'verification' | 'disputes'>('kpi');

  // Verification requests state
  const [verificationList, setVerificationList] = useState([
    { id: 'v-1', name: 'Ramesh Patel', type: 'Farmer', location: 'Rajkot, Gujarat', landAcre: '12.5 Acres (RoR Verified)', status: 'Approved' },
    { id: 'v-2', name: 'Saurashtra Kisan Producer Co.', type: 'FPO', location: 'Rajkot Hub', members: '142 Farmers', status: 'Approved' },
    { id: 'v-3', name: 'Kisan Agro Traders', type: 'FPO', location: 'Mehsana Cluster', members: '88 Farmers', status: 'Pending' },
    { id: 'v-4', name: 'Royal Banquets & Catering', type: 'Bulk Buyer', location: 'Ahmedabad', gst: 'GSTIN24AAACT1294', status: 'Pending' },
  ]);

  // Disputes & complaints state
  const [disputes, setDisputes] = useState([
    { id: 'disp-101', orderId: 'ORD-8804', raisedBy: 'Hotel Grand Residency', issue: 'Slight weight variance on Grade A Potato consignment (-12kg)', status: 'Resolved (Credit Note Issued)' },
    { id: 'disp-102', orderId: 'ORD-8812', raisedBy: 'Devji Farm', issue: 'Pickup driver arrived 45 mins late due to monsoon waterlogging', status: 'Under Review' },
  ]);

  const allProducts = productService.getAll();
  const allOrders = orderService.getAll();

  const handleApprove = (id: string) => {
    setVerificationList(prev => prev.map(item => item.id === id ? { ...item, status: 'Approved' } : item));
  };

  const handleReject = (id: string) => {
    setVerificationList(prev => prev.map(item => item.id === id ? { ...item, status: 'Rejected' } : item));
  };

  // DoCA Margin Leakage Comparison Data
  const docaChartData = [
    { crop: 'Tomato', traditionalIntermediaryPrice: 42, farmSetuFarmerEarn: 31, consumerDirectPrice: 34 },
    { crop: 'Onion', traditionalIntermediaryPrice: 38, farmSetuFarmerEarn: 28, consumerDirectPrice: 30 },
    { crop: 'Potato', traditionalIntermediaryPrice: 24, farmSetuFarmerEarn: 16, consumerDirectPrice: 18 },
    { crop: 'Spinach', traditionalIntermediaryPrice: 35, farmSetuFarmerEarn: 22, consumerDirectPrice: 24 },
    { crop: 'Banana', traditionalIntermediaryPrice: 30, farmSetuFarmerEarn: 19, consumerDirectPrice: 21 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="purple" className="bg-purple-500/20 text-purple-300 border-purple-400/40">
                Department of Consumer Affairs (DoCA) Official
              </Badge>
              <span className="text-xs text-purple-200">Problem Statement ID: 26033</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              FarmSetu National Command Center
            </h1>
            <p className="text-xs sm:text-sm text-purple-100/80 mt-1">
              Officer: {user.name} • Agricultural Supply Chain & Intermediary Reduction Monitor
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" /> Platform Health 99.9%
            </span>
          </div>
        </div>

        {/* Global Platform KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-purple-800/60">
          <div>
            <span className="text-xs text-purple-200/80">Active Catalog Produce</span>
            <div className="text-2xl font-black text-white">{allProducts.length} Listings</div>
          </div>
          <div>
            <span className="text-xs text-purple-200/80">Transactions Processed</span>
            <div className="text-2xl font-black text-white">{allOrders.length} Orders</div>
          </div>
          <div>
            <span className="text-xs text-purple-200/80">Intermediary Markup Saved</span>
            <div className="text-2xl font-black text-emerald-400">₹1,42,300</div>
          </div>
          <div>
            <span className="text-xs text-purple-200/80">Farmer Realization Index</span>
            <div className="text-2xl font-black text-amber-400">82.4% (vs 32% Mandi)</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('kpi')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'kpi'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          📈 DoCA Price Analytics & Margins
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'verification'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          🛡️ User KYC & Farmer Verification ({verificationList.filter(v => v.status === 'Pending').length})
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'disputes'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          ⚖️ Dispute Resolution Center ({disputes.length})
        </button>
      </div>

      {/* Tab 1: DoCA Analytics & Pricing Comparison */}
      {activeTab === 'kpi' && (
        <div className="space-y-6">
          <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  DoCA Price Analysis: Traditional Multi-Middleman vs FarmSetu Direct (₹/kg)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual proof of eliminating intermediary exploitation: Farmers receive higher earnings while consumers pay lower retail prices.
                </p>
              </div>
              <Badge variant="success">DoCA Benchmark 2026</Badge>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={docaChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
                  <XAxis dataKey="crop" fontSize={12} stroke="#94a3b8" />
                  <YAxis fontSize={12} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.95)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar
                    dataKey="traditionalIntermediaryPrice"
                    name="Traditional Inflated Retail Price (6 Middlemen)"
                    fill="#ef4444"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="farmSetuFarmerEarn"
                    name="FarmSetu Farmer Direct Earnings"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="consumerDirectPrice"
                    name="FarmSetu Buyer Purchase Price"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
              <strong>Key DoCA Finding:</strong> Across tomato, onion, and spinach consignments, FarmSetu provides an average <strong>+64% higher realization for farmers</strong> while delivering a <strong>22% price reduction for bulk buyers and end consumers</strong> through Google OR-Tools route pooling.
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: User KYC & Farmer Verification */}
      {activeTab === 'verification' && (
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Farmer, FPO & Buyer Verification Desk
              </h3>
              <p className="text-xs text-slate-500">Authenticate land records (7/12 RoR), FPO certificates and corporate GST credentials</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Entity Name</th>
                  <th className="p-3">Role Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Verification Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {verificationList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="p-3">
                      <Badge variant={item.type === 'Farmer' ? 'success' : item.type === 'FPO' ? 'purple' : 'info'}>
                        {item.type}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500">{item.location}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                      {(item as any).landAcre || (item as any).members || (item as any).gst}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                        item.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.status === 'Pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-1.5">
                      {item.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Verify ✓
                          </button>
                          <button
                            onClick={() => handleReject(item.id)}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Dispute Resolution */}
      {activeTab === 'disputes' && (
        <Card className="p-6 border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Dispute & Grievance Redressal
              </h3>
              <p className="text-xs text-slate-500">Mediate quality disputes, transit delays and weight audits</p>
            </div>
          </div>

          <div className="space-y-3">
            {disputes.map(d => (
              <div key={d.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">Dispute #{d.id}</span>
                    <Badge variant="warning">{d.orderId}</Badge>
                    <span className="text-slate-400">Raised by: {d.raisedBy}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mt-1">{d.issue}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={d.status.includes('Resolved') ? 'success' : 'warning'}>
                    {d.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
