"use client";
// app/(app)/inventory/page.tsx
import { useState } from "react";
import { Search, Plus, AlertTriangle } from "lucide-react";

const items = [
  { id: 1, sku: "STN-001", name: "A4 Paper", category: "Stationery", qty: 12, reorder: 50, unit: "Ream", unitCost: 25, status: "critical" },
  { id: 2, sku: "IT-042", name: "Ink cartridges", category: "IT", qty: 5, reorder: 20, unit: "Unit", unitCost: 120, status: "critical" },
  { id: 3, sku: "SAF-007", name: "Safety helmets", category: "Safety", qty: 28, reorder: 40, unit: "Unit", unitCost: 85, status: "low" },
  { id: 4, sku: "IT-018", name: "Ethernet cables", category: "IT", qty: 45, reorder: 60, unit: "Meter", unitCost: 8, status: "low" },
  { id: 5, sku: "FUR-003", name: "Office chairs", category: "Furniture", qty: 120, reorder: 30, unit: "Unit", unitCost: 750, status: "good" },
  { id: 6, sku: "FAC-012", name: "Cleaning kits", category: "Facilities", qty: 80, reorder: 40, unit: "Kit", unitCost: 45, status: "good" },
  { id: 7, sku: "IT-055", name: "Laptop stands", category: "IT", qty: 34, reorder: 20, unit: "Unit", unitCost: 180, status: "good" },
  { id: 8, sku: "MED-009", name: "First aid kits", category: "Medical", qty: 15, reorder: 10, unit: "Kit", unitCost: 220, status: "good" },
];

const statusConfig: Record<string, { label: string; className: string; barColor: string }> = {
  critical: { label: "Critical", className: "bg-red-50 text-red-700", barColor: "bg-red-400" },
  low:      { label: "Low stock", className: "bg-amber-50 text-amber-700", barColor: "bg-amber-400" },
  good:     { label: "Good",      className: "bg-green-50 text-green-700", barColor: "bg-green-500" },
};

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = items.filter((i) => {
    const matchSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.sku.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All" ? true :
      filter === "Critical" ? i.status === "critical" :
      filter === "Low stock" ? i.status === "low" : true;
    return matchSearch && matchFilter;
  });

  const totalValue = items.reduce((sum, i) => sum + i.qty * i.unitCost, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Inventory</h1>
        <button className="btn btn-primary text-sm"><Plus size={14} /> Add item</button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: "Total SKUs", value: items.length },
          { label: "Critical", value: items.filter((i) => i.status === "critical").length, color: "text-red-600" },
          { label: "Low stock", value: items.filter((i) => i.status === "low").length, color: "text-amber-600" },
          { label: "Inventory value (SAR)", value: totalValue.toLocaleString() },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-xl font-semibold ${m.color ?? "text-gray-900"}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {items.some((i) => i.status === "critical") && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">
          <AlertTriangle size={15} />
          <strong>{items.filter((i) => i.status === "critical").length} items</strong> are critically low and need immediate reorder.
        </div>
      )}

      {/* Filters + search */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-8"
            placeholder="Search by name, SKU, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1.5">
          {["All", "Critical", "Low stock"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                filter === f
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">SKU</th>
              <th className="table-th">Item name</th>
              <th className="table-th">Category</th>
              <th className="table-th text-right">In stock</th>
              <th className="table-th text-right">Reorder at</th>
              <th className="table-th">Unit</th>
              <th className="table-th text-right">Unit cost (SAR)</th>
              <th className="table-th">Stock level</th>
              <th className="table-th">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((item) => {
              const s = statusConfig[item.status];
              const pct = Math.min(100, Math.round((item.qty / (item.reorder * 2)) * 100));
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td text-xs text-gray-400 font-mono">{item.sku}</td>
                  <td className="table-td font-medium">{item.name}</td>
                  <td className="table-td text-gray-500 text-xs">{item.category}</td>
                  <td className="table-td text-right font-semibold">{item.qty}</td>
                  <td className="table-td text-right text-gray-500">{item.reorder}</td>
                  <td className="table-td text-gray-500 text-xs">{item.unit}</td>
                  <td className="table-td text-right">{item.unitCost.toLocaleString()}</td>
                  <td className="table-td w-28">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${s.barColor} rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{pct}%</p>
                  </td>
                  <td className="table-td">
                    <span className={`status-badge ${s.className}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No items found</div>
        )}
      </div>
    </div>
  );
}
