"use client";
// app/(app)/purchase-orders/[id]/page.tsx
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, CheckCircle, XCircle, Clock } from "lucide-react";

const po = {
  id: "PO-2024-089",
  vendor: "Al-Rashid Supplies",
  vendorEmail: "orders@alrashid.sa",
  requestedBy: "Mohammed Khalid",
  department: "IT",
  dateSubmitted: "June 13, 2024",
  requiredBy: "June 30, 2024",
  budgetLine: "CAPEX 2024",
  justification: "Required for new hires joining in Q3. Three complete workstation setups including laptops, monitors, and docking stations.",
  status: "pending",
  totalAmount: 48500,
  currency: "SAR",
};

const lineItems = [
  { no: 1, description: "Laptop Dell XPS 15", qty: 3, unit: "unit", unitPrice: 9500, total: 28500 },
  { no: 2, description: "USB-C Docking station", qty: 3, unit: "unit", unitPrice: 1800, total: 5400 },
  { no: 3, description: "27\" Monitor (4K)", qty: 2, unit: "unit", unitPrice: 7300, total: 14600 },
];

const approvalSteps = [
  { step: 1, role: "Direct manager", name: "Sarah Al-Mahmoud", status: "approved", date: "Jun 13" },
  { step: 2, role: "Director of Finance", name: "Pending", status: "pending", date: null },
  { step: 3, role: "CFO (>SAR 100K)", name: "—", status: "na", date: null },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:      { label: "Pending approval", className: "bg-amber-50 text-amber-700" },
  approved:     { label: "Approved",          className: "bg-green-50 text-green-700" },
  under_review: { label: "Under review",      className: "bg-blue-50 text-blue-700" },
  rejected:     { label: "Rejected",          className: "bg-red-50 text-red-700" },
};

export default function PODetailPage({ params }: { params: { id: string } }) {
  const [action, setAction] = useState<"idle" | "approving" | "rejecting" | "done">("idle");
  const [comment, setComment] = useState("");
  const [result, setResult] = useState<"approved" | "rejected" | null>(null);

  async function handleAction(type: "approved" | "rejected") {
    setAction(type === "approved" ? "approving" : "rejecting");
    await new Promise((r) => setTimeout(r, 800));
    setResult(type);
    setAction("done");
  }

  const s = statusConfig[result ?? po.status];

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/purchase-orders" className="btn text-sm py-1.5">
            <ArrowLeft size={14} /> Back
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">{po.id}</h1>
          <span className={`status-badge ${s.className}`}>{s.label}</span>
        </div>
        <button className="btn text-sm"><Download size={14} /> Download PDF</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* PO info */}
        <div className="col-span-2 card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Order information</h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {[
              ["Vendor", po.vendor],
              ["Requested by", po.requestedBy],
              ["Department", po.department],
              ["Date submitted", po.dateSubmitted],
              ["Required by", po.requiredBy],
              ["Budget line", po.budgetLine],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-800">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Justification</p>
            <p className="text-sm text-gray-700">{po.justification}</p>
          </div>
        </div>

        {/* Approval chain */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Approval chain</h2>
          <div className="space-y-4">
            {approvalSteps.map((step) => (
              <div key={step.step} className="flex gap-3 items-start">
                <div className="mt-0.5">
                  {step.status === "approved" && <CheckCircle size={16} className="text-green-500" />}
                  {step.status === "pending" && <Clock size={16} className="text-amber-400" />}
                  {step.status === "na" && <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">{step.role}</p>
                  <p className="text-xs text-gray-400">{step.name}{step.date ? ` · ${step.date}` : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="card mb-5">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Line items</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">#</th>
              <th className="table-th">Description</th>
              <th className="table-th text-right">Qty</th>
              <th className="table-th">Unit</th>
              <th className="table-th text-right">Unit price (SAR)</th>
              <th className="table-th text-right">Total (SAR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {lineItems.map((item) => (
              <tr key={item.no}>
                <td className="table-td text-gray-400">{item.no}</td>
                <td className="table-td font-medium">{item.description}</td>
                <td className="table-td text-right">{item.qty}</td>
                <td className="table-td text-gray-500">{item.unit}</td>
                <td className="table-td text-right">{item.unitPrice.toLocaleString()}</td>
                <td className="table-td text-right font-medium">{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-gray-50">
              <td colSpan={5} className="table-td text-right font-semibold text-gray-700">Total</td>
              <td className="table-td text-right font-semibold text-gray-900">
                SAR {po.totalAmount.toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Approve / Reject */}
      {action !== "done" && result === null && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-gray-800 mb-3">Your decision</h2>
          <div className="mb-3">
            <label className="label">Comment (optional)</label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Add a note for the requester..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <button
              className="btn btn-primary px-5 py-2"
              onClick={() => handleAction("approved")}
              disabled={action !== "idle"}
            >
              <CheckCircle size={14} />
              {action === "approving" ? "Approving…" : "Approve"}
            </button>
            <button
              className="btn px-5 py-2 border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => handleAction("rejected")}
              disabled={action !== "idle"}
            >
              <XCircle size={14} />
              {action === "rejecting" ? "Rejecting…" : "Reject"}
            </button>
          </div>
        </div>
      )}

      {action === "done" && (
        <div className={`rounded-xl border px-5 py-4 flex items-center gap-3 text-sm font-medium ${
          result === "approved"
            ? "bg-green-50 border-green-100 text-green-700"
            : "bg-red-50 border-red-100 text-red-700"
        }`}>
          {result === "approved"
            ? <><CheckCircle size={16} /> PO approved — the requester has been notified.</>
            : <><XCircle size={16} /> PO rejected — the requester has been notified.</>}
        </div>
      )}
    </div>
  );
}
