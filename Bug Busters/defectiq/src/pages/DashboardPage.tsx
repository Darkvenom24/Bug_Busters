// import React, { useState } from 'react';
// import { useApp } from '../lib/store';
// import { StatusBadge, SeverityBadge } from '../components/common/StatusBadge';
// import {
//   Layers,
//   CheckCircle2,
//   XCircle,
//   AlertOctagon,
//   ArrowUpRight,
//   ArrowDownRight,
//   Play,
//   RotateCw,
//   Search,
//   Filter,
//   Eye,
//   Calendar,
//   AlertTriangle,
//   TrendingUp,
//   Clock,
//   Sparkles,
//   Shield,
//   UserCheck
// } from 'lucide-react';
// import {
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   Legend
// } from 'recharts';

// interface DashboardPageProps {
//   onNavigate: (path: string) => void;
// }

// export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
//   const { inspections, alerts, stats, acknowledgeAlert, currentUser } = useApp();
//   const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');
//   const [tableSearch, setTableSearch] = useState('');
//   const [resultFilter, setResultFilter] = useState('ALL');
//   const [isRefreshing, setIsRefreshing] = useState(false);

//   // Time-series trend chart data
//   const trendData = [
//     { time: '06:00', inspected: 140, passed: 128, rejected: 12 },
//     { time: '07:00', inspected: 185, passed: 165, rejected: 20 },
//     { time: '08:00', inspected: 210, passed: 189, rejected: 21 },
//     { time: '09:00', inspected: 240, passed: 212, rejected: 28 },
//     { time: '10:00', inspected: 235, passed: 201, rejected: 34 },
//     { time: '11:00', inspected: 238, passed: 205, rejected: 33 },
//   ];

//   // Quality distribution for Donut Chart
//   const qualityDistribution = [
//     { name: 'Passed', value: stats.passed, color: '#15976A' },
//     { name: 'Rejected', value: stats.rejected, color: '#DC4545' },
//     { name: 'Manual Review', value: stats.manualReviews || 18, color: '#D99020' },
//   ];

//   // Defect breakdown for Bar Chart
//   const defectData = [
//     { defect: 'Crack', count: 68, fill: '#DC4545' },
//     { defect: 'Solder Bridge', count: 42, fill: '#EA580C' },
//     { defect: 'Inclusion', count: 31, fill: '#D99020' },
//     { defect: 'Blowhole', count: 18, fill: '#4169E1' },
//     { defect: 'Burr/Scratch', count: 11, fill: '#7563E8' },
//   ];

//   const handleRefresh = () => {
//     setIsRefreshing(true);
//     setTimeout(() => setIsRefreshing(false), 500);
//   };

//   // Filter inspections table
//   const filteredInspections = inspections.filter((insp) => {
//     const matchesSearch =
//       insp.productId.toLowerCase().includes(tableSearch.toLowerCase()) ||
//       insp.batchId.toLowerCase().includes(tableSearch.toLowerCase()) ||
//       insp.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
//       insp.operatorName.toLowerCase().includes(tableSearch.toLowerCase());

//     const matchesResult = resultFilter === 'ALL' || insp.result === resultFilter;
//     return matchesSearch && matchesResult;
//   });

//   return (
//     <div className="space-y-6 max-w-[1600px] mx-auto">
//       {/* 6.1 Dashboard Heading */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
//         <div>
//           <h2 className="text-xl font-bold text-[#172338] tracking-tight">
//             Quality Dashboard
//           </h2>
//           <p className="text-xs text-slate-500 mt-0.5">
//             Monitor real-time inspections, identify manufacturing defects, and track production quality.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-2.5">
//           {/* Time range selector */}
//           <div className="flex items-center bg-[#F8FAFD] border border-[#E5EAF2] rounded-xl p-1 text-xs">
//             <button
//               onClick={() => setTimeRange('today')}
//               className={`px-3 py-1 rounded-lg font-medium transition-colors ${
//                 timeRange === 'today' ? 'bg-white text-[#4169E1] shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               Today
//             </button>
//             <button
//               onClick={() => setTimeRange('week')}
//               className={`px-3 py-1 rounded-lg font-medium transition-colors ${
//                 timeRange === 'week' ? 'bg-white text-[#4169E1] shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               This Week
//             </button>
//             <button
//               onClick={() => setTimeRange('month')}
//               className={`px-3 py-1 rounded-lg font-medium transition-colors ${
//                 timeRange === 'month' ? 'bg-white text-[#4169E1] shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               This Month
//             </button>
//           </div>

