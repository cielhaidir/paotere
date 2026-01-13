"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Truck,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  DollarSign,
  Plane,
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
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
interface BatchFlight {
  id: number;
  nomorBatch: string;
  route: string;
  bookingCode: string;
  flightDate: Date;
  jumlahInvoice: number;
  jumlahJemaah: number;
  totalPengeluaran: number;
  relatedInvoices: string[];
  [key: string]: unknown;
}

// Validation Schema
const batchFlightFormSchema = z.object({
  nomorBatch: z.string().min(5, "Nomor batch minimal 5 karakter"),
  route: z.string().min(3, "Route minimal 3 karakter"),
  bookingCode: z.string().min(3, "Booking code minimal 3 karakter"),
  flightDate: z.date({ required_error: "Flight date harus diisi" }),
});

type BatchFlightFormValues = z.infer<typeof batchFlightFormSchema>;

// Mockup Data - 10-15 batch flights with Indonesian routes
const initialMockBatchFlights: BatchFlight[] = [
  {
    id: 1,
    nomorBatch: "BATCH-001",
    route: "CGK-JED",
    bookingCode: "SV8201",
    flightDate: new Date("2026-02-15"),
    jumlahInvoice: 3,
    jumlahJemaah: 45,
    totalPengeluaran: 125000000,
    relatedInvoices: ["INV-2026-001", "INV-2026-002", "INV-2026-003"],
  },
  {
    id: 2,
    nomorBatch: "BATCH-002",
    route: "SUB-JED",
    bookingCode: "SV8305",
    flightDate: new Date("2026-02-20"),
    jumlahInvoice: 2,
    jumlahJemaah: 30,
    totalPengeluaran: 85000000,
    relatedInvoices: ["INV-2026-004", "INV-2026-005"],
  },
  {
    id: 3,
    nomorBatch: "BATCH-003",
    route: "CGK-MED",
    bookingCode: "GA9851",
    flightDate: new Date("2026-03-01"),
    jumlahInvoice: 4,
    jumlahJemaah: 52,
    totalPengeluaran: 145000000,
    relatedInvoices: ["INV-2026-006", "INV-2026-007", "INV-2026-008", "INV-2026-009"],
  },
  {
    id: 4,
    nomorBatch: "BATCH-004",
    route: "BDO-JED",
    bookingCode: "SV8421",
    flightDate: new Date("2026-03-10"),
    jumlahInvoice: 2,
    jumlahJemaah: 28,
    totalPengeluaran: 72000000,
    relatedInvoices: ["INV-2026-010", "INV-2026-011"],
  },
  {
    id: 5,
    nomorBatch: "BATCH-005",
    route: "CGK-JED",
    bookingCode: "SV8203",
    flightDate: new Date("2026-03-15"),
    jumlahInvoice: 5,
    jumlahJemaah: 68,
    totalPengeluaran: 185000000,
    relatedInvoices: ["INV-2026-012", "INV-2026-013", "INV-2026-014", "INV-2026-015", "INV-2026-016"],
  },
  {
    id: 6,
    nomorBatch: "BATCH-006",
    route: "UPG-JED",
    bookingCode: "GA9853",
    flightDate: new Date("2026-03-25"),
    jumlahInvoice: 3,
    jumlahJemaah: 38,
    totalPengeluaran: 98000000,
    relatedInvoices: ["INV-2026-017", "INV-2026-018", "INV-2026-019"],
  },
  {
    id: 7,
    nomorBatch: "BATCH-007",
    route: "CGK-MED",
    bookingCode: "SV8207",
    flightDate: new Date("2026-04-05"),
    jumlahInvoice: 4,
    jumlahJemaah: 55,
    totalPengeluaran: 152000000,
    relatedInvoices: ["INV-2026-020", "INV-2026-021", "INV-2026-022", "INV-2026-023"],
  },
  {
    id: 8,
    nomorBatch: "BATCH-008",
    route: "SUB-MED",
    bookingCode: "GA9857",
    flightDate: new Date("2026-04-12"),
    jumlahInvoice: 2,
    jumlahJemaah: 32,
    totalPengeluaran: 88000000,
    relatedInvoices: ["INV-2026-024", "INV-2026-025"],
  },
  {
    id: 9,
    nomorBatch: "BATCH-009",
    route: "CGK-JED",
    bookingCode: "SV8209",
    flightDate: new Date("2026-04-20"),
    jumlahInvoice: 3,
    jumlahJemaah: 42,
    totalPengeluaran: 115000000,
    relatedInvoices: ["INV-2026-026", "INV-2026-027", "INV-2026-028"],
  },
  {
    id: 10,
    nomorBatch: "BATCH-010",
    route: "JOG-JED",
    bookingCode: "GA9859",
    flightDate: new Date("2026-04-28"),
    jumlahInvoice: 2,
    jumlahJemaah: 25,
    totalPengeluaran: 68000000,
    relatedInvoices: ["INV-2026-029", "INV-2026-030"],
  },
  {
    id: 11,
    nomorBatch: "BATCH-011",
    route: "CGK-MED",
    bookingCode: "SV8211",
    flightDate: new Date("2026-05-05"),
    jumlahInvoice: 4,
    jumlahJemaah: 58,
    totalPengeluaran: 162000000,
    relatedInvoices: ["INV-2026-031", "INV-2026-032", "INV-2026-033", "INV-2026-034"],
  },
  {
    id: 12,
    nomorBatch: "BATCH-012",
    route: "DPS-JED",
    bookingCode: "GA9861",
    flightDate: new Date("2026-05-15"),
    jumlahInvoice: 3,
    jumlahJemaah: 35,
    totalPengeluaran: 95000000,
    relatedInvoices: ["INV-2026-035", "INV-2026-036", "INV-2026-037"],
  },
  {
    id: 13,
    nomorBatch: "BATCH-013",
    route: "CGK-JED",
    bookingCode: "SV8213",
    flightDate: new Date("2026-05-22"),
    jumlahInvoice: 5,
    jumlahJemaah: 72,
    totalPengeluaran: 198000000,
    relatedInvoices: ["INV-2026-038", "INV-2026-039", "INV-2026-040", "INV-2026-041", "INV-2026-042"],
  },
  {
    id: 14,
    nomorBatch: "BATCH-014",
    route: "PLM-JED",
    bookingCode: "GA9863",
    flightDate: new Date("2026-06-01"),
    jumlahInvoice: 2,
    jumlahJemaah: 28,
    totalPengeluaran: 75000000,
    relatedInvoices: ["INV-2026-043", "INV-2026-044"],
  },
  {
    id: 15,
    nomorBatch: "BATCH-015",
    route: "CGK-MED",
    bookingCode: "SV8215",
    flightDate: new Date("2026-06-10"),
    jumlahInvoice: 4,
    jumlahJemaah: 62,
    totalPengeluaran: 175000000,
    relatedInvoices: ["INV-2026-045", "INV-2026-046", "INV-2026-047", "INV-2026-048"],
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

const generateBatchNumber = (existingBatches: BatchFlight[]): string => {
  const nextNumber = existingBatches.length + 1;
  return `BATCH-${String(nextNumber).padStart(3, "0")}`;
};

export default function BatchFlightPage() {
  const [batchFlights, setBatchFlights] = useState<BatchFlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingBatch, setEditingBatch] = useState<BatchFlight | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; batch: BatchFlight | null }>({
    open: false,
    batch: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; batch: BatchFlight | null }>({
    open: false,
    batch: null,
  });

  const form = useForm<BatchFlightFormValues>({
    resolver: zodResolver(batchFlightFormSchema),
    defaultValues: {
      nomorBatch: "",
      route: "",
      bookingCode: "",
      flightDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setBatchFlights(initialMockBatchFlights);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-generate batch number
  useEffect(() => {
    if (!editingBatch && batchFlights.length > 0) {
      const suggestedNumber = generateBatchNumber(batchFlights);
      form.setValue("nomorBatch", suggestedNumber);
    }
  }, [batchFlights, editingBatch, form]);

  const onSubmit = (data: BatchFlightFormValues) => {
    if (editingBatch) {
      // Update existing batch
      setBatchFlights((prev) =>
        prev.map((batch) =>
          batch.id === editingBatch.id
            ? {
                ...batch,
                ...data,
              }
            : batch
        )
      );
      setEditingBatch(null);
    } else {
      // Create new batch
      const newBatch: BatchFlight = {
        id: Math.max(...batchFlights.map((b) => b.id), 0) + 1,
        ...data,
        jumlahInvoice: 0,
        jumlahJemaah: 0,
        totalPengeluaran: 0,
        relatedInvoices: [],
      };
      setBatchFlights((prev) => [...prev, newBatch]);
    }

    // Reset form
    form.reset({
      nomorBatch: generateBatchNumber(batchFlights),
      route: "",
      bookingCode: "",
      flightDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  };

  const handleEdit = (batch: BatchFlight) => {
    setEditingBatch(batch);
    form.reset({
      nomorBatch: batch.nomorBatch,
      route: batch.route,
      bookingCode: batch.bookingCode,
      flightDate: batch.flightDate,
    });
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingBatch(null);
    form.reset({
      nomorBatch: generateBatchNumber(batchFlights),
      route: "",
      bookingCode: "",
      flightDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  };

  const handleDelete = (batch: BatchFlight) => {
    setDeleteDialog({ open: true, batch });
  };

  const confirmDelete = () => {
    if (deleteDialog.batch) {
      setBatchFlights((prev) => prev.filter((b) => b.id !== deleteDialog.batch!.id));
      setDeleteDialog({ open: false, batch: null });
    }
  };

  const handleView = (batch: BatchFlight) => {
    setViewDialog({ open: true, batch });
  };

  const columns: DataTableColumn<BatchFlight>[] = [
    {
      id: "nomorBatch",
      accessorKey: "nomorBatch",
      header: "Nomor Batch",
      cell: (row) => (
        <div className="font-semibold">{row.nomorBatch}</div>
      ),
    },
    {
      id: "route",
      accessorKey: "route",
      header: "Route",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Plane className="h-4 w-4 text-primary" />
          <span className="font-mono">{row.route}</span>
        </div>
      ),
    },
    {
      id: "bookingCode",
      accessorKey: "bookingCode",
      header: "Booking Code",
      cell: (row) => (
        <Badge variant="outline" className="font-mono">
          {row.bookingCode}
        </Badge>
      ),
    },
    {
      id: "flightDate",
      accessorKey: "flightDate",
      header: "Flight Date",
      cell: (row) => formatDate(row.flightDate as Date),
    },
    {
      id: "jumlahInvoice",
      accessorKey: "jumlahInvoice",
      header: "Invoices",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4 text-muted-foreground" />
          {row.jumlahInvoice}
        </div>
      ),
    },
    {
      id: "jumlahJemaah",
      accessorKey: "jumlahJemaah",
      header: "Jemaah",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          {row.jumlahJemaah}
        </div>
      ),
    },
    {
      id: "totalPengeluaran",
      accessorKey: "totalPengeluaran",
      header: "Total Expenses",
      cell: (row) => (
        <div className="font-semibold text-orange-600">
          {formatCurrency(row.totalPengeluaran as number)}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const batch = row;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(batch)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(batch)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(batch)}
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
        <Truck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Batch Flight</h1>
          <p className="text-muted-foreground">
            Manage flight batches and group bookings
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
                {editingBatch ? "Edit Batch Flight" : "Create New Batch Flight"}
              </CardTitle>
              <CardDescription>
                {editingBatch
                  ? "Update batch flight details"
                  : "Fill in the form to create a new flight batch"}
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
                {/* Row 1: Nomor Batch, Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nomorBatch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Batch</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="BATCH-001"
                            disabled={!!editingBatch}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="route"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="CGK-JED"
                            className="font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Booking Code, Flight Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bookingCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking Code</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="SV8201"
                            className="font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="flightDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Flight Date</FormLabel>
                        <DatePicker
                          date={field.value}
                          onSelect={field.onChange}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    {editingBatch ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Update Batch
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Create Batch
                      </>
                    )}
                  </Button>
                  {editingBatch && (
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
            <CardDescription>Total Batches</CardDescription>
            <CardTitle className="text-2xl">{batchFlights.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Invoices</CardDescription>
            <CardTitle className="text-2xl">
              {batchFlights.reduce((sum, b) => sum + b.jumlahInvoice, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Jemaah</CardDescription>
            <CardTitle className="text-2xl">
              {batchFlights.reduce((sum, b) => sum + b.jumlahJemaah, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-xl text-orange-600">
              {formatCurrency(batchFlights.reduce((sum, b) => sum + b.totalPengeluaran, 0))}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Flight List</CardTitle>
          <CardDescription>
            View and manage all flight batches ({batchFlights.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={batchFlights}
            searchPlaceholder="Search by batch number..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, batch: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete batch{" "}
              <span className="font-semibold">{deleteDialog.batch?.nomorBatch}</span>?
              {deleteDialog.batch && deleteDialog.batch.jumlahInvoice > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
                  Warning: This batch has {deleteDialog.batch.jumlahInvoice} related invoice(s).
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, batch: null })}
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
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, batch: null })}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Batch Flight Details
            </DialogTitle>
          </DialogHeader>
          {viewDialog.batch && (
            <div className="space-y-4">
              {/* Batch Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Batch Number</Label>
                  <p className="font-semibold text-lg">{viewDialog.batch.nomorBatch}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Route</Label>
                  <p className="font-mono text-lg">{viewDialog.batch.route}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Booking Code</Label>
                  <Badge variant="outline" className="font-mono text-base">
                    {viewDialog.batch.bookingCode}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">Flight Date</Label>
                  <p>{formatDate(viewDialog.batch.flightDate)}</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Invoices
                    </CardDescription>
                    <CardTitle className="text-2xl">
                      {viewDialog.batch.jumlahInvoice}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Jemaah
                    </CardDescription>
                    <CardTitle className="text-2xl">
                      {viewDialog.batch.jumlahJemaah}
                    </CardTitle>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Expenses
                    </CardDescription>
                    <CardTitle className="text-lg text-orange-600">
                      {formatCurrency(viewDialog.batch.totalPengeluaran)}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Related Invoices */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Related Invoices ({viewDialog.batch.relatedInvoices.length})
                </h3>
                {viewDialog.batch.relatedInvoices.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {viewDialog.batch.relatedInvoices.map((invoice, idx) => (
                      <Badge key={idx} variant="outline" className="font-mono justify-center py-2">
                        {invoice}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground border rounded-lg">
                    No invoices assigned yet
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, batch: null })}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}