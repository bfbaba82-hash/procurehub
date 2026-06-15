"use client";
// app/(app)/purchase-orders/new/page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  unit_price: number;
  unit: string;
}

const vendors = [
  "Al-Rashid Supplies",
  "Gulf Tech Trading",
  "Delta Logistics",
  "SaudiMed Co.",
  "Riyadh Stationery",
];

const departments = ["IT", "Operations", "Admin", "Logistics", "HR", "Finance"];
const budgetLines = ["CAPEX 2024", "OPEX Q2", "OPEX Q3", "Emergency fund"];

export default function NewPOPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    vendor: "",
    department: "",
    required_by: "",
    budget_line: "",
    justification: "",
  });
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, unit_price: 0, unit: "unit" },
  ]);

  const total = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: Date.now(), description: "", quantity: 1, unit_price: 0, unit: "unit" },
    ]);
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: number, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    router.push("/purchase-orders");
  }

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/purchase-orders" className="btn text-sm py-1.5">
          <ArrowLeft size={14} /> Back
        </Link>
        <h1 className="text-lg font-semibold text-gray-900">New purchase order</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* PO details */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Order details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Vendor *</label>
              <select
                className="input"
                required
                value={form.vendor}
                onChange={(e) => setForm({ ...form, vendor: e.target.value })}
              >
                <option value="">Select vendor</option>
                {vendors.map((v) => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Department *</label>
              <select
                className="input"
                required
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              >
                <option value="">Select department</option>
                {departments.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Required by date *</label>
              <input
                className="input"
                type="date"
                required
                value={form.required_by}
                onChange={(e) => setForm({ ...form, required_by: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Budget line</label>
              <select
                className="input"
                value={form.budget_line}
                onChange={(e) => setForm({ ...form, budget_line: e.target.value })}
              >
                <option value="">Select budget line</option>
                {budgetLines.map((b) => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Business justification *</label>
              <textarea
                className="input resize-none"
                rows={3}
                required
                placeholder="Describe why this purchase is needed..."
                value={form.justification}
                onChange={(e) => setForm({ ...form, justification: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="label">Attach supporting document</label>
              <input className="input" type="file" accept=".pdf,.xlsx,.docx,.jpg,.png" />
              <p className="text-xs text-gray-400 mt-1">Quote, proposal, or invoice (PDF, Excel, Word, image)</p>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Line items</h2>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-1 pt-7 text-xs text-gray-400 text-center">{idx + 1}</div>
                <div className="col-span-4">
                  {idx === 0 && <label className="label">Description</label>}
                  <input
                    className="input"
                    required
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <label className="label">Qty</label>}
                  <input
                    className="input"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  {idx === 0 && <label className="label">Unit</label>}
                  <select
                    className="input"
                    value={item.unit}
                    onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                  >
                    <option>unit</option>
                    <option>box</option>
                    <option>ream</option>
                    <option>meter</option>
                    <option>kg</option>
                  </select>
                </div>
                <div className="col-span-2">
                  {idx === 0 && <label className="label">Unit price (SAR)</label>}
                  <input
                    className="input"
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unit_price}
                    onChange={(e) => updateItem(item.id, "unit_price", Number(e.target.value))}
                  />
                </div>
                <div className="col-span-1 pt-7 flex justify-end">
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="btn text-sm mt-4"
          >
            <Plus size={14} /> Add line item
          </button>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <div className="text-sm">
              <span className="text-gray-500 mr-3">Total</span>
              <span className="text-lg font-semibold text-gray-900">
                SAR {total.toLocaleString("en-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Approval info */}
        {total > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
            <strong>Approval route: </strong>
            {total <= 10000
              ? "Direct manager only"
              : total <= 100000
              ? "Direct manager → Director of Finance"
              : "Direct manager → Director of Finance → CFO"}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary px-6 py-2.5"
          >
            {submitting ? "Submitting…" : "Submit for approval"}
          </button>
          <button
            type="button"
            className="btn px-6 py-2.5"
            onClick={() => router.push("/purchase-orders")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
