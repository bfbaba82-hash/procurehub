"use client";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

interface Item { name: string; category: string; qty: number; reorder: number; unit: string; unitCost: number; }

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState<Item>({ name: "", category: "", qty: 0, reorder: 0, unit: "unit", unitCost: 0 });

  function handleAdd() {
    if (!newItem.name) return;
    setItems([...items, newItem]);
    setNewItem({ name: "", category: "", qty: 0, reorder: 0, unit: "unit", unitCost: 0 });
    setShowModal(false);
  }

  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> Add item
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "Total SKUs", value: items.length },
          { label: "Low stock", value: items.filter(i => i.qty <= i.reorder).length, color: "text-red-600" },
          { label: "Inventory value (SAR)", value: items.reduce((s, i) => s + i.qty * i.unitCost, 0).toLocaleString() },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-xl font-semibold ${m.color ?? "text-gray-900"}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pl-8 outline-none focus:border-blue-500"
          placeholder="Search items..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-3">No inventory items yet</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Add your first item
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">In stock</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Reorder at</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item, i) => {
                const isLow = item.qty <= item.reorder;
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold">{item.qty}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-500">{item.reorder}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.unit}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isLow ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                        {isLow ? "Low stock" : "Good"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Add inventory item</h2>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Item name *</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g. A4 Paper" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g. Stationery" value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Quantity in stock</label>
                  <input type="number" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newItem.qty} onChange={(e) => setNewItem({ ...newItem, qty: Number(e.target.value) })} /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Reorder point</label>
                  <input type="number" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newItem.reorder} onChange={(e) => setNewItem({ ...newItem, reorder: Number(e.target.value) })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                  <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
                    <option>unit</option><option>box</option><option>ream</option><option>meter</option><option>kg</option>
                  </select></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Unit cost (SAR)</label>
                  <input type="number" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={newItem.unitCost} onChange={(e) => setNewItem({ ...newItem, unitCost: Number(e.target.value) })} /></div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={handleAdd}>Save item</button>
              <button className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