//           {/* Refresh action */}
//           <button
//             onClick={handleRefresh}
//             className={`p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors ${
//               isRefreshing ? 'animate-spin text-[#4169E1]' : ''
//             }`}
//             title="Refresh dashboard data"
//           >
//             <RotateCw size={16} />
//           </button>

//           {/* Primary Action: Start Inspection */}
//           <button
//             onClick={() => onNavigate('/inspection/live')}
//             className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
//           >
//             <Play size={14} />
//             <span>Start Inspection</span>
//           </button>
//         </div>
//       </div>

//       {/* Role-Specific Active Session Banner */}
//       {currentUser?.role === 'Admin' ? (
//         <div className="bg-gradient-to-r from-violet-50 to-indigo-50/50 p-4 rounded-2xl border border-violet-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-2xs">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
//               <Shield size={18} />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="font-bold text-violet-950 text-sm">
//                   Administrator Portal Active ({currentUser.name})
//                 </span>
//                 <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 text-violet-800 border border-violet-200">
//                   FULL PRIVILEGES
//                 </span>
//               </div>
//               <p className="text-[11px] text-violet-700 mt-0.5">
//                 Executive factory oversight: Manage operator user accounts, verify neural model mAP metrics, and review immutable audit compliance logs.
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 shrink-0">
//             <button
//               onClick={() => onNavigate('/admin/users')}
//               className="px-3 py-1.5 bg-white text-violet-900 border border-violet-200 rounded-lg font-bold hover:bg-violet-100/60 transition-colors shadow-2xs"
//             >
//               Users Management
//             </button>
//             <button
//               onClick={() => onNavigate('/model-performance')}
//               className="px-3 py-1.5 bg-white text-violet-900 border border-violet-200 rounded-lg font-bold hover:bg-violet-100/60 transition-colors shadow-2xs"
//             >
//               Model Benchmarks
//             </button>
//             <button
//               onClick={() => onNavigate('/admin/audit')}
//               className="px-3 py-1.5 bg-white text-violet-900 border border-violet-200 rounded-lg font-bold hover:bg-violet-100/60 transition-colors shadow-2xs"
//             >
//               Audit Trail
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-gradient-to-r from-blue-50 to-sky-50/50 p-4 rounded-2xl border border-blue-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-2xs">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 rounded-xl bg-[#4169E1] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
//               <UserCheck size={18} />
//             </div>
//             <div>
//               <div className="flex items-center gap-2">
//                 <span className="font-bold text-blue-950 text-sm">
//                   Inspection Line Operator Session ({currentUser?.name || 'Floor Operator'})
//                 </span>
//                 <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-[#4169E1] border border-blue-200">
//                   STATION ALPHA-01
//                 </span>
//               </div>
//               <p className="text-[11px] text-blue-700 mt-0.5">
//                 Optical conveyor line active. Run live defect classification or review pending low-confidence items.
//               </p>
//             </div>
//           </div>
//           <div className="flex flex-wrap items-center gap-2 shrink-0">
//             <button
//               onClick={() => onNavigate('/inspection/live')}
//               className="px-3.5 py-1.5 bg-[#4169E1] text-white rounded-lg font-bold hover:bg-[#3457C2] transition-colors flex items-center gap-1.5 shadow-xs"
//             >
//               <Play size={13} />
//               <span>Open Live Station</span>
//             </button>
//             <button
//               onClick={() => onNavigate('/reviews')}
//               className="px-3 py-1.5 bg-white text-blue-900 border border-blue-200 rounded-lg font-bold hover:bg-blue-100/60 transition-colors shadow-2xs"
//             >
//               Manual Review Queue
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 6.2 Responsive KPI Cards (4 Cards) */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Card 1: Inspected Products */}
//         <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-semibold text-slate-500">Today's Inspected</span>
//             <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#4169E1] flex items-center justify-center">
//               <Layers size={16} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="text-2xl font-extrabold text-[#172338] font-mono tracking-tight">
//               {stats.todayInspected.toLocaleString()}
//             </div>
//             <div className="flex items-center gap-1.5 mt-1.5 text-xs text-emerald-600 font-medium">
//               <ArrowUpRight size={14} />
//               <span>+12.4% vs yesterday</span>
//             </div>
//           </div>
//         </div>

