"use client";
// app/(app)/budget/page.tsx
import { useState } from "react";
import { Download } from "lucide-react";

const budgets = [
  { dept: "IT",         allocated: 600000, spent: 420000, committed: 48500 },
  { dept: "Operations", allocated: 500000, spent: 380000, committed: 0 },
  { dept: "Logistics",  allocated: 400000, spent: 280000, committed: 210000 },
  { dept: "HR",         allocated: 250000, spent: 200000, committed: 75000 },
  { dept: "Admin",      allocated: 250000, spent: 60000,  committed: 3200 },
];

const monthlySpend = [
  { month: "Jan", amount: 180000 },
  { month: "Feb", amount: 95000 },
  { month: "Mar", amount: 220000 },
  { month: "Apr", amount: 145000 },
  { month: "May", amount: 310000 },
  { month: "Jun", amount: 390000 },
];

const YEARS = ["2024", "2023"];

export default function BudgetPage() {
  const [year, setYear] = useState("2024");

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const totalCommitted = budgets.reduce((s, b) => s + b.committed, 0);
  const totalRemaining = totalAllocated - totalSpent - totalCommitted;
  const maxMonthly = Math.max(...monthlySpend.map((m) => m.amount));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Budget & spend</h1>
        <div className="flex gap-2">
          <select
            className="input text-sm py-1.5 w-28"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
          <button className="btn text-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total budget", value: `SAR ${(totalAllocated / 1e6).toFixed(1)}M`, sub: `Fiscal year ${year}` },
          { label: "Spent to date", value: `SAR ${(totalSpent / 1e6).toFixed(2)}M`, sub: `${Math.round((totalSpent / totalAllocated) * 100)}% of total`, color: "text-gray-900" },
          { label: "Committed (open POs)", value: `SAR ${(totalCommitted / 1000).toFixed(0)}K`, sub: "Awaiting delivery", color: "text-amber-600" },
          { label: "Available", value: `SAR ${(totalRemaining / 1000).toFixed(0)}K`, sub: "Unspent & uncommitted", color: "text-green-600" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-xl font-semibold ${m.color ?? "text-gray-900"}`}>{m.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Dept breakdown */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">By department — {year}</h2>
          <div className="space-y-4">
            {budgets.map((b) => {
              const spentPct = Math.round((b.spent / b.allocated) * 100);
              const committedPct = Math.round((b.committed / b.allocated) * 100);
              const barColor =
                spentPct > 85 ? "bg-red-400" :
                spentPct > 70 ? "bg-amber-400" :
                "bg-blue-500";
              return (
                <div key={b.dept}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-gray-700">{b.dept}</span>
                    <span className="text-gray-400">
                      SAR {(b.spent / 1000).toFixed(0)}K + {(b.committed / 1000).toFixed(0)}K committed / {(b.allocated / 1000).toFixed(0)}K ({spentPct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                    <div className={`h-full ${barColor} transition-all`} style={{ width: `${spentPct}%` }} />
                    <div className="h-full bg-amber-200 transition-all" style={{ width: `${committedPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" /> Spent</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-amber-200 inline-block" /> Committed</span>
          </div>
        </div>

        {/* Monthly spend chart */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Monthly spend — {year}</h2>
          <div className="flex items-end gap-2 h-36">
            {monthlySpend.map((m) => {
              const h = Math.round((m.amount / maxMonthly) * 100);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-gray-400">{(m.amount / 1000).toFixed(0)}K</span>
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all"
                    style={{ height: `${h}%` }}
                    title={`SAR ${m.amount.toLocaleString()}`}
                  />
                  <span className="text-[10px] text-gray-500">{m.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dept table */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Budget detail table</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">Department</th>
              <th className="table-th text-right">Allocated (SAR)</th>
              <th className="table-th text-right">Spent (SAR)</th>
              <th className="table-th text-right">Committed (SAR)</th>
              <th className="table-th text-right">Remaining (SAR)</th>
              <th className="table-th text-right">Used %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {budgets.map((b) => {
              const used = Math.round(((b.spent + b.committed) / b.allocated) * 100);
              const remaining = b.allocated - b.spent - b.committed;
              return (
                <tr key={b.dept} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium">{b.dept}</td>
                  <td className="table-td text-right">{b.allocated.toLocaleString()}</td>
                  <td className="table-td text-right">{b.spent.toLocaleString()}</td>
                  <td className="table-td text-right text-amber-600">{b.committed.toLocaleString()}</td>
                  <td className={`table-td text-right font-medium ${remaining < 50000 ? "text-red-600" : "text-green-600"}`}>
                    {remaining.toLocaleString()}
                  </td>
                  <td className="table-td text-right">
                    <span className={`font-semibold ${used > 90 ? "text-red-600" : used > 75 ? "text-amber-600" : "text-gray-700"}`}>
                      {used}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50 font-semibold">
              <td className="table-td text-gray-700">Total</td>
              <td className="table-td text-right">{totalAllocated.toLocaleString()}</td>
              <td className="table-td text-right">{totalSpent.toLocaleString()}</td>
              <td className="table-td text-right text-amber-600">{totalCommitted.toLocaleString()}</td>
              <td className="table-td text-right text-green-600">{totalRemaining.toLocaleString()}</td>
              <td className="table-td text-right">
                {Math.round(((totalSpent + totalCommitted) / totalAllocated) * 100)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
