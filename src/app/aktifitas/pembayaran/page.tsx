"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HandCoins,
  Plus,
  Trash2,
  Eye,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableColumn } from "@/components/ui/data-table";
import { InvoiceSearchModal } from "./InvoiceSearchModal";

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

type InvoiceGroup = {
  invoiceNo: string;
  totalMutasi: number;
  totalInvoice: number;
  totalTerbayar: number;
  totalTerhutang: number;
  mutasiIds: number[];
  mutasiList: Mutasi[];
};

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

export default function PembayaranPage() {
  const router = useRouter();
  const [mutasiList, setMutasiList] = useState<Mutasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; invoiceGroup: InvoiceGroup | null }>({
    open: false,
    invoiceGroup: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; invoiceGroup: InvoiceGroup | null }>({
    open: false,
    invoiceGroup: null,
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setMutasiList(initialMockMutasi);
      setLoading(false);
    }, 1000);
  }, []);

  // Transform mutasi data to group by invoice (exclude unallocated)
  const groupedByInvoice = (): InvoiceGroup[] => {
    const invoiceMap = new Map<string, InvoiceGroup>();
    
    // Mock invoice totals - in real app, this would come from invoice data
    const mockInvoiceTotals: Record<string, number> = {
      "INV-2026-001": 115550000,
      "INV-2026-003": 125000000,
      "INV-2026-004": 69540000,
      "INV-2026-007": 45000000,
      "INV-2026-008": 40000000,
      "INV-2026-009": 95000000,
      "INV-2026-010": 120000000,
      "INV-2026-011": 78000000,
      "INV-2026-012": 102000000,
      "INV-2026-013": 156000000,
      "INV-2026-014": 89750000,
      "INV-2026-015": 88000000,
      "INV-2026-016": 110000000,
      "INV-2026-017": 98500000,
      "INV-2026-018": 92000000,
      "INV-2026-019": 73000000,
      "INV-2026-020": 60000000,
    };
    
    mutasiList.forEach((mutasi) => {
      // Skip unallocated mutations
      if (mutasi.allocatedInvoices.length > 0) {
        // Group by each invoice in allocatedInvoices
        mutasi.allocatedInvoices.forEach((allocation) => {
          if (!invoiceMap.has(allocation.invoiceNo)) {
            const invoiceTotal = mockInvoiceTotals[allocation.invoiceNo] || 0;
            invoiceMap.set(allocation.invoiceNo, {
              invoiceNo: allocation.invoiceNo,
              totalMutasi: 0,
              totalInvoice: invoiceTotal,
              totalTerbayar: 0,
              totalTerhutang: invoiceTotal,
              mutasiIds: [],
              mutasiList: [],
            });
          }
          const group = invoiceMap.get(allocation.invoiceNo)!;
          group.totalMutasi += 1;
          group.totalTerbayar += allocation.amount;
          group.totalTerhutang = group.totalInvoice - group.totalTerbayar;
          group.mutasiIds.push(mutasi.id);
          group.mutasiList.push(mutasi);
        });
      }
    });

    return Array.from(invoiceMap.values());
  };

  const invoiceGroups = groupedByInvoice();

  const handleDelete = (invoiceGroup: InvoiceGroup) => {
    setDeleteDialog({ open: true, invoiceGroup });
  };

  const confirmDelete = () => {
    if (deleteDialog.invoiceGroup) {
      // Delete all mutations related to this invoice group
      setMutasiList((prev) =>
        prev.filter((m) => !deleteDialog.invoiceGroup!.mutasiIds.includes(m.id))
      );
      setDeleteDialog({ open: false, invoiceGroup: null });
    }
  };

  const handleView = (invoiceGroup: InvoiceGroup) => {
    setViewDialog({ open: true, invoiceGroup });
  };

  const handleSelectInvoice = (invoice: { id: number; nomor: string; total: number; agenName: string; status: string }) => {
    // Navigate to create payment page with invoice data as query params
    router.push(`/aktifitas/pembayaran/buat?invoiceId=${invoice.id}&invoiceNumber=${invoice.nomor}&total=${invoice.total}`);
  };

  const columns: DataTableColumn<InvoiceGroup>[] = [
    {
      id: "invoiceNo",
      accessorKey: "invoiceNo",
      header: "Nomor Invoice",
      cell: (row) => (
        <div className="font-mono text-sm font-semibold">
          {row.invoiceNo}
        </div>
      ),
    },
    {
      id: "totalInvoice",
      accessorKey: "totalInvoice",
      header: "Total Invoice",
      cell: (row) => (
        <div className="font-semibold">
          {formatCurrency(row.totalInvoice)}
        </div>
      ),
    },
    {
      id: "totalTerbayar",
      accessorKey: "totalTerbayar",
      header: "Terbayar",
      cell: (row) => (
        <div className="font-semibold text-green-600">
          {formatCurrency(row.totalTerbayar)}
        </div>
      ),
    },
    {
      id: "totalTerhutang",
      accessorKey: "totalTerhutang",
      header: "Terhutang",
      cell: (row) => (
        <div className="font-semibold text-orange-600">
          {formatCurrency(row.totalTerhutang)}
        </div>
      ),
    },
    {
      id: "totalMutasi",
      accessorKey: "totalMutasi",
      header: "Total Mutasi",
      cell: (row) => (
        <Badge variant="outline">
          {row.totalMutasi} mutasi
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(row)}
              title="Lihat Detail"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(row)}
              title="Hapus"
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HandCoins className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Pembayaran</h1>
            <p className="text-muted-foreground">
              Kelola transaksi pembayaran dan mutasi
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="gap-2 relative z-50"
        >
          <Plus className="h-4 w-4" />
          Buat Pembayaran
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Invoice</CardDescription>
            <CardTitle className="text-2xl">{invoiceGroups.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Terbayar</CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(mutasiList.reduce((sum, m) => sum + m.amount, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Terhutang</CardDescription>
            <CardTitle className="text-2xl text-orange-600">
              {formatCurrency(0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pembayaran Teralokasi</CardDescription>
            <CardTitle className="text-2xl">
              {mutasiList.filter((m) => m.allocatedInvoices.length > 0).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pembayaran</CardTitle>
          <CardDescription>
            Lihat dan kelola semua transaksi pembayaran ({mutasiList.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invoiceGroups}
          />
        </CardContent>
      </Card>

      {/* Invoice Search Modal */}
      <InvoiceSearchModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSelectInvoice={handleSelectInvoice}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, invoiceGroup: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus semua pembayaran untuk invoice{" "}
              <span className="font-semibold font-mono">{deleteDialog.invoiceGroup?.invoiceNo}</span>?
              {deleteDialog.invoiceGroup && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
                  Peringatan: Ini akan menghapus {deleteDialog.invoiceGroup.totalMutasi} mutasi
                  dengan total terbayar {formatCurrency(deleteDialog.invoiceGroup.totalTerbayar)}.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, invoiceGroup: null })}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, invoiceGroup: null })}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HandCoins className="h-5 w-5" />
              Detail Grup Invoice
            </DialogTitle>
          </DialogHeader>
          {viewDialog.invoiceGroup && (
            <div className="space-y-4">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Nomor Invoice</Label>
                  <p className="font-mono font-semibold text-lg">
                    {viewDialog.invoiceGroup.invoiceNo}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Mutasi</Label>
                  <p className="text-xl font-bold">
                    {viewDialog.invoiceGroup.totalMutasi}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Total Terbayar</Label>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(viewDialog.invoiceGroup.totalTerbayar)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Terhutang</Label>
                  <p className="text-xl font-bold text-orange-600">
                    {formatCurrency(viewDialog.invoiceGroup.totalTerhutang)}
                  </p>
                </div>
              </div>

              {/* Mutations List */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Mutasi ({viewDialog.invoiceGroup.mutasiList.length})
                </h3>
                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                  {viewDialog.invoiceGroup.mutasiList.map((mutasi) => (
                    <div key={mutasi.id} className="p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-mono text-sm text-muted-foreground">
                            {mutasi.reff}
                          </p>
                          <p className="text-sm mt-1">{mutasi.deskripsi}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-semibold text-green-600">
                            {formatCurrency(mutasi.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDateTime(mutasi.timestamp)}
                          </p>
                        </div>
                      </div>
                      {mutasi.allocatedInvoices.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          Dialokasikan ke: {mutasi.allocatedInvoices.map(a => a.invoiceNo).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, invoiceGroup: null })}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}