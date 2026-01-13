"use client";

import { useState } from "react";
import { Book, Plus, Pencil, Trash2, Eye, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Types
type TipeTransaksi = "PEMASUKAN" | "PENGELUARAN";

type COA = {
  id: number;
  kodeAkun: string;
  namaAkun: string;
  tipe: TipeTransaksi;
  jumlahTransaksi: number;
  [key: string]: unknown;
};

// Form validation schema
const coaFormSchema = z.object({
  kodeAkun: z.string().regex(/^[1-9]\d{3}$/, "Kode akun harus 4 digit angka"),
  namaAkun: z.string().min(3, "Nama akun minimal 3 karakter"),
  tipe: z.enum(["PEMASUKAN", "PENGELUARAN"], {
    required_error: "Tipe harus dipilih"
  })
});

type COAFormValues = z.infer<typeof coaFormSchema>;

// Mock data
const initialMockCOA: COA[] = [
  { id: 1, kodeAkun: "1101", namaAkun: "Kas", tipe: "PEMASUKAN", jumlahTransaksi: 245 },
  { id: 2, kodeAkun: "1102", namaAkun: "Bank BCA", tipe: "PEMASUKAN", jumlahTransaksi: 189 },
  { id: 3, kodeAkun: "1103", namaAkun: "Bank Mandiri", tipe: "PEMASUKAN", jumlahTransaksi: 156 },
  { id: 4, kodeAkun: "1104", namaAkun: "Bank BNI", tipe: "PEMASUKAN", jumlahTransaksi: 134 },
  { id: 5, kodeAkun: "1201", namaAkun: "Piutang Usaha", tipe: "PEMASUKAN", jumlahTransaksi: 78 },
  { id: 6, kodeAkun: "1301", namaAkun: "Perlengkapan Kantor", tipe: "PEMASUKAN", jumlahTransaksi: 45 },
  { id: 7, kodeAkun: "4101", namaAkun: "Pendapatan Paket Umroh", tipe: "PEMASUKAN", jumlahTransaksi: 567 },
  { id: 8, kodeAkun: "4102", namaAkun: "Pendapatan Paket Haji", tipe: "PEMASUKAN", jumlahTransaksi: 423 },
  { id: 9, kodeAkun: "4103", namaAkun: "Pendapatan Visa", tipe: "PEMASUKAN", jumlahTransaksi: 312 },
  { id: 10, kodeAkun: "4104", namaAkun: "Pendapatan Handling Fee", tipe: "PEMASUKAN", jumlahTransaksi: 267 },
  { id: 11, kodeAkun: "5101", namaAkun: "Biaya Transportasi", tipe: "PENGELUARAN", jumlahTransaksi: 123 },
  { id: 12, kodeAkun: "5102", namaAkun: "Biaya Akomodasi", tipe: "PENGELUARAN", jumlahTransaksi: 98 },
  { id: 13, kodeAkun: "5103", namaAkun: "Biaya Konsumsi", tipe: "PENGELUARAN", jumlahTransaksi: 145 },
  { id: 14, kodeAkun: "5104", namaAkun: "Biaya Tour Guide", tipe: "PENGELUARAN", jumlahTransaksi: 87 },
  { id: 15, kodeAkun: "5201", namaAkun: "Biaya Gaji Karyawan", tipe: "PENGELUARAN", jumlahTransaksi: 234 },
  { id: 16, kodeAkun: "5202", namaAkun: "Biaya Operasional Kantor", tipe: "PENGELUARAN", jumlahTransaksi: 178 },
  { id: 17, kodeAkun: "5203", namaAkun: "Biaya Listrik dan Air", tipe: "PENGELUARAN", jumlahTransaksi: 156 },
  { id: 18, kodeAkun: "5204", namaAkun: "Biaya Marketing", tipe: "PENGELUARAN", jumlahTransaksi: 134 },
  { id: 19, kodeAkun: "5205", namaAkun: "Biaya Administrasi", tipe: "PENGELUARAN", jumlahTransaksi: 112 },
  { id: 20, kodeAkun: "5301", namaAkun: "Biaya Penyusutan", tipe: "PENGELUARAN", jumlahTransaksi: 67 },
];

export default function ChartOfAccountsPage() {
  const [data, setData] = useState<COA[]>(initialMockCOA);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; account: COA | null }>({
    open: false,
    account: null,
  });
  const [detailDialog, setDetailDialog] = useState<{ open: boolean; account: COA | null }>({
    open: false,
    account: null,
  });
  const [successMessage, setSuccessMessage] = useState<string>("");

  const form = useForm<COAFormValues>({
    resolver: zodResolver(coaFormSchema),
    defaultValues: {
      kodeAkun: "",
      namaAkun: "",
      tipe: undefined,
    },
  });

  // Simulate loading
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle form submission
  const onSubmit = (values: COAFormValues) => {
    if (editingId) {
      // Update existing account
      setData(data.map(item => 
        item.id === editingId 
          ? { ...item, namaAkun: values.namaAkun, tipe: values.tipe }
          : item
      ));
      showSuccess("Akun berhasil diperbarui");
      setEditingId(null);
    } else {
      // Check if kode akun already exists
      if (data.some(item => item.kodeAkun === values.kodeAkun)) {
        form.setError("kodeAkun", { message: "Kode akun sudah digunakan" });
        return;
      }
      
      // Create new account
      const newAccount: COA = {
        id: Math.max(...data.map(d => d.id)) + 1,
        kodeAkun: values.kodeAkun,
        namaAkun: values.namaAkun,
        tipe: values.tipe,
        jumlahTransaksi: 0,
      };
      setData([...data, newAccount]);
      showSuccess("Akun berhasil ditambahkan");
    }
    
    form.reset();
  };

  // Handle edit
  const handleEdit = (account: COA) => {
    setEditingId(account.id);
    setIsFormOpen(true);
    form.reset({
      kodeAkun: account.kodeAkun,
      namaAkun: account.namaAkun,
      tipe: account.tipe,
    });
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset();
  };

  // Handle delete
  const handleDelete = (account: COA) => {
    setDeleteDialog({ open: true, account });
  };

  const confirmDelete = () => {
    if (deleteDialog.account) {
      setData(data.filter(item => item.id !== deleteDialog.account!.id));
      showSuccess("Akun berhasil dihapus");
      setDeleteDialog({ open: false, account: null });
    }
  };

  // Handle view details
  const handleViewDetails = (account: COA) => {
    setDetailDialog({ open: true, account });
  };

  // Table columns
  const columns: DataTableColumn<COA>[] = [
    {
      id: "kodeAkun",
      accessorKey: "kodeAkun",
      header: "Kode Akun",
      enableSorting: true,
    },
    {
      id: "namaAkun",
      accessorKey: "namaAkun",
      header: "Nama Akun",
      enableSorting: true,
    },
    {
      id: "tipe",
      accessorKey: "tipe",
      header: "Tipe",
      cell: (row) => {
        const tipe = row.tipe as TipeTransaksi;
        return (
          <Badge variant={tipe === "PEMASUKAN" ? "default" : "destructive"}>
            {tipe}
          </Badge>
        );
      },
    },
    {
      id: "jumlahTransaksi",
      accessorKey: "jumlahTransaksi",
      header: "Jumlah Transaksi",
      cell: (row) => {
        return <span className="text-muted-foreground">{row.jumlahTransaksi}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewDetails(row)}
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
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
        <Book className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Chart of Accounts</h1>
          <p className="text-muted-foreground">
            Kelola daftar akun keuangan untuk pencatatan transaksi
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          {successMessage}
        </div>
      )}

      {/* Create/Edit Form */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{editingId ? "Edit Akun" : "Tambah Akun Baru"}</CardTitle>
              <CardDescription>
                {editingId 
                  ? "Perbarui informasi akun yang dipilih"
                  : "Buat akun baru untuk pencatatan transaksi keuangan"
                }
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon">
              {isFormOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          </div>
        </CardHeader>
        {isFormOpen && (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="kodeAkun"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kode Akun</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="1101" 
                            {...field} 
                            disabled={!!editingId}
                            className={editingId ? "bg-muted" : ""}
                          />
                        </FormControl>
                        <FormDescription>
                          4 digit: 1xxx (Aset), 4xxx (Pendapatan), 5xxx (Biaya)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="namaAkun"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Akun</FormLabel>
                        <FormControl>
                          <Input placeholder="Kas" {...field} />
                        </FormControl>
                        <FormDescription>
                          Nama akun yang deskriptif
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tipe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipe</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PEMASUKAN">PEMASUKAN</SelectItem>
                            <SelectItem value="PENGELUARAN">PENGELUARAN</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Kategori transaksi
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Perbarui Akun" : "Tambah Akun"}
                  </Button>
                  {editingId && (
                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
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
          <CardTitle>Daftar Akun</CardTitle>
          <CardDescription>
            {data.length} akun terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, account: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus akun{" "}
              <strong>{deleteDialog.account?.namaAkun}</strong> ({deleteDialog.account?.kodeAkun})?
            </DialogDescription>
          </DialogHeader>
          {deleteDialog.account && deleteDialog.account.jumlahTransaksi > 0 && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
              <p className="font-semibold">⚠️ Peringatan</p>
              <p className="text-sm">
                Akun ini memiliki {deleteDialog.account.jumlahTransaksi} transaksi terkait.
                Menghapus akun ini dapat mempengaruhi laporan keuangan.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, account: null })}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} onOpenChange={(open) => setDetailDialog({ open, account: null })}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Akun</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang akun {detailDialog.account?.namaAkun}
            </DialogDescription>
          </DialogHeader>
          {detailDialog.account && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Kode Akun</p>
                  <p className="text-lg font-semibold">{detailDialog.account.kodeAkun}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nama Akun</p>
                  <p className="text-lg font-semibold">{detailDialog.account.namaAkun}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipe</p>
                  <Badge variant={detailDialog.account.tipe === "PEMASUKAN" ? "default" : "destructive"}>
                    {detailDialog.account.tipe}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Jumlah Transaksi</p>
                  <p className="text-lg font-semibold">{detailDialog.account.jumlahTransaksi}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-semibold">Statistik Penggunaan</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Akun ini digunakan dalam {detailDialog.account.jumlahTransaksi} transaksi</p>
                  <p>• Kategori: {detailDialog.account.tipe}</p>
                  <p>• Status: Aktif</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h4 className="mb-2 font-semibold">Transaksi Terkait (Contoh)</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between border-b pb-2 text-sm">
                      <span>Transaksi #{i}</span>
                      <span className="text-muted-foreground">
                        {new Date().toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailDialog({ open: false, account: null })}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}