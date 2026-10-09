import React, { useState } from 'react';
import { useApp } from '../lib/store';
import { User, Role } from '../types';
import { Modal } from '../components/common/Modal';
import {
  Users,
  Plus,
  Search,
  Shield,
  UserCheck,
  CheckCircle,
  XCircle,
  Edit2,
  Calendar,
  Clock
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { currentUser, register } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Operator');

  // Local state for registered users demo list
  const [userList, setUserList] = useState<User[]>([
    {
      id: 'USR-001',
      name: 'Marcus Vance',
      email: 'admin@defectiq.ai',
      role: 'Admin',
      status: 'active',
      createdAt: '2026-01-10',
      lastLogin: '2026-10-09 11:20:00'
    },
    {
      id: 'USR-002',
      name: 'Elena Rostova',
      email: 'operator@defectiq.ai',
      role: 'Operator',
      status: 'active',
      createdAt: '2026-02-14',
      lastLogin: '2026-10-09 10:45:00'
    },
    {
      id: 'USR-003',
      name: 'Kenji Takahashi',
      email: 'kenji.t@defectiq.ai',
      role: 'Operator',
      status: 'active',
      createdAt: '2026-03-01',
      lastLogin: '2026-10-08 16:30:00'
    },
    {
      id: 'USR-004',
      name: 'Sarah Jenkins',
      email: 'sarah.j@defectiq.ai',
      role: 'Admin',
      status: 'active',
      createdAt: '2026-01-20',
      lastLogin: '2026-10-07 09:12:00'
    }
  ]);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const newUser: User = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      role,
      status: 'active',
      createdAt: '2026-10-09',
      lastLogin: 'Just now'
    };
    setUserList([newUser, ...userList]);
    register(name, email, password, role);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setPassword('');
  };

  const toggleUserStatus = (userId: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'inactive' : 'active' };
      }
      return u;
    }));
  };

  const filtered = userList.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-[1500px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E5EAF2] shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-[#172338] tracking-tight">
            User & Role Administration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Admin console for managing floor operators, supervisors, and role-based operational permissions.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <Plus size={15} />
          <span>Provision New User</span>
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
            placeholder="Search by name, email, or role..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-[#F8FAFD] focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20 focus:border-[#4169E1]"
          />
        </div>

        <div className="text-xs text-slate-500">
          Showing <strong>{filtered.length}</strong> authenticated accounts
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-[#E5EAF2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5EAF2] bg-[#F8FAFD] text-slate-500 font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4">Last Login</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[#172338]">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{user.email}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.role === 'Admin'
                          ? 'bg-[#F2EFFF] text-[#7563E8] border border-violet-200'
                          : 'bg-[#EDF3FF] text-[#4169E1] border border-blue-200'
                      }`}
                    >
                      {user.role === 'Admin' ? <Shield size={11} /> : <UserCheck size={11} />}
                      <span>{user.role}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{user.createdAt}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{user.lastLogin}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                    >
                      {user.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Provision New DefectIQ User"
        subtitle="Create an operator or administrative account"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Thomas Alvarez"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. thomas.a@defectiq.ai"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Initial Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#4169E1]/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assigned Operational Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none"
            >
              <option value="Operator">Operator (Floor Inspection & Manual Triage)</option>
              <option value="Admin">Admin (Full System Config, Model Specs & Users)</option>
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
              Provision Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
