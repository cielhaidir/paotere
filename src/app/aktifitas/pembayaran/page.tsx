"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  HandCoins,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
type Mutasi = {
  id: number;
  timestamp: Date;
  deskripsi: string;
  reff: string;
  amount: number;
  allocatedInvoices: Array<{ invoiceNo: string; amount: number }>;
  [key: string]: unknown;
};

// Validation Schema
const mutasiFormSchema = z.object({
  timestamp: z.date({ required_error: "Timestamp harus diisi" }),
  deskripsi: z.string().min(3, "Deskripsi minimal 3 karakter"),
  reff: z.string().min(3, "Reference number minimal 3 karakter"),
  amount: z.number().min(1, "Amount harus lebih dari 0"),
});

type MutasiFormValues = z.infer<typeof mutasiFormSchema>;

// Mockup Data - 15-20 payment entries
const initialMockMutasi: Mutasi[] = [
  {
    id: 1,
    timestamp: new Date("2026-01-05T10:30:00"),
    deskripsi: "Pembayaran Invoice INV-2026-001 - PT Berkah Umroh Indonesia",
    reff: "TRF20260105001",
    amount: 115550000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-001", amount: 115550000 }],
  },
  {
    id: 2,
    timestamp: new Date("2026-01-08T14:15:00"),
    deskripsi: "Pembayaran Partial Invoice INV-2026-003 - PT Nusantara Travel",
    reff: "TRF20260108001",
    amount: 40000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-003", amount: 40000000 }],
  },
  {
    id: 3,
    timestamp: new Date("2026-01-10T09:45:00"),
    deskripsi: "Pembayaran Invoice INV-2026-004 - CV Makkah Express",
    reff: "TRF20260110001",
    amount: 69540000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-004", amount: 69540000 }],
  },
  {
    id: 4,
    timestamp: new Date("2026-01-12T11:20:00"),
    deskripsi: "Top Up Modal Operasional",
    reff: "TRF20260112001",
    amount: 50000000,
    allocatedInvoices: [],
  },
  {
    id: 5,
    timestamp: new Date("2026-01-15T16:30:00"),
    deskripsi: "Pembayaran Paket Umroh - Multiple Agents",
    reff: "TRF20260115001",
    amount: 85000000,
    allocatedInvoices: [
      { invoiceNo: "INV-2026-007", amount: 45000000 },
      { invoiceNo: "INV-2026-008", amount: 40000000 },
    ],
  },
  {
    id: 6,
    timestamp: new Date("2026-01-18T13:45:00"),
    deskripsi: "Pembayaran Invoice INV-2026-009 - PT Madinah Journey",
    reff: "TRF20260118001",
    amount: 95000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-009", amount: 95000000 }],
  },
  {
    id: 7,
    timestamp: new Date("2026-01-20T10:00:00"),
    deskripsi: "Penerimaan Down Payment Jemaah Group A",
    reff: "TRF20260120001",
    amount: 120000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-010", amount: 120000000 }],
  },
  {
    id: 8,
    timestamp: new Date("2026-01-22T15:20:00"),
    deskripsi: "Pembayaran Invoice INV-2026-011 - CV Rahmat Haji Tour",
    reff: "TRF20260122001",
    amount: 78000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-011", amount: 78000000 }],
  },
  {
    id: 9,
    timestamp: new Date("2026-01-25T09:30:00"),
    deskripsi: "Transfer Modal Awal Batch Flight BATCH-005",
    reff: "TRF20260125001",
    amount: 35000000,
    allocatedInvoices: [],
  },
  {
    id: 10,
    timestamp: new Date("2026-01-27T14:45:00"),
    deskripsi: "Pembayaran Pelunasan Invoice INV-2026-012",
    reff: "TRF20260127001",
    amount: 102000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-012", amount: 102000000 }],
  },
  {
    id: 11,
    timestamp: new Date("2026-01-28T11:15:00"),
    deskripsi: "Penerimaan Cicilan Pertama - Multiple Invoices",
    reff: "TRF20260128001",
    amount: 65000000,
    allocatedInvoices: [
      { invoiceNo: "INV-2026-013", amount: 35000000 },
      { invoiceNo: "INV-2026-014", amount: 30000000 },
    ],
  },
  {
    id: 12,
    timestamp: new Date("2026-01-30T16:00:00"),
    deskripsi: "Pembayaran Invoice INV-2026-015 - PT Berkah Umroh Indonesia",
    reff: "TRF20260130001",
    amount: 88000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-015", amount: 88000000 }],
  },
  {
    id: 13,
    timestamp: new Date("2026-02-01T10:30:00"),
    deskripsi: "Top Up Operasional Februari",
    reff: "TRF20260201001",
    amount: 75000000,
    allocatedInvoices: [],
  },
  {
    id: 14,
    timestamp: new Date("2026-02-03T13:20:00"),
    deskripsi: "Pembayaran Group Booking Invoice INV-2026-016",
    reff: "TRF20260203001",
    amount: 110000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-016", amount: 110000000 }],
  },
  {
    id: 15,
    timestamp: new Date("2026-02-05T15:45:00"),
    deskripsi: "Penerimaan Partial Payment INV-2026-017",
    reff: "TRF20260205001",
    amount: 45000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-017", amount: 45000000 }],
  },
  {
    id: 16,
    timestamp: new Date("2026-02-07T09:00:00"),
    deskripsi: "Pembayaran Invoice INV-2026-018 - PT Nusantara Travel",
    reff: "TRF20260207001",
    amount: 92000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-018", amount: 92000000 }],
  },
  {
    id: 17,
    timestamp: new Date("2026-02-09T14:30:00"),
    deskripsi: "Transfer Modal Batch Flight BATCH-006",
    reff: "TRF20260209001",
    amount: 60000000,
    allocatedInvoices: [],
  },
  {
    id: 18,
    timestamp: new Date("2026-02-10T11:45:00"),
    deskripsi: "Pembayaran Cicilan Kedua Multiple Agents",
    reff: "TRF20260210001",
    amount: 73000000,
    allocatedInvoices: [
      { invoiceNo: "INV-2026-019", amount: 38000000 },
      { invoiceNo: "INV-2026-020", amount: 35000000 },
    ],
  },
];

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const generateReferenceNumber = (existingMutasi: Mutasi[]): string => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]?.replace(/-/g, "") ?? "";
  const todayMutasi = existingMutasi.filter((m) =>
    m.reff.startsWith(`TRF${dateStr}`)
  );
  const nextNumber = todayMutasi.length + 1;
  return `TRF${dateStr}${String(nextNumber).padStart(3, "0")}`;
};

