"use client";
// app/(app)/vendors/page.tsx
import { useState } from "react";
import { Plus, Search, Star } from "lucide-react";

const vendors = [
  { id: 1, name: "Al-Rashid Supplies", category: "Office supplies", email: "orders@alrashid.sa", phone: "+966 11 234 5678", rating: 4.8, activePOs: 3, totalSpend: 124500, status: "active" },
  { id: 2, name: "Gulf Tech Trading", category: "IT equipment", email: "sales@gulftech.sa", phone: "+966 12 345 6789", rating: 4.5, activePOs: 1, totalSpend: 680000, status: "active" },
  { id: 3, name: "Delta Logistics", category: "Logistics", email: "ops@deltalog.sa", phone: "+966 13 456 7890", rating: 3.9, activePOs: 0, totalSpend: 450000, status: "pending_review" },
  { id: 4, name: "SaudiMed Co.", category: "Medical supplies", email: "info@saudimed.sa", phone: "+966 14 567 8901", rating: 4.2, activePOs: 1, totalSpend: 210000, status: "active" },
  { id: 5, name: "Riyadh Stationery", category: "Office supplies", email: "hello@rystationery.sa", phone: "+966 11 678 9012", rating: 4.6, activePOs: 2, totalSpend: 38000, status: "active" },
  { id: 6, name: "BuildRight Co.", category: "Construction", email: "bd@buildright.sa", phone: "+966 15 789 0123", rating: 4.1, activePOs: 0, totalSpend: 95000, status: "inactive" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  active:         { label: "Active",         className: "bg-green-50 text-green-700" },
  pending_review: { label: "Pending review", className: "bg-amber-50 text-amber-700" },
  inactive:       { label: "Inactive",       className: "bg-gray-100 text-gray-500" },
  blacklisted:    { label: "Blacklisted",    className: "bg-red-50 text-red-700" },
};

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", category: "", email: "", phone: "" });

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Vendors</h1>
        <button className="btn btn-primary text-sm" onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add vendor
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total vendors", value: vendors.length },
          { label: "Active", value: vendors.filter((v) => v.status === "active").length },
          { label: "Pending review", value: vendors.filter((v) => v.status === "pending_review").length },
          { label: "Total spend (SAR)", value: vendors.reduce((s, v) => s + v.totalSpend, 0).toLocaleString() },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-xl font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-8"
          placeholder="Search vendors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">Vendor</th>
              <th className="table-th">Category</th>
              <th className="table-th">Contact</th>
              <th className="table-th">Rating</th>
              <th className="table-th text-right">Active POs</th>
              <th className="table-th text-right">Total spend (SAR)</th>
              <th className="table-th">Status</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((v) => {
              const s = statusConfig[v.status];
              return (
                <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium text-gray-900">{v.name}</td>
                  <td className="table-td text-gray-500 text-xs">{v.category}</td>
                  <td className="table-td">
                    <p className="text-xs text-gray-700">{v.email}</p>
                    <p className="text-xs text-gray-400">{v.phone}</p>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-sm font-medium">{v.rating}</span>
                    </div>
                  </td>
                  <td className="table-td text-right">{v.activePOs}</td>
                  <td className="table-td text-right font-medium">{v.totalSpend.toLocaleString()}</td>
                  <td className="table-td">
                    <span className={`status-badge ${s.className}`}>{s.label}</span>
                  </td>
                  <td className="table-td">
                    <button className="btn text-xs py-1 px-2.5">View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No vendors found</div>
        )}
      </div>

      {/* Add vendor modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-gray-900 mb-4">Add new vendor</h2>
            <div className="space-y-3">
              <div>
                <label className="label">Company name *</label>
                <input className="input" placeholder="e.g. AlNoor Trading LLC"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input"
                  value={newVendor.category}
                  onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}
                >
                  <option value="">Select category</option>
                  <option>Office supplies</option>
                  <option>IT equipment</option>
                  <option>Logistics</option>
                  <option>Medical supplies</option>
                  <option>Construction</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="contact@vendor.com"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" placeholder="+966 1X XXX XXXX"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="btn btn-primary flex-1 justify-center py-2" onClick={() => setShowModal(false)}>
                Save vendor
              </button>
              <button className="btn flex-1 justify-center py-2" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