//         {/* Card 2: Passed */}
//         <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-semibold text-slate-500">Passed Quality Spec</span>
//             <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#15976A] flex items-center justify-center">
//               <CheckCircle2 size={16} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="text-2xl font-extrabold text-[#15976A] font-mono tracking-tight">
//               {stats.passed.toLocaleString()}
//             </div>
//             <div className="flex items-center justify-between mt-1.5 text-xs">
//               <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
//                 Pass Rate: {stats.passRate}%
//               </span>
//               <span className="text-slate-400">Target: 85%</span>
//             </div>
//           </div>
//         </div>

//         {/* Card 3: Rejected */}
//         <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-semibold text-slate-500">Rejected Units</span>
//             <div className="w-8 h-8 rounded-xl bg-red-50 text-[#DC4545] flex items-center justify-center">
//               <XCircle size={16} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="text-2xl font-extrabold text-[#DC4545] font-mono tracking-tight">
//               {stats.rejected.toLocaleString()}
//             </div>
//             <div className="flex items-center justify-between mt-1.5 text-xs">
//               <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded">
//                 Reject Rate: {(100 - stats.passRate).toFixed(1)}%
//               </span>
//               <span className="text-slate-400">Tolerance: &lt;15%</span>
//             </div>
//           </div>
//         </div>

//         {/* Card 4: Defect Ratio */}
//         <div className="bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="flex items-center justify-between">
//             <span className="text-xs font-semibold text-slate-500">Defect Ratio</span>
//             <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D99020] flex items-center justify-center">
//               <AlertOctagon size={16} />
//             </div>
//           </div>
//           <div className="mt-4">
//             <div className="text-2xl font-extrabold text-[#172338] font-mono tracking-tight">
//               {stats.defectRatio}%
//             </div>
//             <div className="flex items-center gap-1.5 mt-1.5 text-xs text-orange-600 font-medium">
//               <ArrowDownRight size={14} />
//               <span>-1.8% defect reduction</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 6.3 Dashboard Analytics Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
//         {/* Inspection Trend (Area Chart) - 8 cols */}
//         <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-sm font-bold text-[#172338]">Inspection Trend</h3>
//               <p className="text-xs text-slate-400">Hourly throughput vs passed and rejected units</p>
//             </div>
//             <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
//               Shift 1 (06:00 - 14:00)
//             </span>
//           </div>

//           <div className="h-64 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                 <defs>
//                   <linearGradient id="colorPassed" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#15976A" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#15976A" stopOpacity={0} />
//                   </linearGradient>
//                   <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="#DC4545" stopOpacity={0.3} />
//                     <stop offset="95%" stopColor="#DC4545" stopOpacity={0} />
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#F1F4F9" />
//                 <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
//                 <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#FFFFFF',
//                     borderColor: '#E5EAF2',
//                     borderRadius: '12px',
//                     fontSize: '12px',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
//                   }}
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="passed"
//                   name="Passed Units"
//                   stroke="#15976A"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorPassed)"
//                 />
//                 <Area
//                   type="monotone"
//                   dataKey="rejected"
//                   name="Rejected Units"
//                   stroke="#DC4545"
//                   strokeWidth={2}
//                   fillOpacity={1}
//                   fill="url(#colorRejected)"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Quality Distribution (Donut Chart) - 4 cols */}
//         <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="mb-2">
//             <h3 className="text-sm font-bold text-[#172338]">Quality Distribution</h3>
//             <p className="text-xs text-slate-400">Pass / Fail / Review split</p>
//           </div>

//           <div className="h-52 w-full relative flex items-center justify-center">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={qualityDistribution}
//                   innerRadius={55}
//                   outerRadius={75}
//                   paddingAngle={4}
//                   dataKey="value"
//                 >
//                   {qualityDistribution.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={entry.color} />
//                   ))}
//                 </Pie>
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#FFFFFF',
//                     borderColor: '#E5EAF2',
//                     borderRadius: '8px',
//                     fontSize: '11px'
//                   }}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//             {/* Center label */}
//             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
//               <span className="text-xs text-slate-400 font-medium">Pass Rate</span>
//               <span className="text-xl font-extrabold text-[#15976A] font-mono">{stats.passRate}%</span>
//             </div>
//           </div>

