// app/(app)/purchase-orders/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Download } from "lucide-react";

const allPOs = [
  { po: "PO-2024-089", vendor: "Al-Rashid Supplies", requestedBy: "M. Khalid", dept: "IT", amount: 48500, status: "pending", date: "Jun 13, 2024" },
  { po: "PO-2024-088", vendor: "Gulf Tech Trading", requestedBy: "S. Ali", dept: "Ops", amount: 122000, status: "approved", date: "Jun 12, 2024" },
  { po: "PO-2024-087", vendor: "Riyadh Stationery", requestedBy: "A. Karim", dept: "Admin", amount: 3200, status: "approved", date: "Jun 11, 2024" },
  { po: "PO-2024-086", vendor: "SaudiMed Co.", requestedBy: "F. Nasser", dept: "HR", amount: 75000, status: "under_review", date: "Jun 10, 2024" },
  { po: "PO-2024-085", vendor: "Delta Logistics", requestedBy: "H. Mansour", dept: "Logistics", amount: 210000, status: "rejected", date: "Jun 9, 2024" },
  { po: "PO-2024-084", vendor: "Al-Rashid Supplies", requestedBy: "M. Khalid", dept: "Admin", amount: 8700, status: "completed", date: "Jun 8, 2024" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-amber-50 text-amber-700" },
  approved:     { label: "Approved",     className: "bg-green-50 text-green-700" },
  under_review: { label: "Under review", className: "bg-blue-50 text-blue-700" },
  rejected:     { label: "Rejected",     className: "bg-red-50 text-red-700" },
  completed:    { label: "Completed",    className: "bg-gray-100 text-gray-600" },
  draft:        { label: "Draft",        className: "bg-gray-50 text-gray-500" },
};

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");
  const [search, setSearch] = useState("");

  const filtered = allPOs.filter((po) => {
    const matchTab =
      activeTab === "All" ? true :
      activeTab === "Pending" ? po.status === "pending" :
      activeTab === "Approved" ? po.status === "approved" :
      activeTab === "Rejected" ? po.status === "rejected" : true;
    const matchSearch = search === "" ||
      po.po.toLowerCase().includes(search.toLowerCase()) ||
      po.vendor.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Purchase orders</h1>
        <div className="flex gap-2">
          <button className="btn text-sm"><Download size={14} /> Export</button>
          <Link href="/purchase-orders/new" className="btn btn-primary text-sm">
            <Plus size={14} /> New PO
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-8"
          placeholder="Search PO number or vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? "border-blue-500 text-blue-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="card">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">PO #</th>
              <th className="table-th">Vendor</th>
              <th className="table-th">Requested by</th>
              <th className="table-th">Dept</th>
              <th className="table-th">Amount (SAR)</th>
              <th className="table-th">Status</th>
              <th className="table-th">Date</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((row) => {
              const s = statusConfig[row.status];
              return (
                <tr key={row.po} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium text-blue-600">
                    <Link href={`/purchase-orders/${row.po}`}>{row.po}</Link>
                  </td>
                  <td className="table-td">{row.vendor}</td>
                  <td className="table-td text-gray-600">{row.requestedBy}</td>
                  <td className="table-td text-gray-500">{row.dept}</td>
                  <td className="table-td font-medium">{row.amount.toLocaleString()}</td>
                  <td className="table-td">
                    <span className={`status-badge ${s.className}`}>{s.label}</span>
                  </td>
                  <td className="table-td text-gray-400 text-xs">{row.date}</td>
                  <td className="table-td">
                    <Link href={`/purchase-orders/${row.po}`} className="btn text-xs py-1 px-2.5">View</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No purchase orders found</div>
        )}
      </div>
    </div>
  );
}
