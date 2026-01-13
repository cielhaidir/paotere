"use client";

import { useState, useMemo } from "react";
import { Package2, Plus, Edit, Trash, Eye, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
type Paket = {
  id: number;
  produkId: number;
  nama: string;
  jumlahJemaah: number;
  [key: string]: unknown;
};

type Produk = {
  id: number;
  nama: string;
  jumlahPaket: number;
  jumlahJemaah: number;
  paket: Paket[];
  [key: string]: unknown;
};

// Validation Schemas
const produkFormSchema = z.object({
  nama: z.string().min(3, "Nama produk minimal 3 karakter"),
});

const paketFormSchema = z.object({
  nama: z.string().min(3, "Nama paket minimal 3 karakter"),
  produkId: z.number(),
});

type ProdukFormValues = z.infer<typeof produkFormSchema>;
type PaketFormValues = z.infer<typeof paketFormSchema>;

// Mock Data
const initialMockData: Produk[] = [
  {
    id: 1,
    nama: "Umroh Reguler",
    jumlahPaket: 3,
    jumlahJemaah: 245,
    paket: [
      { id: 1, produkId: 1, nama: "Paket 9 Hari", jumlahJemaah: 120 },
      { id: 2, produkId: 1, nama: "Paket 12 Hari", jumlahJemaah: 85 },
      { id: 3, produkId: 1, nama: "Paket 15 Hari", jumlahJemaah: 40 },
    ],
  },
  {
    id: 2,
    nama: "Umroh Plus Turki",
    jumlahPaket: 2,
    jumlahJemaah: 156,
    paket: [
      { id: 4, produkId: 2, nama: "Paket 14 Hari", jumlahJemaah: 98 },
      { id: 5, produkId: 2, nama: "Paket 17 Hari", jumlahJemaah: 58 },
    ],
  },
  {
    id: 3,
    nama: "Umroh Plus Dubai",
    jumlahPaket: 2,
    jumlahJemaah: 132,
    paket: [
      { id: 6, produkId: 3, nama: "Paket 12 Hari", jumlahJemaah: 78 },
      { id: 7, produkId: 3, nama: "Paket 15 Hari", jumlahJemaah: 54 },
    ],
  },
  {
    id: 4,
    nama: "Haji Reguler",
    jumlahPaket: 1,
    jumlahJemaah: 450,
    paket: [
      { id: 8, produkId: 4, nama: "Paket 40 Hari", jumlahJemaah: 450 },
    ],
  },
  {
    id: 5,
    nama: "Haji Plus",
    jumlahPaket: 2,
    jumlahJemaah: 180,
    paket: [
      { id: 9, produkId: 5, nama: "Paket 35 Hari", jumlahJemaah: 120 },
      { id: 10, produkId: 5, nama: "Paket 40 Hari VIP", jumlahJemaah: 60 },
    ],
  },
  {
    id: 6,
    nama: "Umroh Ramadan",
    jumlahPaket: 4,
    jumlahJemaah: 320,
    paket: [
      { id: 11, produkId: 6, nama: "Paket 10 Hari Awal Ramadan", jumlahJemaah: 95 },
      { id: 12, produkId: 6, nama: "Paket 12 Hari Pertengahan", jumlahJemaah: 110 },
      { id: 13, produkId: 6, nama: "Paket 15 Hari Akhir Ramadan", jumlahJemaah: 85 },
      { id: 14, produkId: 6, nama: "Paket 20 Hari Full Ramadan", jumlahJemaah: 30 },
    ],
  },
  {
    id: 7,
    nama: "Umroh Plus Mesir",
    jumlahPaket: 2,
    jumlahJemaah: 98,
    paket: [
      { id: 15, produkId: 7, nama: "Paket 14 Hari", jumlahJemaah: 62 },
      { id: 16, produkId: 7, nama: "Paket 17 Hari", jumlahJemaah: 36 },
    ],
  },
  {
    id: 8,
    nama: "Umroh Ekonomis",
    jumlahPaket: 2,
    jumlahJemaah: 289,
    paket: [
      { id: 17, produkId: 8, nama: "Paket 9 Hari Budget", jumlahJemaah: 178 },
      { id: 18, produkId: 8, nama: "Paket 12 Hari Budget", jumlahJemaah: 111 },
    ],
  },
  {
    id: 9,
    nama: "Umroh Premium",
    jumlahPaket: 3,
    jumlahJemaah: 125,
    paket: [
      { id: 19, produkId: 9, nama: "Paket 12 Hari Premium", jumlahJemaah: 55 },
      { id: 20, produkId: 9, nama: "Paket 15 Hari Premium", jumlahJemaah: 45 },
      { id: 21, produkId: 9, nama: "Paket 20 Hari VIP", jumlahJemaah: 25 },
    ],
  },
  {
    id: 10,
    nama: "Umroh Plus Aqso",
    jumlahPaket: 2,
    jumlahJemaah: 142,
    paket: [
      { id: 22, produkId: 10, nama: "Paket 14 Hari", jumlahJemaah: 88 },
      { id: 23, produkId: 10, nama: "Paket 17 Hari", jumlahJemaah: 54 },
    ],
  },
  {
    id: 11,
    nama: "Umroh Backpacker",
    jumlahPaket: 1,
    jumlahJemaah: 67,
    paket: [
      { id: 24, produkId: 11, nama: "Paket 9 Hari Hemat", jumlahJemaah: 67 },
    ],
  },
  {
    id: 12,
    nama: "Haji Furoda",
    jumlahPaket: 1,
    jumlahJemaah: 280,
    paket: [
      { id: 25, produkId: 12, nama: "Paket 35 Hari", jumlahJemaah: 280 },
    ],
  },
  {
    id: 13,
    nama: "Umroh Keluarga",
    jumlahPaket: 3,
    jumlahJemaah: 156,
    paket: [
      { id: 26, produkId: 13, nama: "Paket 12 Hari Keluarga", jumlahJemaah: 72 },
      { id: 27, produkId: 13, nama: "Paket 15 Hari Keluarga", jumlahJemaah: 54 },
      { id: 28, produkId: 13, nama: "Paket 20 Hari Keluarga Plus", jumlahJemaah: 30 },
    ],
  },
  {
    id: 14,
    nama: "Umroh Syawal",
    jumlahPaket: 2,
    jumlahJemaah: 203,
    paket: [
      { id: 29, produkId: 14, nama: "Paket 9 Hari", jumlahJemaah: 125 },
      { id: 30, produkId: 14, nama: "Paket 12 Hari", jumlahJemaah: 78 },
    ],
  },
  {
    id: 15,
    nama: "Umroh Plus Istanbul",
    jumlahPaket: 2,
    jumlahJemaah: 115,
    paket: [
      { id: 31, produkId: 15, nama: "Paket 16 Hari", jumlahJemaah: 68 },
      { id: 32, produkId: 15, nama: "Paket 19 Hari Ekstra", jumlahJemaah: 47 },
    ],
  },
];

export default function ProdukPage() {
  const [loading, setLoading] = useState(true);
  const [produkData, setProdukData] = useState<Produk[]>([]);
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPaketDialog, setShowPaketDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);
  const [editingPaket, setEditingPaket] = useState<Paket | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: "produk" | "paket"; item: Produk | Paket } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize data
  useState(() => {
    setTimeout(() => {
      setProdukData(initialMockData);
      setLoading(false);
    }, 1000);
  });

  // Produk Form
  const produkForm = useForm<ProdukFormValues>({
    resolver: zodResolver(produkFormSchema),
    defaultValues: {
      nama: "",
    },
  });

  // Paket Form
  const paketForm = useForm<PaketFormValues>({
    resolver: zodResolver(paketFormSchema),
    defaultValues: {
      nama: "",
      produkId: 0,
    },
  });

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle Produk Submit
  const onSubmitProduk = (values: ProdukFormValues) => {
    if (editingProduk) {
      // Update existing produk
      setProdukData((prev) =>
        prev.map((p) =>
          p.id === editingProduk.id
            ? { ...p, nama: values.nama }
            : p
        )
      );
      showSuccess("Produk berhasil diupdate");
      setEditingProduk(null);
    } else {
      // Create new produk
      const newProduk: Produk = {
        id: Math.max(...produkData.map((p) => p.id), 0) + 1,
        nama: values.nama,
        jumlahPaket: 0,
        jumlahJemaah: 0,
        paket: [],
      };
      setProdukData((prev) => [...prev, newProduk]);
      showSuccess("Produk berhasil ditambahkan");
    }
    produkForm.reset();
    setShowCreateForm(false);
  };

  // Handle Edit Produk
  const handleEditProduk = (produk: Produk) => {
    setEditingProduk(produk);
    produkForm.setValue("nama", produk.nama);
    setShowCreateForm(true);
  };

  // Handle Delete Produk
  const handleDeleteProduk = (produk: Produk) => {
    setDeletingItem({ type: "produk", item: produk });
    setShowDeleteDialog(true);
  };

  // Handle View Details
  const handleViewDetails = (produk: Produk) => {
    setSelectedProduk(produk);
    setShowDetailsDialog(true);
  };

  // Handle Manage Paket
  const handleManagePaket = (produk: Produk) => {
    setSelectedProduk(produk);
    paketForm.setValue("produkId", produk.id);
    setShowPaketDialog(true);
  };

  // Handle Paket Submit
  const onSubmitPaket = (values: PaketFormValues) => {
    if (!selectedProduk) return;

    if (editingPaket) {
      // Update existing paket
      setProdukData((prev) =>
        prev.map((p) =>
          p.id === selectedProduk.id
            ? {
                ...p,
                paket: p.paket.map((pk) =>
                  pk.id === editingPaket.id ? { ...pk, nama: values.nama } : pk
                ),
              }
            : p
        )
      );
      showSuccess("Paket berhasil diupdate");
      setEditingPaket(null);
    } else {
      // Create new paket
      const newPaket: Paket = {
        id: Math.max(...produkData.flatMap((p) => p.paket.map((pk) => pk.id)), 0) + 1,
        produkId: selectedProduk.id,
        nama: values.nama,
        jumlahJemaah: 0,
      };
      setProdukData((prev) =>
        prev.map((p) =>
          p.id === selectedProduk.id
            ? {
                ...p,
                jumlahPaket: p.jumlahPaket + 1,
                paket: [...p.paket, newPaket],
              }
            : p
        )
      );
      showSuccess("Paket berhasil ditambahkan");
    }
    paketForm.reset({ nama: "", produkId: selectedProduk.id });
  };

  // Handle Edit Paket
  const handleEditPaket = (paket: Paket) => {
    setEditingPaket(paket);
    paketForm.setValue("nama", paket.nama);
  };

  // Handle Delete Paket
  const handleDeletePaket = (paket: Paket) => {
    setDeletingItem({ type: "paket", item: paket });
    setShowDeleteDialog(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === "produk") {
      const produk = deletingItem.item as Produk;
      setProdukData((prev) => prev.filter((p) => p.id !== produk.id));
      showSuccess("Produk berhasil dihapus");
    } else {
      const paket = deletingItem.item as Paket;
      setProdukData((prev) =>
        prev.map((p) =>
          p.paket.some((pk) => pk.id === paket.id)
            ? {
                ...p,
                jumlahPaket: p.jumlahPaket - 1,
                jumlahJemaah: p.jumlahJemaah - paket.jumlahJemaah,
                paket: p.paket.filter((pk) => pk.id !== paket.id),
              }
            : p
        )
      );
      showSuccess("Paket berhasil dihapus");
    }
    setShowDeleteDialog(false);
    setDeletingItem(null);
  };

  // Table Columns
  const columns: DataTableColumn<Produk>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: (row) => <span className="font-medium">#{row.id}</span>,
    },
    {
      id: "nama",
      accessorKey: "nama",
      header: "Nama Produk",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.nama}</span>
        </div>
      ),
    },
    {
      id: "jumlahPaket",
      accessorKey: "jumlahPaket",
      header: "Jumlah Paket",
      cell: (row) => (
        <Badge variant="secondary">
          {row.jumlahPaket} Paket
        </Badge>
      ),
    },
    {
      id: "jumlahJemaah",
      accessorKey: "jumlahJemaah",
      header: "Jumlah Jemaah",
      cell: (row) => (
        <Badge variant="outline">
          {row.jumlahJemaah} Jemaah
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewDetails(row)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleManagePaket(row)}
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditProduk(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteProduk(row)}
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Package2 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Manajemen Produk</h1>
          <p className="text-muted-foreground">
            Kelola produk umroh dan haji beserta paket-paketnya
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Create/Edit Form */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            if (!showCreateForm) {
              setEditingProduk(null);
              produkForm.reset();
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {editingProduk ? "Edit Produk" : "Tambah Produk Baru"}
              </CardTitle>
              <CardDescription>
                {editingProduk
                  ? "Update informasi produk"
                  : "Buat produk umroh atau haji baru"}
              </CardDescription>
            </div>
            {showCreateForm ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        {showCreateForm && (
          <CardContent>
            <Form {...produkForm}>
              <form
                onSubmit={produkForm.handleSubmit(onSubmitProduk)}
                className="space-y-4"
              >
                <FormField
                  control={produkForm.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Produk</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Umroh Reguler"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingProduk ? "Update Produk" : "Tambah Produk"}
                  </Button>
                  {editingProduk && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingProduk(null);
                        produkForm.reset();
                      }}
                    >
                      Batal
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
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Total {produkData.length} produk terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={produkData}
          />
        </CardContent>
      </Card>

      {/* Paket Management Dialog */}
      <Dialog open={showPaketDialog} onOpenChange={setShowPaketDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Kelola Paket - {selectedProduk?.nama}</DialogTitle>
            <DialogDescription>
              Tambah, edit, atau hapus paket untuk produk ini
            </DialogDescription>
          </DialogHeader>

          {/* Add/Edit Paket Form */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold mb-3">
              {editingPaket ? "Edit Paket" : "Tambah Paket Baru"}
            </h3>
            <Form {...paketForm}>
              <form
                onSubmit={paketForm.handleSubmit(onSubmitPaket)}
                className="space-y-4"
              >
                <FormField
                  control={paketForm.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Paket</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Contoh: Paket 9 Hari"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingPaket ? "Update Paket" : "Tambah Paket"}
                  </Button>
                  {editingPaket && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setEditingPaket(null);
                        paketForm.reset({
                          nama: "",
                          produkId: selectedProduk?.id || 0,
                        });
                      }}
                    >
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </div>

          {/* Paket List */}
          <div className="space-y-2">
            <h3 className="font-semibold">Daftar Paket ({selectedProduk?.paket.length || 0})</h3>
            {selectedProduk?.paket.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Belum ada paket. Tambahkan paket pertama.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedProduk?.paket.map((paket) => (
                  <div
                    key={paket.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{paket.nama}</p>
                      <p className="text-sm text-muted-foreground">
                        {paket.jumlahJemaah} Jemaah
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPaket(paket)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePaket(paket)}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Produk - {selectedProduk?.nama}</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang produk dan paket-paketnya
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Product Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedProduk?.jumlahPaket}
                </p>
                <p className="text-sm text-muted-foreground">Total Paket</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedProduk?.jumlahJemaah}
                </p>
                <p className="text-sm text-muted-foreground">Total Jemaah</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {selectedProduk?.paket.length
                    ? Math.round(
                        selectedProduk.jumlahJemaah / selectedProduk.paket.length
                      )
                    : 0}
                </p>
                <p className="text-sm text-muted-foreground">Avg per Paket</p>
              </div>
            </div>

            {/* Paket Details */}
            <div>
              <h3 className="font-semibold mb-3">Paket Tersedia</h3>
              {selectedProduk?.paket.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  Belum ada paket tersedia
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedProduk?.paket.map((paket) => (
                    <div
                      key={paket.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{paket.nama}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: #{paket.id}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{paket.jumlahJemaah} Jemaah</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedProduk.jumlahJemaah > 0
                            ? `${((paket.jumlahJemaah / selectedProduk.jumlahJemaah) * 100).toFixed(1)}%`
                            : "0%"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Tutup
            </Button>
            <Button onClick={() => {
              setShowDetailsDialog(false);
              handleManagePaket(selectedProduk!);
            }}>
              Kelola Paket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              {deletingItem?.type === "produk" ? (
                <>
                  Apakah Anda yakin ingin menghapus produk{" "}
                  <span className="font-semibold">
                    {(deletingItem.item as Produk).nama}
                  </span>
                  ?
                  {(deletingItem.item as Produk).jumlahPaket > 0 && (
                    <span className="block mt-2 text-destructive">
                      ⚠️ Produk ini memiliki {(deletingItem.item as Produk).jumlahPaket} paket.
                    </span>
                  )}
                  {(deletingItem.item as Produk).jumlahJemaah > 0 && (
                    <span className="block mt-1 text-destructive">
                      ⚠️ Produk ini memiliki {(deletingItem.item as Produk).jumlahJemaah} jemaah terdaftar.
                    </span>
                  )}
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin menghapus paket{" "}
                  <span className="font-semibold">
                    {(deletingItem?.item as Paket)?.nama}
                  </span>
                  ?
                  {deletingItem && (deletingItem.item as Paket).jumlahJemaah > 0 && (
                    <span className="block mt-2 text-destructive">
                      ⚠️ Paket ini memiliki {(deletingItem.item as Paket).jumlahJemaah} jemaah terdaftar.
                    </span>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingItem(null);
              }}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}