//           <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-xs">
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-[#15976A]" />
//               <span className="text-slate-600">Pass ({stats.passed})</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-[#DC4545]" />
//               <span className="text-slate-600">Fail ({stats.rejected})</span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <span className="w-2.5 h-2.5 rounded-full bg-[#D99020]" />
//               <span className="text-slate-600">Review ({stats.manualReviews})</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Row: Defect Distribution & Recent Alerts */}
//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
//         {/* Defect Distribution Bar Chart - 6 cols */}
//         <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
//           <div className="flex items-center justify-between mb-4">
//             <div>
//               <h3 className="text-sm font-bold text-[#172338]">Defect Type Breakdown</h3>
//               <p className="text-xs text-slate-400">Class occurrence frequencies</p>
//             </div>
//             <button
//               onClick={() => onNavigate('/analytics/defects')}
//               className="text-xs font-semibold text-[#4169E1] hover:underline"
//             >
//               Detailed Analytics →
//             </button>
//           </div>

//           <div className="h-56 w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={defectData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
//                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F4F9" />
//                 <XAxis type="number" stroke="#94A3B8" fontSize={11} />
//                 <YAxis dataKey="defect" type="category" stroke="#64748B" fontSize={11} width={80} tickLine={false} />
//                 <Tooltip
//                   contentStyle={{
//                     backgroundColor: '#FFFFFF',
//                     borderColor: '#E5EAF2',
//                     borderRadius: '8px',
//                     fontSize: '11px'
//                   }}
//                 />
//                 <Bar dataKey="count" radius={[0, 6, 6, 0]}>
//                   {defectData.map((entry, index) => (
//                     <Cell key={`bar-${index}`} fill={entry.fill} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Alerts List - 6 cols */}
//         <div className="lg:col-span-6 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs flex flex-col justify-between">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <h3 className="text-sm font-bold text-[#172338]">Recent Quality Alerts</h3>
//               <p className="text-xs text-slate-400">Exceptions requiring operator acknowledgement</p>
//             </div>
//             <button
//               onClick={() => onNavigate('/alerts')}
//               className="text-xs font-semibold text-[#4169E1] hover:underline"
//             >
//               All Alerts ({alerts.length}) →
//             </button>
//           </div>

//           <div className="space-y-2.5 overflow-y-auto max-h-56">
//             {alerts.slice(0, 3).map((alert) => (
//               <div
//                 key={alert.id}
//                 className="p-3 rounded-xl border border-slate-100 bg-[#F8FAFD] flex items-start justify-between gap-3 text-xs"
//               >
//                 <div className="space-y-1">
//                   <div className="flex items-center gap-2">
//                     <span className="font-bold text-[#172338]">{alert.title}</span>
//                     <SeverityBadge severity={alert.severity} size="sm" />
//                   </div>
//                   <p className="text-slate-600 text-[11px] leading-snug line-clamp-1">
//                     {alert.message}
//                   </p>
//                   <div className="flex items-center gap-3 text-[10px] text-slate-400">
//                     <span>{alert.productId ? `Product: ${alert.productId}` : ''}</span>
//                     <span>{alert.batchId ? `Batch: ${alert.batchId}` : ''}</span>
//                     <span>{alert.timestamp}</span>
//                   </div>
//                 </div>

//                 <div className="shrink-0 flex items-center">
//                   {alert.status === 'unacknowledged' ? (
//                     <button
//                       onClick={() => acknowledgeAlert(alert.id)}
//                       className="px-2.5 py-1 text-[11px] font-semibold text-white bg-[#4169E1] hover:bg-[#3457C2] rounded-lg transition-colors"
//                     >
//                       Acknowledge
//                     </button>
//                   ) : (
//                     <span className="text-emerald-600 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
//                       Acknowledged
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 6.4 Recent Inspections Table */}
//       <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
//         <div className="p-5 border-b border-[#E5EAF2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//           <div>
//             <h3 className="text-sm font-bold text-[#172338]">Recent Inspections</h3>
//             <p className="text-xs text-slate-400">Traceable chronological log of inspected components</p>
//           </div>

