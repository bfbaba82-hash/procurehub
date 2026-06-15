"use client";
// app/(app)/settings/page.tsx
import { useState } from "react";
import { Save, UserPlus, Trash2, CheckCircle } from "lucide-react";

const roles = [
  { value: "admin", label: "Admin", desc: "Full access — manage users, settings, budgets, all POs" },
  { value: "procurement_officer", label: "Procurement officer", desc: "Create & submit POs, manage vendors, view inventory" },
  { value: "approver", label: "Approver", desc: "Approve or reject POs assigned to them" },
  { value: "viewer", label: "Viewer", desc: "Read-only access to all pages" },
];

const teamMembers = [
  { id: 1, name: "Ahmed Karim", email: "a.karim@company.sa", role: "admin", dept: "Procurement" },
  { id: 2, name: "Mohammed Khalid", email: "m.khalid@company.sa", role: "procurement_officer", dept: "IT" },
  { id: 3, name: "Sarah Al-Mahmoud", email: "s.mahmoud@company.sa", role: "approver", dept: "Finance" },
  { id: 4, name: "Fatima Nasser", email: "f.nasser@company.sa", role: "procurement_officer", dept: "HR" },
  { id: 5, name: "Hassan Mansour", email: "h.mansour@company.sa", role: "viewer", dept: "Logistics" },
];

const roleColors: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700",
  procurement_officer: "bg-blue-50 text-blue-700",
  approver: "bg-green-50 text-green-700",
  viewer: "bg-gray-100 text-gray-500",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  procurement_officer: "Procurement officer",
  approver: "Approver",
  viewer: "Viewer",
};

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [thresholds, setThresholds] = useState({ tier1: 10000, tier2: 100000 });
  const [invite, setInvite] = useState({ email: "", role: "viewer", dept: "" });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>

      {/* Approval thresholds */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Approval thresholds</h2>
        <p className="text-xs text-gray-500 mb-4">
          Define who needs to approve a PO based on its total value.
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center">1</div>
            <div className="flex-1 text-sm">
              <span className="text-gray-700 font-medium">Up to SAR </span>
              <input
                className="input inline w-24 py-1 px-2 text-center mx-1"
                type="number"
                value={thresholds.tier1}
                onChange={(e) => setThresholds({ ...thresholds, tier1: Number(e.target.value) })}
              />
              <span className="text-gray-500"> → Direct manager only</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center">2</div>
            <div className="flex-1 text-sm">
              <span className="text-gray-700 font-medium">SAR {thresholds.tier1.toLocaleString()} – </span>
              <input
                className="input inline w-28 py-1 px-2 text-center mx-1"
                type="number"
                value={thresholds.tier2}
                onChange={(e) => setThresholds({ ...thresholds, tier2: Number(e.target.value) })}
              />
              <span className="text-gray-500"> → Director of Finance</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center justify-center">3</div>
            <p className="text-sm text-gray-600">
              Above SAR {thresholds.tier2.toLocaleString()} → CFO + Board approval required
            </p>
          </div>
        </div>
        <button className="btn btn-primary text-sm mt-4" onClick={handleSave}>
          {saved ? <><CheckCircle size={13} /> Saved!</> : <><Save size={13} /> Save thresholds</>}
        </button>
      </div>

      {/* Team members */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Team members</h2>
            <p className="text-xs text-gray-500 mt-0.5">{teamMembers.length} members · manage roles and access</p>
          </div>
          <button className="btn text-sm" onClick={() => setShowInvite(!showInvite)}>
            <UserPlus size={14} /> Invite member
          </button>
        </div>

        {showInvite && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-blue-800 mb-3">Send invitation</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="label">Email *</label>
                <input className="input text-sm" placeholder="name@company.sa"
                  value={invite.email}
                  onChange={(e) => setInvite({ ...invite, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="input text-sm"
                  value={invite.role}
                  onChange={(e) => setInvite({ ...invite, role: e.target.value })}
                >
                  {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Department</label>
                <input className="input text-sm" placeholder="e.g. IT"
                  value={invite.dept}
                  onChange={(e) => setInvite({ ...invite, dept: e.target.value })}
                />
              </div>
            </div>
            <button
              className="btn btn-primary text-sm mt-3"
              onClick={() => { setShowInvite(false); setInvite({ email: "", role: "viewer", dept: "" }); }}
            >
              Send invite
            </button>
          </div>
        )}

        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="table-th">Name</th>
              <th className="table-th">Email</th>
              <th className="table-th">Department</th>
              <th className="table-th">Role</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {teamMembers.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="table-td font-medium">{m.name}</td>
                <td className="table-td text-gray-500 text-xs">{m.email}</td>
                <td className="table-td text-gray-500">{m.dept}</td>
                <td className="table-td">
                  <span className={`status-badge ${roleColors[m.role]}`}>{roleLabels[m.role]}</span>
                </td>
                <td className="table-td">
                  {m.role !== "admin" && (
                    <button className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role reference */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Role permissions</h2>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <div key={r.value} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg">
              <span className={`status-badge mt-0.5 text-[10px] ${roleColors[r.value]}`}>{r.label}</span>
              <p className="text-xs text-gray-600">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
