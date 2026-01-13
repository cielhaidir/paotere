"use client";

import { useState, useEffect } from "react";
import { Store, Plus, Pencil, Trash2, Eye, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, type DataTableColumn, type DataTableAction } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";

// Types
type Agen = {
  id: number;
  nama: string;
  alamat: string;
  nomorHp: string;
  jumlahJemaah: number;
  jumlahInvoice: number;
};

// Form validation schema
const agenFormSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  alamat: z.string().min(10, "Alamat minimal 10 karakter"),
  nomorHp: z.string().regex(/^(\+62|62|0)[0-9]{9,12}$/, "Format nomor HP tidak valid")
});

type AgenFormValues = z.infer<typeof agenFormSchema>;

// Mockup data
const initialMockAgents: Agen[] = [
  { 
    id: 1, 
    nama: "PT Berkah Umroh Indonesia", 
    alamat: "Jl. Sudirman No. 123, Jakarta Pusat", 
    nomorHp: "081234567890",
    jumlahJemaah: 45,
    jumlahInvoice: 12
  },
  { 
    id: 2, 
    nama: "CV Rahmat Haji Tour", 
    alamat: "Jl. Ahmad Yani No. 45, Surabaya", 
    nomorHp: "085612345678",
    jumlahJemaah: 32,
    jumlahInvoice: 8
  },
  { 
    id: 3, 
    nama: "PT Nur Hidayah Travel", 
    alamat: "Jl. Gatot Subroto No. 78, Bandung", 
    nomorHp: "082198765432",
    jumlahJemaah: 58,
    jumlahInvoice: 15
  },
  { 
    id: 4, 
    nama: "UD Barokah Haji Umroh", 
    alamat: "Jl. Diponegoro No. 234, Semarang", 
    nomorHp: "081987654321",
    jumlahJemaah: 27,
    jumlahInvoice: 6
  },
  { 
    id: 5, 
    nama: "CV Makkah Madinah Tour", 
    alamat: "Jl. Veteran No. 567, Yogyakarta", 
    nomorHp: "085678901234",
    jumlahJemaah: 41,
    jumlahInvoice: 11
  },
  { 
    id: 6, 
    nama: "PT Arafah Travel Indonesia", 
    alamat: "Jl. Asia Afrika No. 89, Jakarta Selatan", 
    nomorHp: "081345678901",
    jumlahJemaah: 63,
    jumlahInvoice: 18
  },
  { 
    id: 7, 
    nama: "CV Cahaya Kaaba", 
    alamat: "Jl. Pemuda No. 123, Medan", 
    nomorHp: "082234567890",
    jumlahJemaah: 35,
    jumlahInvoice: 9
  },
  { 
    id: 8, 
    nama: "PT Hijrah Tour & Travel", 
    alamat: "Jl. Panglima Sudirman No. 456, Makassar", 
    nomorHp: "081123456789",
    jumlahJemaah: 29,
    jumlahInvoice: 7
  },
  { 
    id: 9, 
    nama: "UD Safa Marwa Tours", 
    alamat: "Jl. Raya Bogor No. 789, Depok", 
    nomorHp: "085234567891",
    jumlahJemaah: 52,
    jumlahInvoice: 14
  },
  { 
    id: 10, 
    nama: "CV Al-Haramain Travel", 
    alamat: "Jl. Majapahit No. 321, Surabaya", 
    nomorHp: "082345678902",
    jumlahJemaah: 38,
    jumlahInvoice: 10
  },
  { 
    id: 11, 
    nama: "PT Umroh Plus Indonesia", 
    alamat: "Jl. Pahlawan No. 654, Palembang", 
    nomorHp: "081456789012",
    jumlahJemaah: 44,
    jumlahInvoice: 13
  },
  { 
    id: 12, 
    nama: "CV Multazam Haji Tour", 
    alamat: "Jl. Veteran No. 987, Malang", 
    nomorHp: "085345678903",
    jumlahJemaah: 31,
    jumlahInvoice: 8
  },
  { 
    id: 13, 
    nama: "PT Baitullah Travel", 
    alamat: "Jl. Hasanuddin No. 147, Banjarmasin", 
    nomorHp: "082456789013",
    jumlahJemaah: 26,
    jumlahInvoice: 6
  },
  { 
    id: 14, 
    nama: "UD Hajar Aswad Tours", 
    alamat: "Jl. Gatot Kaca No. 258, Solo", 
    nomorHp: "081567890123",
    jumlahJemaah: 48,
    jumlahInvoice: 12
  },
  { 
    id: 15, 
    nama: "CV Zamzam Tour & Travel", 
    alamat: "Jl. Imam Bonjol No. 369, Pekanbaru", 
    nomorHp: "085456789014",
    jumlahJemaah: 37,
    jumlahInvoice: 9
  },
  { 
    id: 16, 
    nama: "PT Mabrur Haji Indonesia", 
    alamat: "Jl. Supratman No. 741, Balikpapan", 
    nomorHp: "082567890124",
    jumlahJemaah: 55,
    jumlahInvoice: 16
  },
  { 
    id: 17, 
    nama: "CV Tawaf Travel", 
    alamat: "Jl. Ahmad Dahlan No. 852, Pontianak", 
    nomorHp: "081678901234",
    jumlahJemaah: 33,
    jumlahInvoice: 8
  },
  { 
    id: 18, 
    nama: "PT Khairat Umroh", 
    alamat: "Jl. Diponegoro No. 963, Samarinda", 
    nomorHp: "085567890125",
    jumlahJemaah: 42,
    jumlahInvoice: 11
  }
];

