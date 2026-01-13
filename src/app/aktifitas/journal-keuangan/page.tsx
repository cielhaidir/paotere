"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  TrendingDown,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
type TransactionType = "PENGELUARAN" | "PEMASUKAN";

interface COA {
  id: number;
  kodeAkun: string;
  namaAkun: string;
}

interface Jurnal {
  id: number;
  jurnalNumber: string;
  namaTransaksi: string;
  tipe: TransactionType;
  coaId: number;
  coaKode: string;
  coaNama: string;
  tanggalTransaksi: Date;
  fileId: number | null;
  nominal: number;
  [key: string]: unknown;
}

// Validation Schema
const jurnalFormSchema = z.object({
  jurnalNumber: z.string().min(5, "Journal number minimal 5 karakter"),
  namaTransaksi: z.string().min(3, "Nama transaksi minimal 3 karakter"),
  tipe: z.enum(["PENGELUARAN", "PEMASUKAN"], {
    required_error: "Tipe transaksi harus dipilih",
  }),
  coaId: z.number({ required_error: "COA harus dipilih" }).min(1, "COA harus dipilih"),
  tanggalTransaksi: z.date({ required_error: "Tanggal transaksi harus diisi" }),
  nominal: z.number().min(1, "Nominal harus lebih dari 0"),
});

type JurnalFormValues = z.infer<typeof jurnalFormSchema>;

// Mockup COA Data
const mockCOA: COA[] = [
  { id: 1, kodeAkun: "1-1000", namaAkun: "Kas" },
  { id: 2, kodeAkun: "1-1100", namaAkun: "Bank BCA" },
  { id: 3, kodeAkun: "1-1200", namaAkun: "Bank Mandiri" },
  { id: 4, kodeAkun: "1-2000", namaAkun: "Piutang Usaha" },
  { id: 5, kodeAkun: "2-1000", namaAkun: "Hutang Usaha" },
  { id: 6, kodeAkun: "4-1000", namaAkun: "Pendapatan Jasa Umroh" },
  { id: 7, kodeAkun: "5-1000", namaAkun: "Beban Hotel" },
  { id: 8, kodeAkun: "5-2000", namaAkun: "Beban Transportasi" },
  { id: 9, kodeAkun: "5-3000", namaAkun: "Beban Konsumsi" },
  { id: 10, kodeAkun: "5-4000", namaAkun: "Beban Operasional" },
];

