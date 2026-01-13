"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
type TransactionType = "PENGELUARAN" | "PEMASUKAN";

type BatchTransaction = {
  id: number;
  batchId: number;
  batchNomor: string;
  tipe: TransactionType;
  namaTransaksi: string;
  nominal: number;
  deskripsi: string;
  fileId: number | null;
  mutasiId: number | null;
  [key: string]: unknown;
};

interface BatchFlight {
  id: number;
  nomor: string;
}

// Validation Schema
const transactionFormSchema = z.object({
  batchId: z.number({ required_error: "Batch flight harus dipilih" }).min(1, "Batch flight harus dipilih"),
  tipe: z.enum(["PENGELUARAN", "PEMASUKAN"], {
    required_error: "Tipe transaksi harus dipilih",
  }),
  namaTransaksi: z.string().min(3, "Nama transaksi minimal 3 karakter"),
  nominal: z.number().min(1, "Nominal harus lebih dari 0"),
  deskripsi: z.string().min(3, "Deskripsi minimal 3 karakter"),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

// Mockup Batch Flights
const mockBatchFlights: BatchFlight[] = [
  { id: 1, nomor: "BATCH-001" },
  { id: 2, nomor: "BATCH-002" },
  { id: 3, nomor: "BATCH-003" },
  { id: 4, nomor: "BATCH-004" },
  { id: 5, nomor: "BATCH-005" },
  { id: 6, nomor: "BATCH-006" },
  { id: 7, nomor: "BATCH-007" },
  { id: 8, nomor: "BATCH-008" },
  { id: 9, nomor: "BATCH-009" },
  { id: 10, nomor: "BATCH-010" },
];

// Mockup Data - 20-30 expenses
const initialMockTransactions: BatchTransaction[] = [
  {
    id: 1,
    batchId: 1,
    batchNomor: "BATCH-001",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Booking Makkah",
    nominal: 45000000,
    deskripsi: "Hotel booking untuk 45 jemaah, 5 malam di Makkah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 2,
    batchId: 1,
    batchNomor: "BATCH-001",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Booking Madinah",
    nominal: 38000000,
    deskripsi: "Hotel booking untuk 45 jemaah, 4 malam di Madinah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 3,
    batchId: 1,
    batchNomor: "BATCH-001",
    tipe: "PENGELUARAN",
    namaTransaksi: "Transport Bus Saudi",
    nominal: 25000000,
    deskripsi: "Bus transportation selama di Saudi Arabia",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 4,
    batchId: 1,
    batchNomor: "BATCH-001",
    tipe: "PENGELUARAN",
    namaTransaksi: "Konsumsi & Catering",
    nominal: 17000000,
    deskripsi: "Biaya makan selama perjalanan umroh",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 5,
    batchId: 2,
    batchNomor: "BATCH-002",
    tipe: "PENGELUARAN",
    namaTransaksi: "Visa Processing",
    nominal: 22500000,
    deskripsi: "Pengurusan visa umroh untuk 30 jemaah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 6,
    batchId: 2,
    batchNomor: "BATCH-002",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Makkah Premium",
    nominal: 52000000,
    deskripsi: "Hotel bintang 5 dekat Masjidil Haram",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 7,
    batchId: 2,
    batchNomor: "BATCH-002",
    tipe: "PENGELUARAN",
    namaTransaksi: "Ziarah Package",
    nominal: 10500000,
    deskripsi: "Paket ziarah ke tempat-tempat bersejarah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 8,
    batchId: 3,
    batchNomor: "BATCH-003",
    tipe: "PENGELUARAN",
    namaTransaksi: "Airport Transfer Jakarta",
    nominal: 8000000,
    deskripsi: "Transport dari Jakarta ke bandara CGK",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 9,
    batchId: 3,
    batchNomor: "BATCH-003",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Transit Jeddah",
    nominal: 15000000,
    deskripsi: "Hotel transit 1 malam di Jeddah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 10,
    batchId: 3,
    batchNomor: "BATCH-003",
    tipe: "PEMASUKAN",
    namaTransaksi: "Additional Payment from Agent",
    nominal: 12000000,
    deskripsi: "Pembayaran tambahan untuk upgrade hotel",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 11,
    batchId: 3,
    batchNomor: "BATCH-003",
    tipe: "PENGELUARAN",
    namaTransaksi: "Manasik Training",
    nominal: 5500000,
    deskripsi: "Biaya pelatihan manasik sebelum keberangkatan",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 12,
    batchId: 4,
    batchNomor: "BATCH-004",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Madinah Budget",
    nominal: 28000000,
    deskripsi: "Hotel kelas ekonomi 3 malam Madinah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 13,
    batchId: 4,
    batchNomor: "BATCH-004",
    tipe: "PENGELUARAN",
    namaTransaksi: "Medical Kit & Supplies",
    nominal: 3500000,
    deskripsi: "Perlengkapan medis dan obat-obatan",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 14,
    batchId: 4,
    batchNomor: "BATCH-004",
    tipe: "PENGELUARAN",
    namaTransaksi: "Tour Guide Services",
    nominal: 9000000,
    deskripsi: "Jasa tour guide berbahasa Indonesia",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 15,
    batchId: 5,
    batchNomor: "BATCH-005",
    tipe: "PENGELUARAN",
    namaTransaksi: "Ticket Handling Fee",
    nominal: 6500000,
    deskripsi: "Biaya handling tiket pesawat",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 16,
    batchId: 5,
    batchNomor: "BATCH-005",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Makkah Standard",
    nominal: 68000000,
    deskripsi: "Hotel standard untuk 68 jemaah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 17,
    batchId: 5,
    batchNomor: "BATCH-005",
    tipe: "PENGELUARAN",
    namaTransaksi: "Laundry Services",
    nominal: 4200000,
    deskripsi: "Layanan laundry selama di Saudi",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 18,
    batchId: 5,
    batchNomor: "BATCH-005",
    tipe: "PEMASUKAN",
    namaTransaksi: "Hotel Discount",
    nominal: 8000000,
    deskripsi: "Discount dari hotel untuk group booking",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 19,
    batchId: 6,
    batchNomor: "BATCH-006",
    tipe: "PENGELUARAN",
    namaTransaksi: "Travel Insurance",
    nominal: 7500000,
    deskripsi: "Asuransi perjalanan untuk semua jemaah",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 20,
    batchId: 6,
    batchNomor: "BATCH-006",
    tipe: "PENGELUARAN",
    namaTransaksi: "Umroh Uniform Package",
    nominal: 11000000,
    deskripsi: "Seragam dan perlengkapan umroh",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 21,
    batchId: 6,
    batchNomor: "BATCH-006",
    tipe: "PENGELUARAN",
    namaTransaksi: "Airport Tax & Services",
    nominal: 5800000,
    deskripsi: "Pajak bandara dan biaya layanan",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 22,
    batchId: 7,
    batchNomor: "BATCH-007",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Booking Makkah VIP",
    nominal: 85000000,
    deskripsi: "Hotel VIP dekat dengan Masjidil Haram",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 23,
    batchId: 7,
    batchNomor: "BATCH-007",
    tipe: "PENGELUARAN",
    namaTransaksi: "Private Transport",
    nominal: 32000000,
    deskripsi: "Transport khusus dengan kendaraan VIP",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 24,
    batchId: 7,
    batchNomor: "BATCH-007",
    tipe: "PENGELUARAN",
    namaTransaksi: "Special Meals Package",
    nominal: 18000000,
    deskripsi: "Paket makanan khusus buffet premium",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 25,
    batchId: 8,
    batchNomor: "BATCH-008",
    tipe: "PENGELUARAN",
    namaTransaksi: "Baggage Handling",
    nominal: 4500000,
    deskripsi: "Biaya handling bagasi extra",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 26,
    batchId: 8,
    batchNomor: "BATCH-008",
    tipe: "PENGELUARAN",
    namaTransaksi: "Hotel Madinah Premium",
    nominal: 42000000,
    deskripsi: "Hotel dekat Masjid Nabawi",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 27,
    batchId: 8,
    batchNomor: "BATCH-008",
    tipe: "PEMASUKAN",
    namaTransaksi: "Refund Unused Services",
    nominal: 5500000,
    deskripsi: "Refund untuk layanan yang tidak terpakai",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 28,
    batchId: 9,
    batchNomor: "BATCH-009",
    tipe: "PENGELUARAN",
    namaTransaksi: "Documentation & Photography",
    nominal: 6000000,
    deskripsi: "Dokumentasi perjalanan umroh",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 29,
    batchId: 9,
    batchNomor: "BATCH-009",
    tipe: "PENGELUARAN",
    namaTransaksi: "Emergency Fund",
    nominal: 10000000,
    deskripsi: "Dana darurat untuk keperluan tidak terduga",
    fileId: null,
    mutasiId: null,
  },
  {
    id: 30,
    batchId: 10,
    batchNomor: "BATCH-010",
    tipe: "PENGELUARAN",
    namaTransaksi: "Coordination & Management",
    nominal: 12000000,
    deskripsi: "Biaya koordinasi dan management batch",
    fileId: null,
    mutasiId: null,
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

export default function PengeluaranPage() {
  const [transactions, setTransactions] = useState<BatchTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<BatchTransaction | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; transaction: BatchTransaction | null }>({
    open: false,
    transaction: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; transaction: BatchTransaction | null }>({
    open: false,
    transaction: null,
  });
  const [filterBatch, setFilterBatch] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      batchId: 0,
      tipe: "PENGELUARAN",
      namaTransaksi: "",
      nominal: 0,
      deskripsi: "",
    },
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setTransactions(initialMockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const onSubmit = (data: TransactionFormValues) => {
    const batch = mockBatchFlights.find((b) => b.id === data.batchId);

    if (editingTransaction) {
      // Update existing transaction
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === editingTransaction.id
            ? {
                ...transaction,
                ...data,
                batchNomor: batch?.nomor || "",
              }
            : transaction
        )
      );
      setEditingTransaction(null);
    } else {
      // Create new transaction
      const newTransaction: BatchTransaction = {
        id: Math.max(...transactions.map((t) => t.id), 0) + 1,
        ...data,
        batchNomor: batch?.nomor || "",
        fileId: null,
        mutasiId: null,
      };
      setTransactions((prev) => [newTransaction, ...prev]);
    }

    // Reset form
    form.reset({
      batchId: 0,
      tipe: "PENGELUARAN",
      namaTransaksi: "",
      nominal: 0,
      deskripsi: "",
    });
  };

  const handleEdit = (transaction: BatchTransaction) => {
    setEditingTransaction(transaction);
    form.reset({
      batchId: transaction.batchId,
      tipe: transaction.tipe,
      namaTransaksi: transaction.namaTransaksi,
      nominal: transaction.nominal,
      deskripsi: transaction.deskripsi,
    });
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    form.reset({
      batchId: 0,
      tipe: "PENGELUARAN",
      namaTransaksi: "",
      nominal: 0,
      deskripsi: "",
    });
  };

  const handleDelete = (transaction: BatchTransaction) => {
    setDeleteDialog({ open: true, transaction });
  };

  const confirmDelete = () => {
    if (deleteDialog.transaction) {
      setTransactions((prev) => prev.filter((t) => t.id !== deleteDialog.transaction!.id));
      setDeleteDialog({ open: false, transaction: null });
    }
  };

  const handleView = (transaction: BatchTransaction) => {
    setViewDialog({ open: true, transaction });
  };

  const getTypeBadge = (tipe: TransactionType) => {
    if (tipe === "PENGELUARAN") {
      return {
        variant: "destructive" as const,
        icon: <TrendingDown className="h-3 w-3" />,
      };
    }
    return {
      variant: "default" as const,
      icon: <TrendingUp className="h-3 w-3" />,
      className: "bg-green-500 hover:bg-green-600",
    };
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((t) => {
    if (filterBatch !== "all" && t.batchNomor !== filterBatch) return false;
    if (filterType !== "all" && t.tipe !== filterType) return false;
    return true;
  });

  const columns: DataTableColumn<BatchTransaction>[] = [
    {
      id: "batchNomor",
      accessorKey: "batchNomor",
      header: "Batch Flight",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{row.batchNomor}</span>
        </div>
      ),
    },
    {
      id: "tipe",
      accessorKey: "tipe",
      header: "Tipe",
      cell: (row) => {
        const tipe = row.tipe as TransactionType;
        const badge = getTypeBadge(tipe);
        return (
          <Badge variant={badge.variant} className={badge.className}>
            <span className="flex items-center gap-1">
              {badge.icon}
              {tipe}
            </span>
          </Badge>
        );
      },
    },
    {
      id: "namaTransaksi",
      accessorKey: "namaTransaksi",
      header: "Nama Transaksi",
      cell: (row) => (
        <div className="max-w-xs truncate">{row.namaTransaksi}</div>
      ),
    },
    {
      id: "nominal",
      accessorKey: "nominal",
      header: "Nominal",
      cell: (row) => {
        const tipe = row.tipe as TransactionType;
        return (
          <div className={`font-semibold ${tipe === "PENGELUARAN" ? "text-red-600" : "text-green-600"}`}>
            {tipe === "PENGELUARAN" ? "-" : "+"}
            {formatCurrency(row.nominal)}
          </div>
        );
      },
    },
    {
      id: "deskripsi",
      accessorKey: "deskripsi",
      header: "Deskripsi",
      cell: (row) => (
        <div className="max-w-md truncate text-sm text-muted-foreground">
          {row.deskripsi}
        </div>
      ),
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

  // Calculate statistics
  const totalPengeluaran = filteredTransactions
    .filter((t) => t.tipe === "PENGELUARAN")
    .reduce((sum, t) => sum + t.nominal, 0);
  const totalPemasukan = filteredTransactions
    .filter((t) => t.tipe === "PEMASUKAN")
    .reduce((sum, t) => sum + t.nominal, 0);
  const netAmount = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <DollarSign className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Pengeluaran</h1>
          <p className="text-muted-foreground">
            Manage batch flight expenses and income
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
                {editingTransaction ? "Edit Transaction" : "Create New Transaction"}
              </CardTitle>
              <CardDescription>
                {editingTransaction
                  ? "Update transaction details"
                  : "Fill in the form to record a new transaction"}
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
                {/* Row 1: Batch Flight, Tipe */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="batchId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Flight</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih batch flight" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockBatchFlights.map((batch) => (
                              <SelectItem key={batch.id} value={batch.id.toString()}>
                                {batch.nomor}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe Transaksi</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENGELUARAN">PENGELUARAN</SelectItem>
                            <SelectItem value="PEMASUKAN">PEMASUKAN</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Nama Transaksi, Nominal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="namaTransaksi"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Transaksi</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Hotel Booking Makkah"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nominal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nominal (IDR)</FormLabel>
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
                </div>

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
                          placeholder="Describe the transaction details..."
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
                    {editingTransaction ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Update Transaction
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Transaction
                      </>
                    )}
                  </Button>
                  {editingTransaction && (
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Transactions</CardDescription>
            <CardTitle className="text-2xl">{filteredTransactions.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Pengeluaran</CardDescription>
            <CardTitle className="text-xl text-red-600">
              {formatCurrency(totalPengeluaran)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Pemasukan</CardDescription>
            <CardTitle className="text-xl text-green-600">
              {formatCurrency(totalPemasukan)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Net Amount</CardDescription>
            <CardTitle className={`text-xl ${netAmount >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(Math.abs(netAmount))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Filter by Batch Flight</Label>
              <Select value={filterBatch} onValueChange={setFilterBatch}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {mockBatchFlights.map((batch) => (
                    <SelectItem key={batch.id} value={batch.nomor}>
                      {batch.nomor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Filter by Type</Label>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="PENGELUARAN">PENGELUARAN</SelectItem>
                  <SelectItem value="PEMASUKAN">PEMASUKAN</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction List</CardTitle>
          <CardDescription>
            View and manage all batch transactions ({filteredTransactions.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredTransactions}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, transaction: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete transaction{" "}
              <span className="font-semibold">{deleteDialog.transaction?.namaTransaksi}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, transaction: null })}
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
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, transaction: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Transaction Details
            </DialogTitle>
          </DialogHeader>
          {viewDialog.transaction && (
            <div className="space-y-4">
              {/* Transaction Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Batch Flight</Label>
                  <p className="font-semibold">{viewDialog.transaction.batchNomor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Transaction Type</Label>
                  <div className="mt-1">
                    <Badge
                      variant={getTypeBadge(viewDialog.transaction.tipe).variant}
                      className={getTypeBadge(viewDialog.transaction.tipe).className}
                    >
                      <span className="flex items-center gap-1">
                        {getTypeBadge(viewDialog.transaction.tipe).icon}
                        {viewDialog.transaction.tipe}
                      </span>
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Transaction Name</Label>
                  <p className="font-semibold text-lg">{viewDialog.transaction.namaTransaksi}</p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className={`text-2xl font-bold ${viewDialog.transaction.tipe === "PENGELUARAN" ? "text-red-600" : "text-green-600"}`}>
                    {viewDialog.transaction.tipe === "PENGELUARAN" ? "-" : "+"}
                    {formatCurrency(viewDialog.transaction.nominal)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1 p-3 bg-muted/30 rounded-lg">
                  {viewDialog.transaction.deskripsi}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, transaction: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}