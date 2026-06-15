// app/(app)/dashboard/page.tsx
import Link from "next/link";
import { FileText, Building2, Package, TrendingUp, AlertCircle, Clock } from "lucide-react";

const metrics = [
  { label: "Open POs", value: "24", sub: "↑ 3 this week", icon: FileText, color: "text-blue-600 bg-blue-50" },
  { label: "Pending approval", value: "4", sub: "Avg. 1.2d wait", icon: Clock, color: "text-amber-600 bg-amber-50" },
  { label: "Active vendors", value: "38", sub: "5 pending review", icon: Building2, color: "text-green-600 bg-green-50" },
  { label: "Budget used", value: "67%", sub: "SAR 1.34M of 2M", icon: TrendingUp, color: "text-purple-600 bg-purple-50" },
];

const recentPOs = [
  { po: "PO-2024-089", vendor: "Al-Rashid Supplies", dept: "IT", amount: "48,500", status: "pending" },
  { po: "PO-2024-088", vendor: "Gulf Tech Trading", dept: "Ops", amount: "122,000", status: "approved" },
  { po: "PO-2024-087", vendor: "Riyadh Stationery", dept: "Admin", amount: "3,200", status: "approved" },
  { po: "PO-2024-086", vendor: "SaudiMed Co.", dept: "HR", amount: "75,000", status: "under_review" },
  { po: "PO-2024-085", vendor: "Delta Logistics", dept: "Logistics", amount: "210,000", status: "rejected" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:      { label: "Pending",      className: "bg-amber-50 text-amber-700" },
  approved:     { label: "Approved",     className: "bg-green-50 text-green-700" },
  under_review: { label: "Under review", className: "bg-blue-50 text-blue-700" },
  rejected:     { label: "Rejected",     className: "bg-red-50 text-red-700" },
};

const lowStock = [
  { name: "A4 Paper (reams)", qty: 12, level: "critical" },
  { name: "Printer ink cartridges", qty: 5, level: "critical" },
  { name: "Safety helmets", qty: 28, level: "low" },
  { name: "Ethernet cables (m)", qty: 45, level: "low" },
  { name: "Cleaning supplies kit", qty: 80, level: "ok" },
];

const budgets = [
  { dept: "IT", spent: 420000, total: 600000 },
  { dept: "Operations", spent: 380000, total: 500000 },
  { dept: "Logistics", spent: 280000, total: 400000 },
  { dept: "Admin", spent: 60000, total: 500000 },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        <Link href="/purchase-orders/new" className="btn btn-primary text-sm px-4 py-2">
          + New PO
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">{m.label}</p>
              <div className={`p-1.5 rounded-lg ${m.color}`}>
                <m.icon size={14} />
              </div>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent POs */}
      <div className="card mb-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Recent purchase orders</h2>
          <Link href="/purchase-orders" className="text-xs text-blue-600 hover:underline">View all</Link>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">PO #</th>
              <th className="table-th">Vendor</th>
              <th className="table-th">Dept</th>
              <th className="table-th">Amount (SAR)</th>
              <th className="table-th">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentPOs.map((row) => {
              const s = statusConfig[row.status];
              return (
                <tr key={row.po} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium text-blue-600">
                    <Link href={`/purchase-orders/${row.po}`}>{row.po}</Link>
                  </td>
                  <td className="table-td">{row.vendor}</td>
                  <td className="table-td text-gray-500">{row.dept}</td>
                  <td className="table-td font-medium">{row.amount}</td>
                  <td className="table-td">
                    <span className={`status-badge ${s.className}`}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Budget + Low stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="text-sm font-medium text-gray-800 mb-4">Budget by department</h2>
          <div className="space-y-3">
            {budgets.map((b) => {
              const pct = Math.round((b.spent / b.total) * 100);
              const barColor = pct > 85 ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-blue-500";
              return (
                <div key={b.dept}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{b.dept}</span>
                    <span className="text-gray-400">SAR {(b.spent / 1000).toFixed(0)}K / {(b.total / 1000).toFixed(0)}K ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <AlertCircle size={14} className="text-red-500" />
            <h2 className="text-sm font-medium text-gray-800">Low stock alerts</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStock.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-gray-700">{item.name}</span>
                <span className={
                  item.level === "critical" ? "text-red-600 font-medium" :
                  item.level === "low" ? "text-amber-600 font-medium" :
                  "text-green-600"
                }>{item.qty} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
