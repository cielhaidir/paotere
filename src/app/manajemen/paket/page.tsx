"use client";

import { useState } from "react";
import { Package2, Plus, Edit, Trash, Eye, ChevronDown, ChevronRight } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DataTableColumn } from "@/components/ui/data-table";

// Types
type Paket = {
  id: number;
  nama: string;
  produkId: number;
  produkNama: string;
  jumlahJemaah: number;
  harga: number;
  deskripsi?: string;
};

type Produk = {
  id: number;
  nama: string;
};

// Validation Schema
const paketFormSchema = z.object({
  nama: z.string().min(3, "Nama paket minimal 3 karakter"),
  produkId: z.number().min(1, "Pilih produk"),
  jumlahJemaah: z.number().min(0, "Jumlah jemaah harus positif"),
  harga: z.number().min(0, "Harga harus positif"),
  deskripsi: z.string().optional(),
});

type PaketFormValues = z.infer<typeof paketFormSchema>;

// Mock Product Data (from produk page)
const produkList: Produk[] = [
  { id: 1, nama: "Umroh Reguler" },
  { id: 2, nama: "Umroh Plus Turki" },
  { id: 3, nama: "Umroh Plus Dubai" },
  { id: 4, nama: "Haji Reguler" },
  { id: 5, nama: "Haji Plus" },
  { id: 6, nama: "Umroh Ramadan" },
  { id: 7, nama: "Umroh Plus Mesir" },
  { id: 8, nama: "Umroh Ekonomis" },
  { id: 9, nama: "Umroh Premium" },
  { id: 10, nama: "Umroh Plus Aqso" },
  { id: 11, nama: "Umroh Backpacker" },
  { id: 12, nama: "Haji Furoda" },
  { id: 13, nama: "Umroh Keluarga" },
  { id: 14, nama: "Umroh Syawal" },
  { id: 15, nama: "Umroh Plus Istanbul" },
];

// Mock Data
const initialMockData: Paket[] = [
  {
    id: 1,
    nama: "Paket 9 Hari",
    produkId: 1,
    produkNama: "Umroh Reguler",
    jumlahJemaah: 120,
    harga: 25000000,
    deskripsi: "Paket umroh reguler 9 hari dengan fasilitas standar",
  },
  {
    id: 2,
    nama: "Paket 12 Hari",
    produkId: 1,
    produkNama: "Umroh Reguler",
    jumlahJemaah: 85,
    harga: 28000000,
    deskripsi: "Paket umroh reguler 12 hari dengan waktu lebih leluasa",
  },
  {
    id: 3,
    nama: "Paket 15 Hari",
    produkId: 1,
    produkNama: "Umroh Reguler",
    jumlahJemaah: 40,
    harga: 32000000,
    deskripsi: "Paket umroh reguler 15 hari dengan kunjungan tambahan",
  },
  {
    id: 4,
    nama: "Paket 14 Hari",
    produkId: 2,
    produkNama: "Umroh Plus Turki",
    jumlahJemaah: 98,
    harga: 45000000,
    deskripsi: "Umroh plus wisata Turki 14 hari termasuk kota Istanbul",
  },
  {
    id: 5,
    nama: "Paket 17 Hari",
    produkId: 2,
    produkNama: "Umroh Plus Turki",
    jumlahJemaah: 58,
    harga: 52000000,
    deskripsi: "Umroh plus wisata Turki extended dengan kunjungan lebih banyak",
  },
  {
    id: 6,
    nama: "Paket 12 Hari",
    produkId: 3,
    produkNama: "Umroh Plus Dubai",
    jumlahJemaah: 78,
    harga: 42000000,
    deskripsi: "Umroh plus Dubai dengan city tour dan shopping",
  },
  {
    id: 7,
    nama: "Paket 15 Hari",
    produkId: 3,
    produkNama: "Umroh Plus Dubai",
    jumlahJemaah: 54,
    harga: 48000000,
    deskripsi: "Umroh plus Dubai dengan fasilitas premium",
  },
  {
    id: 8,
    nama: "Paket 40 Hari",
    produkId: 4,
    produkNama: "Haji Reguler",
    jumlahJemaah: 450,
    harga: 85000000,
    deskripsi: "Paket haji reguler sesuai kuota pemerintah",
  },
  {
    id: 9,
    nama: "Paket 35 Hari",
    produkId: 5,
    produkNama: "Haji Plus",
    jumlahJemaah: 120,
    harga: 125000000,
    deskripsi: "Paket haji plus dengan hotel dekat Masjidil Haram",
  },
  {
    id: 10,
    nama: "Paket 40 Hari VIP",
    produkId: 5,
    produkNama: "Haji Plus",
    jumlahJemaah: 60,
    harga: 180000000,
    deskripsi: "Paket haji VIP dengan fasilitas bintang lima",
  },
  {
    id: 11,
    nama: "Paket 10 Hari Awal Ramadan",
    produkId: 6,
    produkNama: "Umroh Ramadan",
    jumlahJemaah: 95,
    harga: 38000000,
    deskripsi: "Umroh di awal Ramadan dengan suasana lebih tenang",
  },
  {
    id: 12,
    nama: "Paket 12 Hari Pertengahan",
    produkId: 6,
    produkNama: "Umroh Ramadan",
    jumlahJemaah: 110,
    harga: 42000000,
    deskripsi: "Umroh pertengahan Ramadan",
  },
  {
    id: 13,
    nama: "Paket 15 Hari Akhir Ramadan",
    produkId: 6,
    produkNama: "Umroh Ramadan",
    jumlahJemaah: 85,
    harga: 55000000,
    deskripsi: "Umroh akhir Ramadan menjelang Idul Fitri",
  },
  {
    id: 14,
    nama: "Paket 20 Hari Full Ramadan",
    produkId: 6,
    produkNama: "Umroh Ramadan",
    jumlahJemaah: 30,
    harga: 65000000,
    deskripsi: "Paket lengkap sepanjang Ramadan",
  },
  {
    id: 15,
    nama: "Paket 9 Hari Budget",
    produkId: 8,
    produkNama: "Umroh Ekonomis",
    jumlahJemaah: 178,
    harga: 18000000,
    deskripsi: "Paket umroh ekonomis dengan harga terjangkau",
  },
];

