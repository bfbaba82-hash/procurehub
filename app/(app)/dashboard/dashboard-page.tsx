// app/(app)/dashboard/page.tsx
import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <Link href="/purchase-orders/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          + New PO
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Open POs", value: "0", sub: "No open POs yet" },
          { label: "Pending approval", value: "0", sub: "Nothing pending" },
          { label: "Active vendors", value: "0", sub: "Add vendors to start" },
          { label: "Budget used", value: "0%", sub: "No budget set yet" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Recent purchase orders</h2>
        </div>
        <div className="py-16 text-center">
          <p className="text-gray-400 text-sm mb-3">No purchase orders yet</p>
          <Link href="/purchase-orders/new" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            + Create your first PO
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Budget by department</h2>
          <div className="py-8 text-center text-sm text-gray-400">
            No budget data yet — go to Budget page to set up
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <AlertCircle size={14} className="text-gray-400" />
            <h2 className="text-sm font-medium text-gray-800">Low stock alerts</h2>
          </div>
          <div className="py-8 text-center text-sm text-gray-400">
            No inventory items yet — go to Inventory to add items
          </div>
        </div>
      </div>
    </div>
  );
}
