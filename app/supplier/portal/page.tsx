// app/supplier/portal/page.tsx
"use client";
import { useState } from "react";
import { Upload, CheckCircle, Box } from "lucide-react";

type Step = "form" | "success";

export default function SupplierPortalPage() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({
    supplierName: "", email: "", phone: "", crNumber: "", vatNumber: "", category: "", notes: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("success");
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center max-w-md w-full">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Submission received!</h1>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for submitting your details to <strong>{form.supplierName || "us"}</strong>. Our procurement team will review your submission and contact you within 3–5 business days.
          </p>
          <p className="text-xs text-gray-400">You can close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Box size={22} className="text-blue-600" />
            <span className="text-lg font-semibold text-gray-900">ProcureHub</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Supplier registration</h1>
          <p className="text-sm text-gray-500">
            Fill in your company details and upload your price list. Our team will be in touch shortly.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          {/* Company info */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Company information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="label">Company name *</label>
                <input className="input" required placeholder="e.g. AlNoor Trading LLC"
                  value={form.supplierName}
                  onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">CR number</label>
                <input className="input" placeholder="1010XXXXXX"
                  value={form.crNumber}
                  onChange={(e) => setForm({ ...form, crNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="label">VAT number</label>
                <input className="input" placeholder="3XXXXXXXXXXXXXXX3"
                  value={form.vatNumber}
                  onChange={(e) => setForm({ ...form, vatNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Email address *</label>
                <input className="input" type="email" required placeholder="orders@yourcompany.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Phone number</label>
                <input className="input" placeholder="+966 5X XXX XXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="label">Product / service category *</label>
                <select className="input" required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">Select a category</option>
                  <option>Office supplies & stationery</option>
                  <option>IT equipment & electronics</option>
                  <option>Furniture & fixtures</option>
                  <option>Logistics & transportation</option>
                  <option>Safety equipment</option>
                  <option>Medical & healthcare</option>
                  <option>Facilities management</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-3">Documents & price list</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Upload size={20} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">Drag & drop files here, or <span className="text-blue-600">browse</span></p>
              <p className="text-xs text-gray-400">PDF, Excel, Word — price list, CR copy, VAT certificate, catalog</p>
              <input type="file" className="hidden" multiple accept=".pdf,.xlsx,.xls,.doc,.docx" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="label">Additional notes</label>
            <textarea className="input resize-none" rows={3}
              placeholder="Any additional information about your company or offerings..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center py-2.5">
            Submit registration
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your information is secure and will only be used for procurement purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
