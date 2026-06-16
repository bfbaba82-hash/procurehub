"use client";
import { useState } from "react";
import { Save, UserPlus, Trash2, CheckCircle } from "lucide-react";

const roles = [
  { value: "admin", label: "Admin", desc: "Full access — manage users, settings, budgets, all POs" },
  { value: "procurement_officer", label: "Procurement officer", desc: "Create & submit POs, manage vendors, view inventory" },
  { value: "approver", label: "Approver", desc: "Approve or reject POs assigned to them" },
  { value: "viewer", label: "Viewer", desc: "Read-only access to all pages" },
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

interface Member { name: string; email: string; dept: string; role: string; }

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [thresholds, setThresholds] = useState({ tier1: 10000, tier2: 100000 });
  const [invite, setInvite] = useState({ name: "", email: "", role: "viewer", dept: "" });
  const [members, setMembers] = useState<Member[]>([
    { name: "Baseerat", email: "baseerat@alkuzama.com", dept: "Procurement", role: "admin" },
  ]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleInvite() {
    if (!invite.email || !invite.name) return;
    setMembers([...members, { name: invite.name, email: invite.email, dept: invite.dept, role: invite.role }]);
    setInvite({ name: "", email: "", role: "viewer", dept: "" });
    setShowInvite(false);
  }

  function removeMember(email: string) {
    setMembers(members.filter(m => m.email !== email));
  }

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <h1 className="text-lg font-semibold text-gray-900">Settings</h1>

      {/* Approval thresholds */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Approval thresholds</h2>
        <p className="text-xs text-gray-500 mb-4">Define who needs to approve a PO based on its total value.</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-semibold flex items-center justify-center">1</div>
            <div className="flex-1 text-sm">
              <span className="text-gray-700 font-medium">Up to SAR </span>
              <input className="inline w-24 py-1 px-2 text-center mx-1 rounded border border-gray-300 text-sm outline-none focus:border-blue-500"
                type="number" value={thresholds.tier1}
                onChange={(e) => setThresholds({ ...thresholds, tier1: Number(e.target.value) })} />
              <span className="text-gray-500"> → Direct manager only</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold flex items-center justify-center">2</div>
            <div className="flex-1 text-sm">
              <span className="text-gray-700 font-medium">SAR {thresholds.tier1.toLocaleString()} – </span>
              <input className="inline w-28 py-1 px-2 text-center mx-1 rounded border border-gray-300 text-sm outline-none focus:border-blue-500"
                type="number" value={thresholds.tier2}
                onChange={(e) => setThresholds({ ...thresholds, tier2: Number(e.target.value) })} />
              <span className="text-gray-500"> → Director of Finance</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-semibold flex items-center justify-center">3</div>
            <p className="text-sm text-gray-600">Above SAR {thresholds.tier2.toLocaleString()} → CFO + Board approval required</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-colors mt-4" onClick={handleSave}>
          {saved ? <><CheckCircle size={13} className="text-green-500" /> Saved!</> : <><Save size={13} /> Save thresholds</>}
        </button>
      </div>

      {/* Team members */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Team members</h2>
            <p className="text-xs text-gray-500 mt-0.5">{members.length} member{members.length !== 1 ? "s" : ""} · manage roles and access</p>
          </div>
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setShowInvite(!showInvite)}>
            <UserPlus size={14} /> Invite member
          </button>
        </div>

        {showInvite && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-blue-800 mb-3">Add team member</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full name *</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="Full name" value={invite.name}
                  onChange={(e) => setInvite({ ...invite, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="name@company.sa" value={invite.email}
                  onChange={(e) => setInvite({ ...invite, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={invite.role} onChange={(e) => setInvite({ ...invite, role: e.target.value })}>
                  {roles.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Department</label>
                <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={invite.dept} onChange={(e) => setInvite({ ...invite, dept: e.target.value })}>
                  <option value="">Select department</option>
                  <option>IT</option><option>Operations</option><option>Admin</option>
                  <option>Logistics</option><option>HR</option><option>Finance</option><option>Procurement</option>
                </select>
              </div>
            </div>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              onClick={handleInvite}>Add member</button>
          </div>
        )}

        <table className="w-full">
          <thead className="border-b border-gray-100">
            <tr>
              <th className="px-0 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {members.map((m) => (
              <tr key={m.email} className="hover:bg-gray-50">
                <td className="py-3 text-sm font-medium">{m.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{m.email}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{m.dept}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[m.role]}`}>
                    {roleLabels[m.role]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {m.role !== "admin" && (
                    <button className="text-gray-300 hover:text-red-400 transition-colors" onClick={() => removeMember(m.email)}>
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
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-3">Role permissions</h2>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <div key={r.value} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 ${roleColors[r.value]}`}>{r.label}</span>
              <p className="text-xs text-gray-600">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