//           <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
//             {/* Search */}
//             <div className="relative flex-1 sm:w-60">
//               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input
//                 type="text"
//                 value={tableSearch}
//                 onChange={(e) => setTableSearch(e.target.value)}
//                 placeholder="Filter by product, batch..."
//                 className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E5EAF2] bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
//               />
//             </div>

//             {/* Result filter */}
//             <select
//               value={resultFilter}
//               onChange={(e) => setResultFilter(e.target.value)}
//               className="text-xs rounded-xl border border-[#E5EAF2] bg-[#F8FAFD] px-3 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
//             >
//               <option value="ALL">All Results</option>
//               <option value="PASS">PASS only</option>
//               <option value="FAIL">FAIL only</option>
//               <option value="MANUAL REVIEW">Manual Review</option>
//             </select>
//           </div>
//         </div>

//         {/* Responsive Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="border-b border-[#E5EAF2] bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
//                 <th className="py-3 px-4">Inspection ID</th>
//                 <th className="py-3 px-4">Product ID</th>
//                 <th className="py-3 px-4">Batch ID</th>
//                 <th className="py-3 px-4">Inspection Time</th>
//                 <th className="py-3 px-4">Result</th>
//                 <th className="py-3 px-4">Defect</th>
//                 <th className="py-3 px-4">Severity</th>
//                 <th className="py-3 px-4">Confidence</th>
//                 <th className="py-3 px-4">Operator</th>
//                 <th className="py-3 px-4 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {filteredInspections.length > 0 ? (
//                 filteredInspections.slice(0, 7).map((insp) => (
//                   <tr key={insp.id} className="hover:bg-slate-50/80 transition-colors">
//                     <td className="py-3 px-4 font-mono font-medium text-[#4169E1]">{insp.id}</td>
//                     <td className="py-3 px-4 font-mono font-semibold text-[#172338]">{insp.productId}</td>
//                     <td className="py-3 px-4 font-mono text-slate-600">{insp.batchId}</td>
//                     <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{insp.timestamp}</td>
//                     <td className="py-3 px-4">
//                       <StatusBadge status={insp.result} size="sm" />
//                     </td>
//                     <td className="py-3 px-4 font-medium text-slate-700">
//                       {insp.defects.length > 0 ? insp.defects[0].type : 'None (Conforms)'}
//                     </td>
//                     <td className="py-3 px-4">
//                       <SeverityBadge severity={insp.overallSeverity} size="sm" />
//                     </td>
//                     <td className="py-3 px-4 font-mono text-slate-800 font-semibold">
//                       {insp.overallConfidence.toFixed(1)}%
//                     </td>
//                     <td className="py-3 px-4 text-slate-600">{insp.operatorName}</td>
//                     <td className="py-3 px-4 text-right">
//                       <button
//                         onClick={() => onNavigate(`/inspections/${insp.id}`)}
//                         className="p-1.5 text-slate-400 hover:text-[#4169E1] hover:bg-blue-50 rounded-lg transition-colors"
//                         title="View inspection dossier"
//                       >
//                         <Eye size={15} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
//                     No inspection records found matching your filters.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="p-4 border-t border-[#E5EAF2] bg-[#F8FAFD] flex items-center justify-between text-xs text-slate-500">
//           <span>Showing {Math.min(7, filteredInspections.length)} of {inspections.length} total inspections</span>
//           <button
//             onClick={() => onNavigate('/inspections')}
//             className="font-semibold text-[#4169E1] hover:underline"
//           >
//             View Complete Inspection History →
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

import React, { useState, useEffect } from 'react';
import { useApp } from '../lib/store';
import api from '../lib/api';

// Self-contained Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
  </div>
);

