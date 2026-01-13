"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Printer,
  Users,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
type InvoiceStatus = "DRAFT" | "PAID" | "OVERDUE";

interface Invoice {
  id: number;
  nomor: string;
  tanggal: Date;
  agenId: number;
  agenNama: string;
  taxPercent: number;
  diskon: number;
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  batchFlightId: number | null;
  batchFlightNomor: string | null;
  jumlahJemaah: number;
  jemaahIds: number[];
  amountPaid: number;
  [key: string]: unknown;
}

interface Agen {
  id: number;
  nama: string;
}

interface BatchFlight {
  id: number;
  nomor: string;
}

interface Jemaah {
  id: number;
  nama: string;
  harga: number;
  agenId: number;
  isAssigned: boolean;
}

// Validation Schema
const invoiceFormSchema = z.object({
  nomor: z.string().min(5, "Nomor invoice minimal 5 karakter"),
  tanggal: z.date({ required_error: "Tanggal harus diisi" }),
  agenId: z.number({ required_error: "Agen harus dipilih" }).min(1, "Agen harus dipilih"),
  taxPercent: z.number().min(0, "Tax percent tidak boleh negatif").max(100, "Tax percent maksimal 100%"),
  diskon: z.number().min(0, "Diskon tidak boleh negatif"),
  status: z.enum(["DRAFT", "PAID", "OVERDUE"], {
    required_error: "Status harus dipilih",
  }),
  dueDate: z.date({ required_error: "Due date harus diisi" }),
  batchFlightId: z.number().nullable().optional(),
  jemaahIds: z.array(z.number()).min(1, "Minimal 1 jemaah harus dipilih"),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// Mockup Data
const mockAgens: Agen[] = [
  { id: 1, nama: "PT Berkah Umroh Indonesia" },
  { id: 2, nama: "CV Rahmat Haji Tour" },
  { id: 3, nama: "PT Nusantara Travel" },
  { id: 4, nama: "CV Makkah Express" },
  { id: 5, nama: "PT Madinah Journey" },
];

const mockBatchFlights: BatchFlight[] = [
  { id: 1, nomor: "BATCH-001" },
  { id: 2, nomor: "BATCH-002" },
  { id: 3, nomor: "BATCH-003" },
  { id: 4, nomor: "BATCH-004" },
  { id: 5, nomor: "BATCH-005" },
];

const initialMockJemaah: Jemaah[] = [
  { id: 1, nama: "Ahmad Fauzi", harga: 35000000, agenId: 1, isAssigned: true },
  { id: 2, nama: "Siti Nurhaliza", harga: 35000000, agenId: 1, isAssigned: true },
  { id: 3, nama: "Budi Santoso", harga: 35000000, agenId: 1, isAssigned: true },
  { id: 4, nama: "Dewi Lestari", harga: 35000000, agenId: 2, isAssigned: true },
  { id: 5, nama: "Eko Prasetyo", harga: 35000000, agenId: 2, isAssigned: true },
  { id: 6, nama: "Fatimah Zahra", harga: 38000000, agenId: 3, isAssigned: false },
  { id: 7, nama: "Gunawan Wijaya", harga: 38000000, agenId: 3, isAssigned: false },
  { id: 8, nama: "Hendra Gunawan", harga: 32000000, agenId: 4, isAssigned: false },
  { id: 9, nama: "Indah Permata", harga: 32000000, agenId: 4, isAssigned: false },
  { id: 10, nama: "Joko Widodo", harga: 40000000, agenId: 5, isAssigned: false },
  { id: 11, nama: "Kartini Sari", harga: 40000000, agenId: 1, isAssigned: false },
  { id: 12, nama: "Lukman Hakim", harga: 36000000, agenId: 2, isAssigned: false },
  { id: 13, nama: "Maya Sari", harga: 36000000, agenId: 3, isAssigned: false },
  { id: 14, nama: "Nurul Huda", harga: 34000000, agenId: 4, isAssigned: false },
  { id: 15, nama: "Omar Abdullah", harga: 34000000, agenId: 5, isAssigned: false },
];

const initialMockInvoices: Invoice[] = [
  {
    id: 1,
    nomor: "INV-2026-001",
    tanggal: new Date("2026-01-05"),
    agenId: 1,
    agenNama: "PT Berkah Umroh Indonesia",
    taxPercent: 11,
    diskon: 1000000,
    subtotal: 105000000,
    total: 115550000,
    status: "PAID",
    dueDate: new Date("2026-02-05"),
    batchFlightId: 1,
    batchFlightNomor: "BATCH-001",
    jumlahJemaah: 3,
    jemaahIds: [1, 2, 3],
    amountPaid: 115550000,
  },
  {
    id: 2,
    nomor: "INV-2026-002",
    tanggal: new Date("2026-01-08"),
    agenId: 2,
    agenNama: "CV Rahmat Haji Tour",
    taxPercent: 11,
    diskon: 0,
    subtotal: 70000000,
    total: 77700000,
    status: "DRAFT",
    dueDate: new Date("2026-02-08"),
    batchFlightId: null,
    batchFlightNomor: null,
    jumlahJemaah: 2,
    jemaahIds: [4, 5],
    amountPaid: 0,
  },
  {
    id: 3,
    nomor: "INV-2026-003",
    tanggal: new Date("2026-01-10"),
    agenId: 3,
    agenNama: "PT Nusantara Travel",
    taxPercent: 11,
    diskon: 500000,
    subtotal: 76000000,
    total: 83860000,
    status: "OVERDUE",
    dueDate: new Date("2026-01-15"),
    batchFlightId: 2,
    batchFlightNomor: "BATCH-002",
    jumlahJemaah: 2,
    jemaahIds: [6, 7],
    amountPaid: 40000000,
  },
  {
    id: 4,
    nomor: "INV-2026-004",
    tanggal: new Date("2026-01-12"),
    agenId: 4,
    agenNama: "CV Makkah Express",
    taxPercent: 11,
    diskon: 1500000,
    subtotal: 64000000,
    total: 69540000,
    status: "PAID",
    dueDate: new Date("2026-02-12"),
    batchFlightId: 3,
    batchFlightNomor: "BATCH-003",
    jumlahJemaah: 2,
    jemaahIds: [8, 9],
    amountPaid: 69540000,
  },
  {
    id: 5,
    nomor: "INV-2026-005",
    tanggal: new Date("2026-01-15"),
    agenId: 5,
    agenNama: "PT Madinah Journey",
    taxPercent: 11,
    diskon: 2000000,
    subtotal: 80000000,
    total: 86800000,
    status: "DRAFT",
    dueDate: new Date("2026-02-15"),
    batchFlightId: null,
    batchFlightNomor: null,
    jumlahJemaah: 2,
    jemaahIds: [10, 15],
    amountPaid: 0,
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

const generateInvoiceNumber = (existingInvoices: Invoice[]): string => {
  const currentYear = new Date().getFullYear();
  const invoicesThisYear = existingInvoices.filter((inv) =>
    inv.nomor.startsWith(`INV-${currentYear}`)
  );
  const nextNumber = invoicesThisYear.length + 1;
  return `INV-${currentYear}-${String(nextNumber).padStart(3, "0")}`;
};

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [jemaahList, setJemaahList] = useState<Jemaah[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [selectedJemaahIds, setSelectedJemaahIds] = useState<number[]>([]);
  const [calculatedValues, setCalculatedValues] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      nomor: "",
      tanggal: new Date(),
      agenId: 0,
      taxPercent: 11,
      diskon: 0,
      status: "DRAFT",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      batchFlightId: null,
      jemaahIds: [],
    },
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setInvoices(initialMockInvoices);
      setJemaahList(initialMockJemaah);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-generate invoice number
  useEffect(() => {
    if (!editingInvoice && invoices.length > 0) {
      const suggestedNumber = generateInvoiceNumber(invoices);
      form.setValue("nomor", suggestedNumber);
    }
  }, [invoices, editingInvoice, form]);

  // Calculate totals when jemaah selection or tax/discount changes
  useEffect(() => {
    const taxPercent = form.watch("taxPercent") || 0;
    const diskon = form.watch("diskon") || 0;
    
    const subtotal = jemaahList
      .filter((j) => selectedJemaahIds.includes(j.id))
      .reduce((sum, j) => sum + j.harga, 0);
    
    const tax = subtotal * (taxPercent / 100);
    const total = subtotal + tax - diskon;

    setCalculatedValues({ subtotal, tax, total });
  }, [selectedJemaahIds, form.watch("taxPercent"), form.watch("diskon"), jemaahList]);

  const getAvailableJemaah = (agenId: number): Jemaah[] => {
    return jemaahList.filter(
      (j) => j.agenId === agenId && (!j.isAssigned || (editingInvoice && editingInvoice.jemaahIds.includes(j.id)))
    );
  };

  const onSubmit = (data: InvoiceFormValues) => {
    const agen = mockAgens.find((a) => a.id === data.agenId);
    const batchFlight = data.batchFlightId
      ? mockBatchFlights.find((b) => b.id === data.batchFlightId)
      : null;

    const subtotal = jemaahList
      .filter((j) => selectedJemaahIds.includes(j.id))
      .reduce((sum, j) => sum + j.harga, 0);
    
    const tax = subtotal * (data.taxPercent / 100);
    const total = subtotal + tax - data.diskon;

    if (editingInvoice) {
      // Update existing invoice
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...inv,
                ...data,
                agenNama: agen?.nama || "",
                batchFlightNomor: batchFlight?.nomor || null,
                subtotal,
                total,
                jumlahJemaah: selectedJemaahIds.length,
                jemaahIds: selectedJemaahIds,
              }
            : inv
        )
      );

      // Update jemaah assignment status
      setJemaahList((prev) =>
        prev.map((j) => ({
          ...j,
          isAssigned:
            selectedJemaahIds.includes(j.id) ||
            (j.isAssigned && !editingInvoice.jemaahIds.includes(j.id)),
        }))
      );

      setEditingInvoice(null);
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        id: Math.max(...invoices.map((i) => i.id), 0) + 1,
        nomor: data.nomor,
        tanggal: data.tanggal,
        agenId: data.agenId,
        agenNama: agen?.nama || "",
        taxPercent: data.taxPercent,
        diskon: data.diskon,
        subtotal,
        total,
        status: data.status,
        dueDate: data.dueDate,
        batchFlightId: data.batchFlightId ?? null,
        batchFlightNomor: batchFlight?.nomor || null,
        jumlahJemaah: selectedJemaahIds.length,
        jemaahIds: selectedJemaahIds,
        amountPaid: data.status === "PAID" ? total : 0,
      };

      setInvoices((prev) => [...prev, newInvoice]);

      // Mark selected jemaah as assigned
      setJemaahList((prev) =>
        prev.map((j) =>
          selectedJemaahIds.includes(j.id) ? { ...j, isAssigned: true } : j
        )
      );
    }

    // Reset form
    form.reset({
      nomor: generateInvoiceNumber(invoices),
      tanggal: new Date(),
      agenId: 0,
      taxPercent: 11,
      diskon: 0,
      status: "DRAFT",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      batchFlightId: null,
      jemaahIds: [],
    });
    setSelectedJemaahIds([]);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    form.reset({
      nomor: invoice.nomor,
      tanggal: invoice.tanggal,
      agenId: invoice.agenId,
      taxPercent: invoice.taxPercent,
      diskon: invoice.diskon,
      status: invoice.status,
      dueDate: invoice.dueDate,
      batchFlightId: invoice.batchFlightId,
      jemaahIds: invoice.jemaahIds,
    });
    setSelectedJemaahIds(invoice.jemaahIds);
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
    form.reset({
      nomor: generateInvoiceNumber(invoices),
      tanggal: new Date(),
      agenId: 0,
      taxPercent: 11,
      diskon: 0,
      status: "DRAFT",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      batchFlightId: null,
      jemaahIds: [],
    });
    setSelectedJemaahIds([]);
  };

  const handleDelete = (invoice: Invoice) => {
    setDeleteDialog({ open: true, invoice });
  };

  const confirmDelete = () => {
    if (deleteDialog.invoice) {
      // Unassign jemaah
      setJemaahList((prev) =>
        prev.map((j) =>
          deleteDialog.invoice!.jemaahIds.includes(j.id)
            ? { ...j, isAssigned: false }
            : j
        )
      );

      // Remove invoice
      setInvoices((prev) => prev.filter((inv) => inv.id !== deleteDialog.invoice!.id));
      setDeleteDialog({ open: false, invoice: null });
    }
  };

  const handleView = (invoice: Invoice) => {
    setViewDialog({ open: true, invoice });
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const variants: Record<InvoiceStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      PAID: { variant: "default", className: "bg-green-500 hover:bg-green-600" },
      DRAFT: { variant: "secondary", className: "bg-yellow-500 hover:bg-yellow-600" },
      OVERDUE: { variant: "destructive", className: "" },
    };
    return variants[status];
  };

  const columns: DataTableColumn<Invoice>[] = [
    {
      id: "nomor",
      accessorKey: "nomor",
      header: "Nomor",
      cell: (row) => <div className="font-medium">{row.nomor}</div>,
    },
    {
      id: "tanggal",
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: (row) => formatDate(row.tanggal as Date),
    },
    {
      id: "agenNama",
      accessorKey: "agenNama",
      header: "Agen",
    },
    {
      id: "jumlahJemaah",
      accessorKey: "jumlahJemaah",
      header: "Jumlah Jemaah",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {row.jumlahJemaah}
        </div>
      ),
    },
    {
      id: "subtotal",
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: (row) => formatCurrency(row.subtotal as number),
    },
    {
      id: "tax",
      header: "Tax",
      cell: (row) => {
        const subtotal = row.subtotal as number;
        const taxPercent = row.taxPercent as number;
        const tax = subtotal * (taxPercent / 100);
        return (
          <div className="text-sm">
            {formatCurrency(tax)}
            <span className="text-muted-foreground ml-1">({taxPercent}%)</span>
          </div>
        );
      },
    },
    {
      id: "diskon",
      accessorKey: "diskon",
      header: "Diskon",
      cell: (row) => formatCurrency(row.diskon as number),
    },
    {
      id: "total",
      accessorKey: "total",
      header: "Total",
      cell: (row) => (
        <div className="font-semibold">{formatCurrency(row.total as number)}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (row) => {
        const status = row.status as InvoiceStatus;
        const badge = getStatusBadge(status);
        return (
          <Badge variant={badge.variant} className={badge.className}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      header: "Due Date",
      cell: (row) => formatDate(row.dueDate as Date),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const invoice = row;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(invoice)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(invoice)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(invoice)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alert("Print functionality to be implemented")}
              title="Print"
            >
              <Printer className="h-4 w-4" />
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

  const selectedAgenId = form.watch("agenId");
  const availableJemaah = selectedAgenId ? getAvailableJemaah(selectedAgenId) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Invoice</h1>
          <p className="text-muted-foreground">
            Manage invoices for agents and pilgrims
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
                {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
              </CardTitle>
              <CardDescription>
                {editingInvoice
                  ? "Update invoice details"
                  : "Fill in the form to create a new invoice"}
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
                {/* Row 1: Nomor, Tanggal, Agen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="nomor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Invoice</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="INV-2026-001"
                            disabled={!!editingInvoice}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tanggal"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Invoice</FormLabel>
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
                    name="agenId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agen</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(parseInt(value));
                            setSelectedJemaahIds([]);
                          }}
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih agen" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockAgens.map((agen) => (
                              <SelectItem key={agen.id} value={agen.id.toString()}>
                                {agen.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Tax, Diskon, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="taxPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Percent (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diskon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diskon (IDR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                            <SelectItem value="PAID">PAID</SelectItem>
                            <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Due Date, Batch Flight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
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
                    name="batchFlightId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Flight (Optional)</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(value ? parseInt(value) : null)
                          }
                          value={field.value?.toString() || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih batch flight" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
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
                </div>

                {/* Jemaah Selection */}
                {selectedAgenId > 0 && (
                  <FormField
                    control={form.control}
                    name="jemaahIds"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Pilih Jemaah</FormLabel>
                          <FormDescription>
                            Pilih jemaah yang akan dimasukkan ke invoice ini
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {availableJemaah.map((jemaah) => (
                            <FormField
                              key={jemaah.id}
                              control={form.control}
                              name="jemaahIds"
                              render={({ field }) => (
                                <FormItem
                                  key={jemaah.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={selectedJemaahIds.includes(jemaah.id)}
                                      onCheckedChange={(checked) => {
                                        const newIds = checked
                                          ? [...selectedJemaahIds, jemaah.id]
                                          : selectedJemaahIds.filter((id) => id !== jemaah.id);
                                        setSelectedJemaahIds(newIds);
                                        field.onChange(newIds);
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-normal cursor-pointer">
                                      {jemaah.nama}
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground">
                                      {formatCurrency(jemaah.harga)}
                                    </p>
                                  </div>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Calculation Summary */}
                {selectedJemaahIds.length > 0 && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Ringkasan Perhitungan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({selectedJemaahIds.length} jemaah):</span>
                        <span className="font-semibold">
                          {formatCurrency(calculatedValues.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({form.watch("taxPercent")}%):</span>
                        <span className="font-semibold">
                          {formatCurrency(calculatedValues.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diskon:</span>
                        <span className="font-semibold text-red-600">
                          -{formatCurrency(form.watch("diskon") || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(calculatedValues.total)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    {editingInvoice ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Update Invoice
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Invoice
                      </>
                    )}
                  </Button>
                  {editingInvoice && (
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

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>
            View and manage all invoices ({invoices.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invoices}
            searchPlaceholder="Search by invoice number..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, invoice: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete invoice{" "}
              <span className="font-semibold">{deleteDialog.invoice?.nomor}</span>?
              {deleteDialog.invoice && deleteDialog.invoice.amountPaid > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
                  Warning: This invoice has payments of{" "}
                  {formatCurrency(deleteDialog.invoice.amountPaid)}
                </div>
              )}
              {deleteDialog.invoice && deleteDialog.invoice.jumlahJemaah > 0 && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-blue-800 dark:text-blue-200">
                  This invoice has {deleteDialog.invoice.jumlahJemaah} pilgrims assigned.
                  They will be unassigned.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, invoice: null })}
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
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, invoice: null })}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </DialogTitle>
          </DialogHeader>
          {viewDialog.invoice && (
            <div className="space-y-4">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Invoice Number</Label>
                  <p className="font-semibold">{viewDialog.invoice.nomor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={getStatusBadge(viewDialog.invoice.status).variant}
                      className={getStatusBadge(viewDialog.invoice.status).className}
                    >
                      {viewDialog.invoice.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p>{formatDate(viewDialog.invoice.tanggal)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{formatDate(viewDialog.invoice.dueDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Agent</Label>
                  <p>{viewDialog.invoice.agenNama}</p>
                </div>
                {viewDialog.invoice.batchFlightNomor && (
                  <div>
                    <Label className="text-muted-foreground">Batch Flight</Label>
                    <p>{viewDialog.invoice.batchFlightNomor}</p>
                  </div>
                )}
              </div>

              {/* Pilgrims List */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pilgrims ({viewDialog.invoice.jumlahJemaah})
                </h3>
                <div className="border rounded-lg divide-y">
                  {jemaahList
                    .filter((j) => viewDialog.invoice!.jemaahIds.includes(j.id))
                    .map((jemaah) => (
                      <div
                        key={jemaah.id}
                        className="flex justify-between items-center p-3"
                      >
                        <span>{jemaah.nama}</span>
                        <span className="font-medium">
                          {formatCurrency(jemaah.harga)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Calculation Breakdown
                </h3>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(viewDialog.invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({viewDialog.invoice.taxPercent}%):</span>
                    <span>
                      {formatCurrency(
                        viewDialog.invoice.subtotal *
                          (viewDialog.invoice.taxPercent / 100)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(viewDialog.invoice.diskon)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">
                      {formatCurrency(viewDialog.invoice.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <h3 className="font-semibold mb-2">Payment Progress</h3>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Amount Paid:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(viewDialog.invoice.amountPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining:</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(
                        viewDialog.invoice.total - viewDialog.invoice.amountPaid
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (viewDialog.invoice.amountPaid /
                            viewDialog.invoice.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, invoice: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}