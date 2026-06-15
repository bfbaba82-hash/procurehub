// types/database.ts
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type POStatus = "draft" | "pending" | "under_review" | "approved" | "rejected" | "completed";
export type VendorStatus = "active" | "inactive" | "pending_review" | "blacklisted";
export type UserRole = "admin" | "procurement_officer" | "approver" | "viewer";
export type SubmissionStatus = "pending" | "verifying" | "approved" | "rejected";

export interface Profile {
  id: string;
  full_name: string;
  department: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  cr_number: string | null;
  vat_number: string | null;
  rating: number;
  status: VendorStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrder {
  id: string;
  po_number: string;
  vendor_id: string | null;
  requested_by: string | null;
  department: string;
  status: POStatus;
  required_by: string | null;
  budget_line: string | null;
  justification: string | null;
  total_amount: number;
  currency: string;
  attachments: Json[];
  current_approver: string | null;
  created_at: string;
  updated_at: string;
  // joined
  vendor?: Vendor;
  requester?: Profile;
}

export interface POLineItem {
  id: string;
  po_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  unit: string;
  created_at: string;
}

export interface InventoryItem {
  id: string;
  sku: string | null;
  name: string;
  category: string | null;
  unit: string;
  quantity_in_stock: number;
  reorder_point: number;
  unit_cost: number | null;
  location: string | null;
  vendor_id: string | null;
  last_restocked_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  department: string;
  fiscal_year: number;
  allocated_amount: number;
  spent_amount: number;
  committed_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface SupplierPortalToken {
  id: string;
  token: string;
  label: string | null;
  created_by: string | null;
  expires_at: string | null;
  used_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface SupplierSubmission {
  id: string;
  token_id: string | null;
  supplier_name: string;
  supplier_email: string;
  supplier_phone: string | null;
  cr_number: string | null;
  vat_number: string | null;
  category: string | null;
  price_list: Json[];
  documents: Json[];
  notes: string | null;
  status: SubmissionStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

// Re-export as Database type for Supabase client
export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      vendors: { Row: Vendor; Insert: Partial<Vendor>; Update: Partial<Vendor> };
      purchase_orders: { Row: PurchaseOrder; Insert: Partial<PurchaseOrder>; Update: Partial<PurchaseOrder> };
      po_line_items: { Row: POLineItem; Insert: Partial<POLineItem>; Update: Partial<POLineItem> };
      inventory_items: { Row: InventoryItem; Insert: Partial<InventoryItem>; Update: Partial<InventoryItem> };
      budgets: { Row: Budget; Insert: Partial<Budget>; Update: Partial<Budget> };
      supplier_portal_tokens: { Row: SupplierPortalToken; Insert: Partial<SupplierPortalToken>; Update: Partial<SupplierPortalToken> };
      supplier_submissions: { Row: SupplierSubmission; Insert: Partial<SupplierSubmission>; Update: Partial<SupplierSubmission> };
    };
  };
};