export default function PaketPage() {
  const [loading, setLoading] = useState(true);
  const [paketData, setPaketData] = useState<Paket[]>([]);
  const [editingPaket, setEditingPaket] = useState<Paket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState<Paket | null>(null);
  const [deletingPaket, setDeletingPaket] = useState<Paket | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize data
  useState(() => {
    setTimeout(() => {
      setPaketData(initialMockData);
      setLoading(false);
    }, 1000);
  });

  // Paket Form
  const paketForm = useForm<PaketFormValues>({
    resolver: zodResolver(paketFormSchema),
    defaultValues: {
      nama: "",
      produkId: 0,
      jumlahJemaah: 0,
      harga: 0,
      deskripsi: "",
    },
  });

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle Paket Submit
  const onSubmitPaket = (values: PaketFormValues) => {
    const selectedProduk = produkList.find((p) => p.id === values.produkId);
    if (!selectedProduk) return;

    if (editingPaket) {
      // Update existing paket
      setPaketData((prev) =>
        prev.map((p) =>
          p.id === editingPaket.id
            ? { ...p, ...values, produkNama: selectedProduk.nama }
            : p
        )
      );
      showSuccess("Paket berhasil diupdate");
      setEditingPaket(null);
    } else {
      // Create new paket
      const newPaket: Paket = {
        id: Math.max(...paketData.map((p) => p.id), 0) + 1,
        ...values,
        produkNama: selectedProduk.nama,
      };
      setPaketData((prev) => [...prev, newPaket]);
      showSuccess("Paket berhasil ditambahkan");
    }
    paketForm.reset();
    setShowCreateForm(false);
  };

  // Handle Edit Paket
  const handleEditPaket = (paket: Paket) => {
    setEditingPaket(paket);
    paketForm.setValue("nama", paket.nama);
    paketForm.setValue("produkId", paket.produkId);
    paketForm.setValue("jumlahJemaah", paket.jumlahJemaah);
    paketForm.setValue("harga", paket.harga);
    paketForm.setValue("deskripsi", paket.deskripsi || "");
    setShowCreateForm(true);
  };

  // Handle Delete Paket
  const handleDeletePaket = (paket: Paket) => {
    setDeletingPaket(paket);
    setShowDeleteDialog(true);
  };

  // Handle View Details
  const handleViewDetails = (paket: Paket) => {
    setSelectedPaket(paket);
    setShowDetailsDialog(true);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (!deletingPaket) return;

    setPaketData((prev) => prev.filter((p) => p.id !== deletingPaket.id));
    showSuccess("Paket berhasil dihapus");
    setShowDeleteDialog(false);
    setDeletingPaket(null);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Table Columns
  const columns: DataTableColumn<Paket>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: (row) => <span className="font-medium">#{row.id}</span>,
    },
    {
      id: "nama",
      accessorKey: "nama",
      header: "Nama Paket",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.nama}</span>
        </div>
      ),
    },
    {
      id: "produkNama",
      accessorKey: "produkNama",
      header: "Produk",
      cell: (row) => (
        <Badge variant="outline">
          {row.produkNama}
        </Badge>
      ),
    },
    {
      id: "jumlahJemaah",
      accessorKey: "jumlahJemaah",
      header: "Jemaah",
      cell: (row) => (
        <Badge variant="secondary">
          {row.jumlahJemaah} Jemaah
        </Badge>
      ),
    },
    {
      id: "harga",
      accessorKey: "harga",
      header: "Harga",
      cell: (row) => (
        <span className="font-medium text-primary">
          {formatCurrency(row.harga)}
        </span>
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
            onClick={() => handleEditPaket(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeletePaket(row)}
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
          <h1 className="text-3xl font-bold">Manajemen Paket</h1>
          <p className="text-muted-foreground">
            Kelola paket umroh dan haji dengan detail lengkap
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
              setEditingPaket(null);
              paketForm.reset();
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {editingPaket ? "Edit Paket" : "Tambah Paket Baru"}
              </CardTitle>
              <CardDescription>
                {editingPaket
                  ? "Update informasi paket"
                  : "Buat paket umroh atau haji baru"}
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
            <Form {...paketForm}>
              <form
                onSubmit={paketForm.handleSubmit(onSubmitPaket)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
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
                  <FormField
                    control={paketForm.control}
                    name="produkId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produk</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value > 0 ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih produk" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {produkList.map((produk) => (
                              <SelectItem key={produk.id} value={produk.id.toString()}>
                                {produk.nama}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={paketForm.control}
                    name="jumlahJemaah"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Jumlah Jemaah</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={paketForm.control}
                    name="harga"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga (IDR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={paketForm.control}
                  name="deskripsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Deskripsi singkat tentang paket ini"
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
                        paketForm.reset();
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
          <CardTitle>Daftar Paket</CardTitle>
          <CardDescription>
            Total {paketData.length} paket terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={paketData}
          />
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Paket - {selectedPaket?.nama}</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang paket ini
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Paket Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">ID Paket</p>
                <p className="text-lg font-semibold">#{selectedPaket?.id}</p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Produk</p>
                <p className="text-lg font-semibold">{selectedPaket?.produkNama}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Jumlah Jemaah</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedPaket?.jumlahJemaah}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Harga</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedPaket?.harga ? formatCurrency(selectedPaket.harga) : "N/A"}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedPaket?.deskripsi && (
              <div className="border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Deskripsi</p>
                <p className="text-sm">{selectedPaket.deskripsi}</p>
              </div>
            )}

            {/* Additional Stats */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm text-muted-foreground mb-2">Informasi Tambahan</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Harga per Jemaah:</span>{" "}
                  {selectedPaket?.harga && selectedPaket.jumlahJemaah > 0
                    ? formatCurrency(selectedPaket.harga / selectedPaket.jumlahJemaah)
                    : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Total Potensi Pendapatan:</span>{" "}
                  {selectedPaket?.harga && selectedPaket.jumlahJemaah > 0
                    ? formatCurrency(selectedPaket.harga * selectedPaket.jumlahJemaah)
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Tutup
            </Button>
            <Button onClick={() => {
              setShowDetailsDialog(false);
              handleEditPaket(selectedPaket!);
            }}>
              Edit Paket
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
              Apakah Anda yakin ingin menghapus paket{" "}
              <span className="font-semibold">{deletingPaket?.nama}</span>?
              {deletingPaket && deletingPaket.jumlahJemaah > 0 && (
                <span className="block mt-2 text-destructive">
                  ⚠️ Paket ini memiliki {deletingPaket.jumlahJemaah} jemaah terdaftar.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeletingPaket(null);
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