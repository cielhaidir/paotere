import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";

// Type definitions matching the parent component
type Mutasi = {
  id: number;
  timestamp: Date;
  deskripsi: string;
  reff: string;
  amount: number;
  allocatedInvoices: Array<{ invoiceNo: string; amount: number }>;
  [key: string]: unknown;
};

export interface MutationRecord {
  id: string;
  mutationId: string;
  date: string;
  total: number;
  description: string;
  amountUsed: number;
}

interface AddMutationModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutasiList: Mutasi[];
  existingMutationIds: string[];  // Should contain mutation.mutationId values (which are the reff values) from MutationRecord[]
  onAddMutation: (mutation: MutationRecord) => void;
}

export default function AddMutationModal({
  isOpen,
  onClose,
  mutasiList,
  existingMutationIds,
  onAddMutation,
}: AddMutationModalProps) {
  const [mutations, setMutations] = useState<Mutasi[]>(mutasiList);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [descriptionFilter, setDescriptionFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const handleSearch = () => {
    let filtered = [...mutasiList];

    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(
        (m) => m.timestamp >= new Date(startDate),
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (m) => m.timestamp <= new Date(endDate),
      );
    }

    // Filter by description
    if (descriptionFilter) {
      filtered = filtered.filter((m) =>
        m.deskripsi
          .toLowerCase()
          .includes(descriptionFilter.toLowerCase()) ||
        m.reff
          .toLowerCase()
          .includes(descriptionFilter.toLowerCase()),
      );
    }

    setMutations(filtered);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setMutations(mutasiList);
      setStartDate("");
      setEndDate("");
      setDescriptionFilter("");
      setIsRefreshing(false);
    }, 500);
  };

  const handleSelectMutation = (mutation: Mutasi) => {
    const mutationRecord: MutationRecord = {
      id: `temp-${Date.now()}`,
      mutationId: mutation.reff,
      date: mutation.timestamp.toISOString(),
      total: mutation.amount,
      description: mutation.deskripsi,
      amountUsed: 0
    };
    onAddMutation(mutationRecord);
  };

  // The parent component needs to pass mutation.mutationId values (which are the reff values)
  // to properly track which mutasi have been added
  const existingReffSet = new Set(existingMutationIds);

  const availableMutations = mutations.filter(
    (m) => !existingReffSet.has(m.reff),
  );

  // Function to determine row style based on usage
  const getRowClassName = (mutation: Mutasi) => {
    const totalAllocated = mutation.allocatedInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
    
    if (totalAllocated === 0) {
      return ""; // Normal - no special styling
    } else if (totalAllocated >= mutation.amount) {
      return "bg-red-50 hover:bg-red-100"; // Fully used - red
    } else {
      return "bg-yellow-50 hover:bg-yellow-100"; // Partially used - yellow
    }
  };

  const getTotalUsed = (mutation: Mutasi) => {
    return mutation.allocatedInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="!max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Pilih Mutasi Bank</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Filters */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-3">
              <Label htmlFor="start-date" className="text-sm">
                Tanggal Mulai
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="col-span-3">
              <Label htmlFor="end-date" className="text-sm">
                Tanggal Akhir
              </Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="col-span-4">
              <Label htmlFor="description" className="text-sm">
                Deskripsi
              </Label>
              <Input
                id="description"
                type="text"
                placeholder="Cari deskripsi..."
                value={descriptionFilter}
                onChange={(e) =>
                  setDescriptionFilter(e.target.value)
                }
                className="mt-1"
              />
            </div>
            <div className="col-span-2 flex items-end gap-2">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="h-4 w-4 mr-2" />
                Cari
              </Button>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-3"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">
                    ID Mutasi
                  </TableHead>
                  <TableHead className="w-[140px]">
                    Tanggal Mutasi
                  </TableHead>
                  <TableHead className="w-[150px]">
                    Total
                  </TableHead>
                  <TableHead>Deskripsi</TableHead>
                  <TableHead className="w-[150px]">
                    Total Digunakan
                  </TableHead>
                  <TableHead className="w-[100px]">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableMutations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      {mutations.length === 0
                        ? "Tidak ada data mutasi ditemukan"
                        : "Semua mutasi sudah ditambahkan"}
                    </TableCell>
                  </TableRow>
                ) : (
                  availableMutations.map((mutation) => {
                    const totalUsed = getTotalUsed(mutation);
                    return (
                      <TableRow
                        key={mutation.id}
                        className={`${getRowClassName(mutation)} cursor-pointer hover:opacity-80`}
                        onClick={() => handleSelectMutation(mutation)}
                      >
                        <TableCell className="font-medium">
                          {mutation.reff}
                        </TableCell>
                        <TableCell>
                          {formatDate(mutation.timestamp.toISOString())}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(mutation.amount)}
                        </TableCell>
                        <TableCell className="max-w-[300px] truncate">
                          {mutation.deskripsi}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(totalUsed)}
                        </TableCell>
                        <TableCell>
                          {totalUsed < mutation.amount && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectMutation(mutation);
                              }}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Tambah
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}