export default function AgenPage() {
  const [agents, setAgents] = useState<Agen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agen | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<Agen | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingAgent, setViewingAgent] = useState<Agen | null>(null);

  const form = useForm<AgenFormValues>({
    resolver: zodResolver(agenFormSchema),
    defaultValues: {
      nama: "",
      alamat: "",
      nomorHp: ""
    }
  });

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAgents(initialMockAgents);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle form submit
  const onSubmit = (data: AgenFormValues) => {
    if (editingAgent) {
      // Update existing agent
      setAgents(agents.map(agent => 
        agent.id === editingAgent.id 
          ? { ...agent, ...data }
          : agent
      ));
      setEditingAgent(null);
      alert("Agen berhasil diperbarui!");
    } else {
      // Create new agent
      const newAgent: Agen = {
        id: Math.max(...agents.map(a => a.id), 0) + 1,
        ...data,
        jumlahJemaah: 0,
        jumlahInvoice: 0
      };
      setAgents([...agents, newAgent]);
      alert("Agen berhasil ditambahkan!");
    }
    
    form.reset();
    setIsFormOpen(false);
  };

  // Handle edit
  const handleEdit = (agent: Agen) => {
    setEditingAgent(agent);
    form.reset({
      nama: agent.nama,
      alamat: agent.alamat,
      nomorHp: agent.nomorHp
    });
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = (agent: Agen) => {
    setAgentToDelete(agent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (agentToDelete) {
      setAgents(agents.filter(a => a.id !== agentToDelete.id));
      alert("Agen berhasil dihapus!");
      setDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  // Handle view details
  const handleView = (agent: Agen) => {
    setViewingAgent(agent);
    setViewDialogOpen(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingAgent(null);
    form.reset();
    setIsFormOpen(false);
  };

  // Define columns
  const columns: DataTableColumn<Agen>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      enableSorting: true,
      cell: (row) => <div className="font-medium">{row.id}</div>
    },
    {
      id: "nama",
      accessorKey: "nama",
      header: "Nama Agen",
      enableSorting: true,
      cell: (row) => <div className="font-medium">{row.nama}</div>
    },
    {
      id: "alamat",
      accessorKey: "alamat",
      header: "Alamat",
      cell: (row) => <div className="max-w-md truncate">{row.alamat}</div>
    },
    {
      id: "nomorHp",
      accessorKey: "nomorHp",
      header: "Nomor HP",
      cell: (row) => <div>{row.nomorHp}</div>
    },
    {
      id: "jumlahJemaah",
      accessorKey: "jumlahJemaah",
      header: "Jumlah Jemaah",
      enableSorting: true,
      cell: (row) => <div className="text-center">{row.jumlahJemaah}</div>
    },
    {
      id: "jumlahInvoice",
      accessorKey: "jumlahInvoice",
      header: "Jumlah Invoice",
      enableSorting: true,
      cell: (row) => <div className="text-center">{row.jumlahInvoice}</div>
    }
  ];

  // Define actions
  const actions: DataTableAction<Agen>[] = [
    {
      id: "view",
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: handleView,
      variant: "ghost"
    },
    {
      id: "edit",
      label: "Edit",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEdit,
      variant: "ghost"
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDelete,
      variant: "ghost"
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Store className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Manajemen Agen</h1>
            <p className="text-muted-foreground">
              Kelola data agen travel umroh dan haji
            </p>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => setIsFormOpen(!isFormOpen)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {editingAgent ? "Edit Agen" : "Tambah Agen Baru"}
              </CardTitle>
              <CardDescription>
                {editingAgent 
                  ? "Perbarui informasi agen yang sudah ada" 
                  : "Tambahkan agen travel baru ke sistem"}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              {isFormOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        
        {isFormOpen && (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Agen *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="PT Berkah Umroh Indonesia" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nomorHp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor HP *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="081234567890" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat *</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Jl. Sudirman No. 123, Jakarta Pusat"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1 md:flex-none">
                    {editingAgent ? "Update Agen" : "Tambah Agen"}
                  </Button>
                  {editingAgent && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancelEdit}
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
          <CardTitle>Daftar Agen</CardTitle>
          <CardDescription>
            Daftar semua agen travel yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={agents}
            actions={actions}
            searchPlaceholder="Cari agen..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus agen <strong>{agentToDelete?.nama}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Agen</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang agen
            </DialogDescription>
          </DialogHeader>
          {viewingAgent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-lg font-semibold">{viewingAgent.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nama Agen</p>
                  <p className="text-lg font-semibold">{viewingAgent.nama}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                  <p className="text-lg">{viewingAgent.alamat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nomor HP</p>
                  <p className="text-lg">{viewingAgent.nomorHp}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Statistik</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Jumlah Jemaah</CardDescription>
                      <CardTitle className="text-3xl">{viewingAgent.jumlahJemaah}</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardDescription>Jumlah Invoice</CardDescription>
                      <CardTitle className="text-3xl">{viewingAgent.jumlahInvoice}</CardTitle>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}