// app/(app)/supplier-portal/page.tsx
"use client";
import { useState } from "react";
import { Copy, Mail, Plus, CheckCircle } from "lucide-react";

const submissions = [
  { name: "AlNoor Trading LLC", email: "info@alnoor.sa", submitted: "Jun 14", docs: "3 files (price list, CR, VAT cert)", status: "pending" },
  { name: "BuildRight Co.", email: "bd@buildright.sa", submitted: "Jun 12", docs: "2 files (catalog, registration)", status: "approved" },
  { name: "Horizon Supplies", email: "contact@horizon.sa", submitted: "Jun 10", docs: "4 files", status: "verifying" },
];

const statusConfig: Record<string, { label: string; className: string }> = {
  pending:   { label: "Needs review", className: "bg-amber-50 text-amber-700" },
  approved:  { label: "Approved",     className: "bg-green-50 text-green-700" },
  verifying: { label: "Verifying",    className: "bg-blue-50 text-blue-700" },
  rejected:  { label: "Rejected",     className: "bg-red-50 text-red-700" },
};

const PORTAL_LINK = "https://procurehub.yourdomain.com/supplier/portal?token=abc123xyz";

export default function SupplierPortalPage() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(PORTAL_LINK).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-gray-900">Supplier portal</h1>
        <button className="btn btn-primary text-sm"><Plus size={14} /> Generate new link</button>
      </div>

      {/* Shareable link card */}
      <div className="card p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-800 mb-1">Self-service portal link</h2>
        <p className="text-xs text-gray-500 mb-4">
          Share this link with suppliers so they can upload their catalog, prices, and documents — no account needed.
        </p>
        <div className="flex gap-2 items-center">
          <div className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 font-mono truncate">
            {PORTAL_LINK}
          </div>
          <button className="btn text-sm" onClick={handleCopy}>
            {copied ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button className="btn text-sm">
            <Mail size={14} /> Email supplier
          </button>
        </div>
      </div>

      {/* Instructions box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
        <p className="text-xs font-semibold text-blue-800 mb-2">How it works</p>
        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
          <li>Generate a unique link (each link can be single-use or reusable)</li>
          <li>Send the link to your supplier by email or chat</li>
          <li>Supplier fills in their details and uploads price lists & documents</li>
          <li>Your team reviews the submission and approves the vendor</li>
        </ol>
      </div>

      {/* Submissions table */}
      <div className="card">
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium text-gray-800">Supplier submissions</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="table-th">Supplier name</th>
              <th className="table-th">Email</th>
              <th className="table-th">Submitted</th>
              <th className="table-th">Documents</th>
              <th className="table-th">Status</th>
              <th className="table-th"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {submissions.map((row) => {
              const s = statusConfig[row.status];
              return (
                <tr key={row.name} className="hover:bg-gray-50 transition-colors">
                  <td className="table-td font-medium">{row.name}</td>
                  <td className="table-td text-gray-500 text-xs">{row.email}</td>
                  <td className="table-td text-gray-400 text-xs">{row.submitted}</td>
                  <td className="table-td text-gray-600 text-xs">{row.docs}</td>
                  <td className="table-td">
                    <span className={`status-badge ${s.className}`}>{s.label}</span>
                  </td>
                  <td className="table-td">
                    <button className="btn text-xs py-1 px-2.5">Review</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