export default function PembayaranPage() {
  const [mutasiList, setMutasiList] = useState<Mutasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingMutasi, setEditingMutasi] = useState<Mutasi | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; mutasi: Mutasi | null }>({
    open: false,
    mutasi: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; mutasi: Mutasi | null }>({
    open: false,
    mutasi: null,
  });

  const form = useForm<MutasiFormValues>({
    resolver: zodResolver(mutasiFormSchema),
    defaultValues: {
      timestamp: new Date(),
      deskripsi: "",
      reff: "",
      amount: 0,
    },
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setMutasiList(initialMockMutasi);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-generate reference number
  useEffect(() => {
    if (!editingMutasi && mutasiList.length > 0) {
      const suggestedReff = generateReferenceNumber(mutasiList);
      form.setValue("reff", suggestedReff);
    }
  }, [mutasiList, editingMutasi, form]);

  const onSubmit = (data: MutasiFormValues) => {
    if (editingMutasi) {
      // Update existing mutasi
      setMutasiList((prev) =>
        prev.map((mutasi) =>
          mutasi.id === editingMutasi.id
            ? {
                ...mutasi,
                ...data,
              }
            : mutasi
        )
      );
      setEditingMutasi(null);
    } else {
      // Create new mutasi
      const newMutasi: Mutasi = {
        id: Math.max(...mutasiList.map((m) => m.id), 0) + 1,
        ...data,
        allocatedInvoices: [],
      };
      setMutasiList((prev) => [newMutasi, ...prev]);
    }

    // Reset form
    form.reset({
      timestamp: new Date(),
      deskripsi: "",
      reff: generateReferenceNumber(mutasiList),
      amount: 0,
    });
  };

  const handleEdit = (mutasi: Mutasi) => {
    setEditingMutasi(mutasi);
    form.reset({
      timestamp: mutasi.timestamp,
      deskripsi: mutasi.deskripsi,
      reff: mutasi.reff,
      amount: mutasi.amount,
    });
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingMutasi(null);
    form.reset({
      timestamp: new Date(),
      deskripsi: "",
      reff: generateReferenceNumber(mutasiList),
      amount: 0,
    });
  };

  const handleDelete = (mutasi: Mutasi) => {
    setDeleteDialog({ open: true, mutasi });
  };

  const confirmDelete = () => {
    if (deleteDialog.mutasi) {
      setMutasiList((prev) => prev.filter((m) => m.id !== deleteDialog.mutasi!.id));
      setDeleteDialog({ open: false, mutasi: null });
    }
  };

  const handleView = (mutasi: Mutasi) => {
    setViewDialog({ open: true, mutasi });
  };

  const columns: DataTableColumn<Mutasi>[] = [
    {
      id: "timestamp",
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (row) => formatDateTime(row.timestamp),
    },
    {
      id: "reff",
      accessorKey: "reff",
      header: "Reference",
      cell: (row) => (
        <div className="font-mono text-sm">{row.reff}</div>
      ),
    },
    {
      id: "deskripsi",
      accessorKey: "deskripsi",
      header: "Deskripsi",
      cell: (row) => (
        <div className="max-w-md truncate">{row.deskripsi}</div>
      ),
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Amount",
      cell: (row) => (
        <div className="font-semibold text-green-600">
          {formatCurrency(row.amount)}
        </div>
      ),
    },
    {
      id: "allocations",
      header: "Allocations",
      cell: (row) => {
        return (
          <div>
            {row.allocatedInvoices.length > 0 ? (
              <Badge variant="outline">
                {row.allocatedInvoices.length} invoice(s)
              </Badge>
            ) : (
              <Badge variant="secondary">Unallocated</Badge>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(row)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(row)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <HandCoins className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Pembayaran</h1>
          <p className="text-muted-foreground">
            Manage payment transactions and mutations
          </p>
        </div>
      </div>

      {/* Create/Edit Form */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {editingMutasi ? "Edit Payment" : "Create New Payment"}
              </CardTitle>
              <CardDescription>
                {editingMutasi
                  ? "Update payment transaction details"
                  : "Fill in the form to record a new payment"}
              </CardDescription>
            </div>
            {isFormOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {isFormOpen && (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Row 1: Timestamp, Reference */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="timestamp"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Timestamp</FormLabel>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reff"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="TRF20260112001"
                            className="font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (IDR)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="50000000"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Row 3: Deskripsi */}
                <FormField
                  control={form.control}
                  name="deskripsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the payment transaction..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    {editingMutasi ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Update Payment
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Payment
                      </>
                    )}
                  </Button>
                  {editingMutasi && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        )}
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Payments</CardDescription>
            <CardTitle className="text-2xl">{mutasiList.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Amount</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(mutasiList.reduce((sum, m) => sum + m.amount, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Allocated Payments</CardDescription>
            <CardTitle className="text-2xl">
              {mutasiList.filter((m) => m.allocatedInvoices.length > 0).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment List</CardTitle>
          <CardDescription>
            View and manage all payment transactions ({mutasiList.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mutasiList}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, mutasi: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete payment{" "}
              <span className="font-semibold font-mono">{deleteDialog.mutasi?.reff}</span>?
              {deleteDialog.mutasi && deleteDialog.mutasi.allocatedInvoices.length > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
                  Warning: This payment is allocated to {deleteDialog.mutasi.allocatedInvoices.length} invoice(s).
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, mutasi: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, mutasi: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5" />
              Payment Details
            </DialogTitle>
          </DialogHeader>
          {viewDialog.mutasi && (
            <div className="space-y-4">
              {/* Payment Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Reference Number</Label>
                  <p className="font-mono font-semibold">{viewDialog.mutasi.reff}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Timestamp</Label>
                  <p>{formatDateTime(viewDialog.mutasi.timestamp)}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(viewDialog.mutasi.amount)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1 p-3 bg-muted/30 rounded-lg">
                  {viewDialog.mutasi.deskripsi}
                </p>
              </div>

              {/* Invoice Allocations */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Invoice Allocations ({viewDialog.mutasi.allocatedInvoices.length})
                </h3>
                {viewDialog.mutasi.allocatedInvoices.length > 0 ? (
                  <div className="border rounded-lg divide-y">
                    {viewDialog.mutasi.allocatedInvoices.map((allocation, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3"
                      >
                        <span className="font-mono text-sm">
                          {allocation.invoiceNo}
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(allocation.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground border rounded-lg">
                    No invoice allocations yet
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, mutasi: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}