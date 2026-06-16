"use client";
import { useState } from "react";
import { Plus } from "lucide-react";

interface Budget { dept: string; allocated: number; spent: number; }

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState<Budget>({ dept: "", allocated: 0, spent: 0 });

  function handleAdd() {
    if (!newBudget.dept) return;
    setBudgets([...budgets, newBudget]);
    setNewBudget({ dept: "", allocated: 0, spent: 0 });
    setShowModal(false);
  }

  const totalAllocated = budgets.reduce((s, b) => s + b.allocated, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Budget & spend</h1>
        <button onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus size={14} /> Add budget
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total budget", value: `SAR ${totalAllocated.toLocaleString()}` },
          { label: "Spent to date", value: `SAR ${totalSpent.toLocaleString()}` },
          { label: "Remaining", value: `SAR ${(totalAllocated - totalSpent).toLocaleString()}`, color: "text-green-600" },
          { label: "Used %", value: totalAllocated ? `${Math.round((totalSpent/totalAllocated)*100)}%` : "0%" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">{m.label}</p>
            <p className={`text-xl font-semibold ${m.color ?? "text-gray-900"}`}>{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {budgets.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 text-sm mb-3">No budgets set up yet</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
              <Plus size={14} /> Add your first budget
            </button>
          </div>
        ) : (
          <>
            <div className="p-5">
              <h2 className="text-sm font-semibold text-gray-800 mb-4">By department</h2>
              <div className="space-y-4">
                {budgets.map((b, i) => {
                  const pct = b.allocated ? Math.round((b.spent / b.allocated) * 100) : 0;
                  const barColor = pct > 85 ? "bg-red-400" : pct > 70 ? "bg-amber-400" : "bg-blue-500";
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-medium text-gray-700">{b.dept}</span>
                        <span className="text-gray-400">SAR {b.spent.toLocaleString()} / {b.allocated.toLocaleString()} ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <table className="w-full border-t border-gray-100">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Allocated (SAR)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Spent (SAR)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Remaining (SAR)</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Used %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {budgets.map((b, i) => {
                  const pct = b.allocated ? Math.round((b.spent / b.allocated) * 100) : 0;
                  return (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{b.dept}</td>
                      <td className="px-4 py-3 text-sm text-right">{b.allocated.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right">{b.spent.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">{(b.allocated - b.spent).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Add department budget</h2>
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Department *</label>
                <select className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={newBudget.dept} onChange={(e) => setNewBudget({ ...newBudget, dept: e.target.value })}>
                  <option value="">Select department</option>
                  <option>IT</option><option>Operations</option><option>Admin</option>
                  <option>Logistics</option><option>HR</option><option>Finance</option><option>Procurement</option>
                </select></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Allocated budget (SAR)</label>
                <input type="number" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g. 500000" value={newBudget.allocated} onChange={(e) => setNewBudget({ ...newBudget, allocated: Number(e.target.value) })} /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Spent so far (SAR)</label>
                <input type="number" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g. 0" value={newBudget.spent} onChange={(e) => setNewBudget({ ...newBudget, spent: Number(e.target.value) })} /></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button className="flex-1 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors" onClick={handleAdd}>Save budget</button>
              <button className="flex-1 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