// Mockup Data - 25-35 journal entries
const initialMockJurnal: Jurnal[] = [
  {
    id: 1,
    jurnalNumber: "JRN-20260105-001",
    namaTransaksi: "Penerimaan Pembayaran Invoice INV-2026-001",
    tipe: "PEMASUKAN",
    coaId: 2,
    coaKode: "1-1100",
    coaNama: "Bank BCA",
    tanggalTransaksi: new Date("2026-01-05"),
    fileId: null,
    nominal: 115550000,
  },
  {
    id: 2,
    jurnalNumber: "JRN-20260105-002",
    namaTransaksi: "Pembayaran Hotel Makkah Batch-001",
    tipe: "PENGELUARAN",
    coaId: 7,
    coaKode: "5-1000",
    coaNama: "Beban Hotel",
    tanggalTransaksi: new Date("2026-01-05"),
    fileId: null,
    nominal: 45000000,
  },
  {
    id: 3,
    jurnalNumber: "JRN-20260106-001",
    namaTransaksi: "Biaya Transport Bus Saudi",
    tipe: "PENGELUARAN",
    coaId: 8,
    coaKode: "5-2000",
    coaNama: "Beban Transportasi",
    tanggalTransaksi: new Date("2026-01-06"),
    fileId: null,
    nominal: 25000000,
  },
  {
    id: 4,
    jurnalNumber: "JRN-20260107-001",
    namaTransaksi: "Penerimaan DP Jemaah Group A",
    tipe: "PEMASUKAN",
    coaId: 3,
    coaKode: "1-1200",
    coaNama: "Bank Mandiri",
    tanggalTransaksi: new Date("2026-01-07"),
    fileId: null,
    nominal: 50000000,
  },
  {
    id: 5,
    jurnalNumber: "JRN-20260108-001",
    namaTransaksi: "Beban Konsumsi Batch-001",
    tipe: "PENGELUARAN",
    coaId: 9,
    coaKode: "5-3000",
    coaNama: "Beban Konsumsi",
    tanggalTransaksi: new Date("2026-01-08"),
    fileId: null,
    nominal: 17000000,
  },
  {
    id: 6,
    jurnalNumber: "JRN-20260110-001",
    namaTransaksi: "Pendapatan Jasa Umroh Januari",
    tipe: "PEMASUKAN",
    coaId: 6,
    coaKode: "4-1000",
    coaNama: "Pendapatan Jasa Umroh",
    tanggalTransaksi: new Date("2026-01-10"),
    fileId: null,
    nominal: 85000000,
  },
  {
    id: 7,
    jurnalNumber: "JRN-20260112-001",
    namaTransaksi: "Pembayaran Hotel Madinah Batch-002",
    tipe: "PENGELUARAN",
    coaId: 7,
    coaKode: "5-1000",
    coaNama: "Beban Hotel",
    tanggalTransaksi: new Date("2026-01-12"),
    fileId: null,
    nominal: 38000000,
  },
  {
    id: 8,
    jurnalNumber: "JRN-20260115-001",
    namaTransaksi: "Beban Operasional Kantor",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-01-15"),
    fileId: null,
    nominal: 12000000,
  },
  {
    id: 9,
    jurnalNumber: "JRN-20260118-001",
    namaTransaksi: "Penerimaan Pelunasan Invoice INV-2026-004",
    tipe: "PEMASUKAN",
    coaId: 2,
    coaKode: "1-1100",
    coaNama: "Bank BCA",
    tanggalTransaksi: new Date("2026-01-18"),
    fileId: null,
    nominal: 69540000,
  },
  {
    id: 10,
    jurnalNumber: "JRN-20260120-001",
    namaTransaksi: "Biaya Visa Processing Batch-003",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-01-20"),
    fileId: null,
    nominal: 22500000,
  },
  {
    id: 11,
    jurnalNumber: "JRN-20260122-001",
    namaTransaksi: "Penerimaan Kas dari Agen",
    tipe: "PEMASUKAN",
    coaId: 1,
    coaKode: "1-1000",
    coaNama: "Kas",
    tanggalTransaksi: new Date("2026-01-22"),
    fileId: null,
    nominal: 35000000,
  },
  {
    id: 12,
    jurnalNumber: "JRN-20260125-001",
    namaTransaksi: "Pembayaran Transport Lokal",
    tipe: "PENGELUARAN",
    coaId: 8,
    coaKode: "5-2000",
    coaNama: "Beban Transportasi",
    tanggalTransaksi: new Date("2026-01-25"),
    fileId: null,
    nominal: 8000000,
  },
  {
    id: 13,
    jurnalNumber: "JRN-20260128-001",
    namaTransaksi: "Pendapatan Jasa Tour Guide",
    tipe: "PEMASUKAN",
    coaId: 6,
    coaKode: "4-1000",
    coaNama: "Pendapatan Jasa Umroh",
    tanggalTransaksi: new Date("2026-01-28"),
    fileId: null,
    nominal: 18000000,
  },
  {
    id: 14,
    jurnalNumber: "JRN-20260130-001",
    namaTransaksi: "Beban Hotel Transit Jeddah",
    tipe: "PENGELUARAN",
    coaId: 7,
    coaKode: "5-1000",
    coaNama: "Beban Hotel",
    tanggalTransaksi: new Date("2026-01-30"),
    fileId: null,
    nominal: 15000000,
  },
  {
    id: 15,
    jurnalNumber: "JRN-20260201-001",
    namaTransaksi: "Penerimaan Pembayaran Multiple Invoices",
    tipe: "PEMASUKAN",
    coaId: 3,
    coaKode: "1-1200",
    coaNama: "Bank Mandiri",
    tanggalTransaksi: new Date("2026-02-01"),
    fileId: null,
    nominal: 95000000,
  },
  {
    id: 16,
    jurnalNumber: "JRN-20260203-001",
    namaTransaksi: "Beban Gaji Karyawan",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-02-03"),
    fileId: null,
    nominal: 28000000,
  },
  {
    id: 17,
    jurnalNumber: "JRN-20260205-001",
    namaTransaksi: "Pembayaran Hotel VIP Makkah",
    tipe: "PENGELUARAN",
    coaId: 7,
    coaKode: "5-1000",
    coaNama: "Beban Hotel",
    tanggalTransaksi: new Date("2026-02-05"),
    fileId: null,
    nominal: 85000000,
  },
  {
    id: 18,
    jurnalNumber: "JRN-20260207-001",
    namaTransaksi: "Penerimaan DP Group Booking",
    tipe: "PEMASUKAN",
    coaId: 2,
    coaKode: "1-1100",
    coaNama: "Bank BCA",
    tanggalTransaksi: new Date("2026-02-07"),
    fileId: null,
    nominal: 120000000,
  },
  {
    id: 19,
    jurnalNumber: "JRN-20260210-001",
    namaTransaksi: "Beban Sewa Kantor",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-02-10"),
    fileId: null,
    nominal: 15000000,
  },
  {
    id: 20,
    jurnalNumber: "JRN-20260212-001",
    namaTransaksi: "Pembayaran Transport Private",
    tipe: "PENGELUARAN",
    coaId: 8,
    coaKode: "5-2000",
    coaNama: "Beban Transportasi",
    tanggalTransaksi: new Date("2026-02-12"),
    fileId: null,
    nominal: 32000000,
  },
  {
    id: 21,
    jurnalNumber: "JRN-20260215-001",
    namaTransaksi: "Pendapatan Tambahan Services",
    tipe: "PEMASUKAN",
    coaId: 6,
    coaKode: "4-1000",
    coaNama: "Pendapatan Jasa Umroh",
    tanggalTransaksi: new Date("2026-02-15"),
    fileId: null,
    nominal: 42000000,
  },
  {
    id: 22,
    jurnalNumber: "JRN-20260218-001",
    namaTransaksi: "Beban Marketing & Promosi",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-02-18"),
    fileId: null,
    nominal: 18000000,
  },
  {
    id: 23,
    jurnalNumber: "JRN-20260220-001",
    namaTransaksi: "Penerimaan Kas Cicilan",
    tipe: "PEMASUKAN",
    coaId: 1,
    coaKode: "1-1000",
    coaNama: "Kas",
    tanggalTransaksi: new Date("2026-02-20"),
    fileId: null,
    nominal: 45000000,
  },
  {
    id: 24,
    jurnalNumber: "JRN-20260222-001",
    namaTransaksi: "Beban Konsumsi Batch-005",
    tipe: "PENGELUARAN",
    coaId: 9,
    coaKode: "5-3000",
    coaNama: "Beban Konsumsi",
    tanggalTransaksi: new Date("2026-02-22"),
    fileId: null,
    nominal: 22000000,
  },
  {
    id: 25,
    jurnalNumber: "JRN-20260225-001",
    namaTransaksi: "Pembayaran Hotel Premium Madinah",
    tipe: "PENGELUARAN",
    coaId: 7,
    coaKode: "5-1000",
    coaNama: "Beban Hotel",
    tanggalTransaksi: new Date("2026-02-25"),
    fileId: null,
    nominal: 52000000,
  },
  {
    id: 26,
    jurnalNumber: "JRN-20260228-001",
    namaTransaksi: "Penerimaan Transfer Bank",
    tipe: "PEMASUKAN",
    coaId: 3,
    coaKode: "1-1200",
    coaNama: "Bank Mandiri",
    tanggalTransaksi: new Date("2026-02-28"),
    fileId: null,
    nominal: 78000000,
  },
  {
    id: 27,
    jurnalNumber: "JRN-20260301-001",
    namaTransaksi: "Beban Utilitas Kantor",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-03-01"),
    fileId: null,
    nominal: 5500000,
  },
  {
    id: 28,
    jurnalNumber: "JRN-20260303-001",
    namaTransaksi: "Pembayaran Ziarah Package",
    tipe: "PENGELUARAN",
    coaId: 8,
    coaKode: "5-2000",
    coaNama: "Beban Transportasi",
    tanggalTransaksi: new Date("2026-03-03"),
    fileId: null,
    nominal: 10500000,
  },
  {
    id: 29,
    jurnalNumber: "JRN-20260305-001",
    namaTransaksi: "Pendapatan Jasa Koordinasi",
    tipe: "PEMASUKAN",
    coaId: 6,
    coaKode: "4-1000",
    coaNama: "Pendapatan Jasa Umroh",
    tanggalTransaksi: new Date("2026-03-05"),
    fileId: null,
    nominal: 25000000,
  },
  {
    id: 30,
    jurnalNumber: "JRN-20260308-001",
    namaTransaksi: "Beban Asuransi Perjalanan",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-03-08"),
    fileId: null,
    nominal: 7500000,
  },
  {
    id: 31,
    jurnalNumber: "JRN-20260310-001",
    namaTransaksi: "Penerimaan Pelunasan Group",
    tipe: "PEMASUKAN",
    coaId: 2,
    coaKode: "1-1100",
    coaNama: "Bank BCA",
    tanggalTransaksi: new Date("2026-03-10"),
    fileId: null,
    nominal: 102000000,
  },
  {
    id: 32,
    jurnalNumber: "JRN-20260312-001",
    namaTransaksi: "Beban Perlengkapan Umroh",
    tipe: "PENGELUARAN",
    coaId: 10,
    coaKode: "5-4000",
    coaNama: "Beban Operasional",
    tanggalTransaksi: new Date("2026-03-12"),
    fileId: null,
    nominal: 11000000,
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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const generateJournalNumber = (existingJurnal: Jurnal[]): string => {
  const today = new Date();
  const dateStr = today.toISOString().split("T")[0]?.replace(/-/g, "") ?? "";
  const todayJurnal = existingJurnal.filter((j) =>
    j.jurnalNumber.startsWith(`JRN-${dateStr}`)
  );
  const nextNumber = todayJurnal.length + 1;
  return `JRN-${dateStr}-${String(nextNumber).padStart(3, "0")}`;
};

export default function JournalKeuanganPage() {
  const [jurnalList, setJurnalList] = useState<Jurnal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingJurnal, setEditingJurnal] = useState<Jurnal | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; jurnal: Jurnal | null }>({
    open: false,
    jurnal: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; jurnal: Jurnal | null }>({
    open: false,
    jurnal: null,
  });
  const [filterType, setFilterType] = useState<string>("all");
  const [filterCOA, setFilterCOA] = useState<string>("all");

  const form = useForm<JurnalFormValues>({
    resolver: zodResolver(jurnalFormSchema),
    defaultValues: {
      jurnalNumber: "",
      namaTransaksi: "",
      tipe: "PENGELUARAN",
      coaId: 0,
      tanggalTransaksi: new Date(),
      nominal: 0,
    },
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setJurnalList(initialMockJurnal);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-generate journal number
  useEffect(() => {
    if (!editingJurnal && jurnalList.length > 0) {
      const suggestedNumber = generateJournalNumber(jurnalList);
      form.setValue("jurnalNumber", suggestedNumber);
    }
  }, [jurnalList, editingJurnal, form]);

  const onSubmit = (data: JurnalFormValues) => {
    const coa = mockCOA.find((c) => c.id === data.coaId);

    if (editingJurnal) {
      // Update existing jurnal
      setJurnalList((prev) =>
        prev.map((jurnal) =>
          jurnal.id === editingJurnal.id
            ? {
                ...jurnal,
                ...data,
                coaKode: coa?.kodeAkun || "",
                coaNama: coa?.namaAkun || "",
              }
            : jurnal
        )
      );
      setEditingJurnal(null);
    } else {
      // Create new jurnal
      const newJurnal: Jurnal = {
        id: Math.max(...jurnalList.map((j) => j.id), 0) + 1,
        ...data,
        coaKode: coa?.kodeAkun || "",
        coaNama: coa?.namaAkun || "",
        fileId: null,
      };
      setJurnalList((prev) => [newJurnal, ...prev]);
    }

    // Reset form
    form.reset({
      jurnalNumber: generateJournalNumber(jurnalList),
      namaTransaksi: "",
      tipe: "PENGELUARAN",
      coaId: 0,
      tanggalTransaksi: new Date(),
      nominal: 0,
    });
  };

  const handleEdit = (jurnal: Jurnal) => {
    setEditingJurnal(jurnal);
    form.reset({
      jurnalNumber: jurnal.jurnalNumber,
      namaTransaksi: jurnal.namaTransaksi,
      tipe: jurnal.tipe,
      coaId: jurnal.coaId,
      tanggalTransaksi: jurnal.tanggalTransaksi,
      nominal: jurnal.nominal,
    });
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingJurnal(null);
    form.reset({
      jurnalNumber: generateJournalNumber(jurnalList),
      namaTransaksi: "",
      tipe: "PENGELUARAN",
      coaId: 0,
      tanggalTransaksi: new Date(),
      nominal: 0,
    });
  };

  const handleDelete = (jurnal: Jurnal) => {
    setDeleteDialog({ open: true, jurnal });
  };

  const confirmDelete = () => {
    if (deleteDialog.jurnal) {
      setJurnalList((prev) => prev.filter((j) => j.id !== deleteDialog.jurnal!.id));
      setDeleteDialog({ open: false, jurnal: null });
    }
  };

  const handleView = (jurnal: Jurnal) => {
    setViewDialog({ open: true, jurnal });
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

  // Filter jurnal
  const filteredJurnal = jurnalList.filter((j) => {
    if (filterType !== "all" && j.tipe !== filterType) return false;
    if (filterCOA !== "all" && j.coaKode !== filterCOA) return false;
    return true;
  });

  const columns: DataTableColumn<Jurnal>[] = [
    {
      id: "jurnalNumber",
      accessorKey: "jurnalNumber",
      header: "Journal Number",
      cell: (row) => (
        <div className="font-mono text-sm">{row.jurnalNumber}</div>
      ),
    },
    {
      id: "tanggalTransaksi",
      accessorKey: "tanggalTransaksi",
      header: "Tanggal",
      cell: (row) => formatDate(row.tanggalTransaksi as Date),
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
      id: "coa",
      header: "COA",
      cell: (row) => (
        <div>
          <div className="font-mono text-sm">{row.coaKode as string}</div>
          <div className="text-xs text-muted-foreground">{row.coaNama as string}</div>
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
      id: "nominal",
      accessorKey: "nominal",
      header: "Nominal",
      cell: (row) => {
        const tipe = row.tipe as TransactionType;
        return (
          <div className={`font-semibold ${tipe === "PENGELUARAN" ? "text-red-600" : "text-green-600"}`}>
            {formatCurrency(row.nominal as number)}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const jurnal = row;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(jurnal)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(jurnal)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(jurnal)}
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
  const totalPengeluaran = filteredJurnal
    .filter((j) => j.tipe === "PENGELUARAN")
    .reduce((sum, j) => sum + j.nominal, 0);
  const totalPemasukan = filteredJurnal
    .filter((j) => j.tipe === "PEMASUKAN")
    .reduce((sum, j) => sum + j.nominal, 0);
  const netAmount = totalPemasukan - totalPengeluaran;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardList className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Journal Keuangan</h1>
          <p className="text-muted-foreground">
            Manage financial journal entries and transactions
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
                {editingJurnal ? "Edit Journal Entry" : "Create New Journal Entry"}
              </CardTitle>
              <CardDescription>
                {editingJurnal
                  ? "Update journal entry details"
                  : "Fill in the form to create a new journal entry"}
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
                {/* Row 1: Journal Number, Tanggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jurnalNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Journal Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="JRN-20260112-001"
                            className="font-mono"
                            disabled
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tanggalTransaksi"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Transaksi</FormLabel>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Nama Transaksi */}
                <FormField
                  control={form.control}
                  name="namaTransaksi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Transaksi</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Penerimaan Pembayaran Invoice..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Row 3: Tipe, COA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="coaId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chart of Account (COA)</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih COA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockCOA.map((coa) => (
                              <SelectItem key={coa.id} value={coa.id.toString()}>
                                {coa.kodeAkun} - {coa.namaAkun}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 4: Nominal */}
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

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    {editingJurnal ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Update Journal
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Journal
                      </>
                    )}
                  </Button>
                  {editingJurnal && (
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
            <CardDescription>Total Entries</CardDescription>
            <CardTitle className="text-2xl">{filteredJurnal.length}</CardTitle>
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
            <div>
              <Label>Filter by COA</Label>
              <Select value={filterCOA} onValueChange={setFilterCOA}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All COA</SelectItem>
                  {mockCOA.map((coa) => (
                    <SelectItem key={coa.id} value={coa.kodeAkun}>
                      {coa.kodeAkun} - {coa.namaAkun}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Journal List</CardTitle>
          <CardDescription>
            View and manage all journal entries ({filteredJurnal.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredJurnal}
            searchPlaceholder="Search by transaction name..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, jurnal: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete journal entry{" "}
              <span className="font-semibold font-mono">{deleteDialog.jurnal?.jurnalNumber}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, jurnal: null })}
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
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, jurnal: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Journal Entry Details
            </DialogTitle>
          </DialogHeader>
          {viewDialog.jurnal && (
            <div className="space-y-4">
              {/* Journal Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Journal Number</Label>
                  <p className="font-mono font-semibold">{viewDialog.jurnal.jurnalNumber}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Transaction Date</Label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(viewDialog.jurnal.tanggalTransaksi)}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-muted-foreground">Transaction Name</Label>
                  <p className="font-semibold">{viewDialog.jurnal.namaTransaksi}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Transaction Type</Label>
                  <div className="mt-1">
                    <Badge
                      variant={getTypeBadge(viewDialog.jurnal.tipe).variant}
                      className={getTypeBadge(viewDialog.jurnal.tipe).className}
                    >
                      <span className="flex items-center gap-1">
                        {getTypeBadge(viewDialog.jurnal.tipe).icon}
                        {viewDialog.jurnal.tipe}
                      </span>
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Chart of Account</Label>
                  <div className="mt-1">
                    <div className="font-mono text-sm">{viewDialog.jurnal.coaKode}</div>
                    <div className="text-sm text-muted-foreground">{viewDialog.jurnal.coaNama}</div>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <Label className="text-muted-foreground">Amount</Label>
                <p className={`text-3xl font-bold ${viewDialog.jurnal.tipe === "PENGELUARAN" ? "text-red-600" : "text-green-600"}`}>
                  {formatCurrency(viewDialog.jurnal.nominal)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, jurnal: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}