export default function DashboardPage({ onNavigate }: { onNavigate?: (path: string) => void } = {}) {
  // ---- Dynamic State & Store ------------------------------------------
  const { currentUser } = useApp();

  const [inspections, setInspections] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [qualityDistribution, setQualityDistribution] = useState<any[]>([]);
  const [defectData, setDefectData] = useState<any[]>([]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ---- Helper to compute derived stats from inspections ---------------
  const computeStats = (insps: any[]) => {
    const today = new Date().toISOString().split('T')[0];
    const todayInspections = insps.filter(i => i.timestamp?.startsWith(today));
    const total = insps.length;
    const passed = insps.filter(i => i.result === 'PASS' || i.status === 'PASS').length;
    const rejected = insps.filter(i => i.result === 'FAIL' || i.status === 'FAIL').length;
    const manual = insps.filter(i => i.result === 'MANUAL REVIEW').length;
    const defectRatio = total > 0 ? Number(((rejected / total) * 100).toFixed(1)) : 0;
    const passRate = total > 0 ? Number(((passed / total) * 100).toFixed(1)) : 0;

    return {
      todayInspected: todayInspections.length,
      passed,
      rejected,
      manualReviews: manual,
      defectRatio,
      passRate,
    };
  };

  // ---- Fetch data from FastAPI backend ---------------------------------
  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [inspRes, alrtRes] = await Promise.allSettled([
        api.get<any[]>('/api/v1/inspections'),
        api.get<any[]>('/api/v1/alerts'),
      ]);

      const inspData = inspRes.status === 'fulfilled' ? inspRes.value.data : [];
      const alrtData = alrtRes.status === 'fulfilled' ? alrtRes.value.data : [];

      const inspectionsList = Array.isArray(inspData) ? inspData : (inspData as any)?.items || [];
      const alertsList = Array.isArray(alrtData) ? alrtData : [];

      setInspections(inspectionsList);
      setAlerts(alertsList);

      // Compute statistics
      const derivedStats = computeStats(inspectionsList);
      setStats(derivedStats);

      // Hourly trend aggregation
      const hourlyMap: Record<string, { inspected: number; passed: number; rejected: number }> = {};
      inspectionsList.forEach((i: any) => {
        if (!i.timestamp && !i.created_at) return;
        const timeStr = i.timestamp || i.created_at;
        const hour = new Date(timeStr).getHours().toString().padStart(2, '0') + ':00';
        if (!hourlyMap[hour]) hourlyMap[hour] = { inspected: 0, passed: 0, rejected: 0 };
        hourlyMap[hour].inspected += 1;
        if (i.result === 'PASS' || i.status === 'PASS') hourlyMap[hour].passed += 1;
        if (i.result === 'FAIL' || i.status === 'FAIL') hourlyMap[hour].rejected += 1;
      });

      const trend = Object.entries(hourlyMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([time, v]) => ({ time, inspected: v.inspected, passed: v.passed, rejected: v.rejected }));
      setTrendData(trend);

      // Quality distribution breakdown
      setQualityDistribution([
        { name: 'Passed', value: derivedStats.passed, color: '#15976A' },
        { name: 'Rejected', value: derivedStats.rejected, color: '#DC4545' },
        { name: 'Manual Review', value: derivedStats.manualReviews, color: '#D99020' },
      ]);

      // Defect categories breakdown
      const defectMap: Record<string, number> = {};
      inspectionsList.forEach((i: any) => i.defects?.forEach((d: any) => {
        const typeKey = d.category || d.type || 'Unknown';
        defectMap[typeKey] = (defectMap[typeKey] || 0) + 1;
      }));

      const defectArr = Object.entries(defectMap)
        .sort(([, a], [, b]) => b - a)
        .map(([defect, count], idx) => ({
          defect,
          count,
          fill: ['#DC4545', '#EA580C', '#D99020', '#4169E1', '#7563E8'][idx % 5],
        }));
      setDefectData(defectArr);

    } catch (err: any) {
      console.error('Dashboard fetching error:', err);
      setErrorMessage('Could not load dashboard data from FastAPI backend. Verify server at http://localhost:8000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchDashboardData().finally(() => setIsRefreshing(false));
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-4">
      {/* Top Banner Error Notification */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex justify-between items-center text-sm">
          <span>{errorMessage}</span>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quality Control Dashboard</h1>
          <p className="text-sm text-gray-500">
            Welcome back, {currentUser?.name || 'Inspector'}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase">Total Inspected</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{inspections.length}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase">Pass Rate</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats?.passRate || 0}%</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase">Defect Ratio</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats?.defectRatio || 0}%</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase">Alerts Triggered</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{alerts.length}</p>
        </div>
      </div>

      {/* Dynamic Data Overview Box */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Live Inspection Data Feed</h2>
        <p className="text-sm text-gray-600">
          Connected to FastAPI. Total items retrieved: <span className="font-bold text-indigo-600">{inspections.length}</span>
        </p>
      </div>
    </div>
  );
}