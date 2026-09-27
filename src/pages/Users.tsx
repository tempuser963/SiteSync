import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useProject } from '../context/ProjectContext';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { StatusBadge } from '../components/ui/Badge';
import { ROLE_LABELS, ROLE_BADGES } from '../config/permissions';
import { User, UserRole } from '../types';
import {
  Users as UsersIcon,
  Shield,
  UserCheck,
  UserX,
  Search,
  Filter,
  KeyRound,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Users: React.FC = () => {
  const { users, updateUser, deactivateUser, resetUserPassword } = useAuth();
  const { showToast } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Edit Role Modal State
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<User | null>(
    null
  );
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>('PROJECT_PLANNER');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Stats calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Active').length;
  const inactiveUsers = users.filter((u) => u.status === 'Inactive').length;
  const adminUsers = users.filter((u) => u.role === 'ADMIN').length;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'All' || u.role === roleFilter;
      const matchStatus = statusFilter === 'All' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  const handleOpenEdit = (targetUser: User) => {
    setSelectedUserForEdit(targetUser);
    setNewSelectedRole(targetUser.role);
    setIsEditModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedUserForEdit) return;
    updateUser(selectedUserForEdit.id, { role: newSelectedRole });
    setIsEditModalOpen(false);
    showToast(
      `Role for ${selectedUserForEdit.name} updated to ${ROLE_LABELS[newSelectedRole]}`,
      'success'
    );
  };

  const handleToggleStatus = (targetUser: User) => {
    const newStatus = targetUser.status === 'Active' ? 'Inactive' : 'Active';
    updateUser(targetUser.id, { status: newStatus });
    showToast(
      `${targetUser.name} marked as ${newStatus}`,
      newStatus === 'Active' ? 'success' : 'warning'
    );
  };

  const handleResetPass = (targetUser: User) => {
    resetUserPassword(targetUser.id);
    showToast(
      `Temporary password reset simulated for ${targetUser.name}`,
      'info'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              User &amp; Role Management
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
              Admin Console
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Enterprise identity governance, project role provisioning, and account lifecycle control
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/users"
            className="px-3 py-1.5 rounded-md bg-brand dark:bg-yellow-400 dark:text-zinc-950 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <UsersIcon className="w-3.5 h-3.5" /> Users Directory
          </Link>
          <Link
            to="/users/roles"
            className="px-3 py-1.5 rounded-md border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Shield className="w-3.5 h-3.5" /> Roles Matrix
          </Link>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
            <UsersIcon className="w-3.5 h-3.5 text-brand dark:text-yellow-300" /> Total Users
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-zinc-100">
            {totalUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Across 6 departments</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900 shadow-xs">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" /> Active Users
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {activeUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">With active credentials</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900 shadow-xs">
          <div className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1.5">
            <UserX className="w-3.5 h-3.5" /> Inactive / Pending
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inactiveUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Deactivated profiles</div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-purple-200 dark:border-purple-900 shadow-xs">
          <div className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-1 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Administrators
          </div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {adminUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Root governance level</div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-zinc-300">
            <Filter className="w-4 h-4 text-brand dark:text-yellow-300" />
            Filter Directory
          </div>
          <div className="text-xs text-slate-500">
            Showing <span className="font-semibold text-slate-800 dark:text-zinc-200">{filteredUsers.length}</span> of {totalUsers} accounts
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">All Roles</option>
              <option value="ADMIN">System Administrator</option>
              <option value="PROJECT_MANAGER">Project Manager</option>
              <option value="PROJECT_PLANNER">Planner / Scheduler</option>
              <option value="DISCIPLINE_ENGINEER">Discipline Engineer</option>
              <option value="SITE_SUPERVISOR">Site Supervisor</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-brand dark:focus:border-yellow-400"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <Card
        title="Enterprise Directory &amp; Role Assignments"
        subtitle="Manage assigned projects, RBAC permissions, and authentication status"
      >
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/40 text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Role Authority</th>
                <th className="py-2.5 px-3">Assigned Projects</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredUsers.map((targetUser) => {
                const badge = ROLE_BADGES[targetUser.role];
                return (
                  <tr
                    key={targetUser.id}
                    className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {targetUser.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-zinc-100">
                            {targetUser.name}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {targetUser.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-700 dark:text-zinc-300 font-medium">
                      {targetUser.department}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {targetUser.projectIds.map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[10px] font-mono text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold border ${
                          targetUser.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-100 text-slate-600 border-slate-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'
                        }`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {targetUser.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {targetUser.lastActive || '22 Sep 2026'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(targetUser)}
                          title="Edit Role Authority"
                          className="p-1 rounded border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(targetUser)}
                          title={
                            targetUser.status === 'Active'
                              ? 'Deactivate User'
                              : 'Activate User'
                          }
                          className={`p-1 rounded border ${
                            targetUser.status === 'Active'
                              ? 'border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-950/40'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/60 dark:hover:bg-emerald-950/40'
                          }`}
                        >
                          {targetUser.status === 'Active' ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleResetPass(targetUser)}
                          title="Simulate Password Reset"
                          className="p-1 rounded border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Role Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Modify Role Authority"
        subtitle={`Update enterprise permission level for ${selectedUserForEdit?.name}`}
        maxWidth="md"
        footer={
          <>
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="px-3 py-1.5 border border-slate-300 dark:border-zinc-700 rounded-md text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRole}
              className="px-4 py-1.5 bg-brand dark:bg-yellow-400 dark:text-zinc-950 hover:bg-brand-dark dark:hover:bg-yellow-300 text-white text-xs font-semibold rounded-md shadow-xs transition"
            >
              Save Role Assignment
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-md bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              User Details
            </span>
            <div className="font-bold text-slate-900 dark:text-zinc-100 text-sm mt-0.5">
              {selectedUserForEdit?.name}
            </div>
            <div className="font-mono text-slate-500 text-[11px]">
              {selectedUserForEdit?.email} • {selectedUserForEdit?.department}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 dark:text-zinc-200 mb-1.5">
              Select New Role Authority
            </label>
            <div className="space-y-2">
              {(
                [
                  'ADMIN',
                  'PROJECT_MANAGER',
                  'PROJECT_PLANNER',
                  'DISCIPLINE_ENGINEER',
                  'SITE_SUPERVISOR',
                ] as UserRole[]
              ).map((r) => {
                const isSelected = newSelectedRole === r;
                return (
                  <label
                    key={r}
                    onClick={() => setNewSelectedRole(r)}
                    className={`flex items-center justify-between p-2.5 rounded-md border cursor-pointer transition ${
                      isSelected
                        ? 'border-brand dark:border-yellow-400 bg-brand-soft/60 dark:bg-yellow-400/10 text-brand-deep dark:text-yellow-100'
                        : 'border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800/40 text-slate-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="font-semibold text-xs">{ROLE_LABELS[r]}</div>
                    <input
                      type="radio"
                      name="roleAssignment"
                      checked={isSelected}
                      onChange={() => setNewSelectedRole(r)}
                      className="accent-brand dark:accent-yellow-400"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
