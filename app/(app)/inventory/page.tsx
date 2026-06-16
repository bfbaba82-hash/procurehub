"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newVendor, setNewVendor] = useState({ name: "", category: "", email: "", phone: "" });
  const [vendors, setVendors] = useState<typeof newVendor[]>([]);

  function handleAdd() {
    if (!newVendor.name) return;
    setVendors([...vendors, newVendor]);
    setNewVendor({ name: "", category: "", email: "", phone: "" });
    setShowModal(false);
  }

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Vendors</h1>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          onClick={() => setShowModal(true)}>
          <Plus size={14} /> Add vendor
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total vendors", value: vendors.length },
          { label: "Active", value: vendors.length },
          { label: "Pending review", value: 0 },
          { label: "Total spend (SAR)", value: "0" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-xl font-semibold text-gray-900">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pl-8 outline-none focus:border-blue-500"
          placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-3">No vendors yet</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Add your first vendor
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((v, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{v.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{v.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{v.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{v.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Add new vendor</h2>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Company name *</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g. Al-Rashid Supplies" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })}>
                  <option value="">Select category</option>
                  <option>Office supplies</option><option>IT equipment</option>
                  <option>Logistics</option><option>Medical supplies</option><option>Other</option>
                </select></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  type="email" placeholder="contact@vendor.com" value={newVendor.email} onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })} /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="+966 1X XXX XXXX" value={newVendor.phone} onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={handleAdd}>Save vendor</button>
              <button className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
