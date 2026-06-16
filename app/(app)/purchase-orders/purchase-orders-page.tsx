"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

const tabs = ["All", "Pending", "Approved", "Rejected"] as const;

export default function PurchaseOrdersPage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>("All");
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Purchase orders</h1>
        <Link href="/purchase-orders/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> New PO
        </Link>
      </div>

      <div className="relative mb-4 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm pl-8 outline-none focus:border-blue-500"
          placeholder="Search PO number or vendor..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm border-b-2 transition-colors -mb-px ${
              activeTab === tab ? "border-blue-500 text-blue-600 font-medium" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{tab}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="py-20 text-center">
          <p className="text-gray-400 text-sm mb-3">No purchase orders yet</p>
          <Link href="/purchase-orders/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus size={14} /> Create your first PO
          </Link>
        </div>
      </div>
    </div>
  );
}
