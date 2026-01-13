import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MutationRecord {
  id: string;
  mutationId: string;
  date: string;
  total: number;
  description: string;
  amountUsed: number;
}

interface MutationTableProps {
  mutations: MutationRecord[];
  onAmountUsedChange: (id: string, amount: number) => void;
  onRemoveMutation: (id: string) => void;
}

export function MutationTable({ mutations, onAmountUsedChange, onRemoveMutation }: MutationTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleCurrencyInput = (id: string, value: string) => {
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    const amount = numericValue ? parseInt(numericValue, 10) : 0;
    onAmountUsedChange(id, amount);
  };

  const formatInputValue = (amount: number) => {
    if (amount === 0) return '';
    return amount.toLocaleString('id-ID');
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">ID Mutasi</TableHead>
            <TableHead className="w-[140px]">Tanggal Mutasi</TableHead>
            <TableHead className="w-[150px]">Total</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead className="w-[200px]">Total Digunakan</TableHead>
            <TableHead className="w-[80px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mutations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Belum ada mutasi yang ditambahkan. Klik tombol "Tambah Mutasi" untuk memulai.
              </TableCell>
            </TableRow>
          ) : (
            mutations.map((mutation) => (
              <TableRow key={mutation.id}>
                <TableCell className="font-medium">{mutation.mutationId}</TableCell>
                <TableCell>{formatDate(mutation.date)}</TableCell>
                <TableCell>{formatCurrency(mutation.total)}</TableCell>
                <TableCell className="max-w-[300px] truncate">{mutation.description}</TableCell>
                <TableCell>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      Rp
                    </span>
                    <Input
                      type="text"
                      value={formatInputValue(mutation.amountUsed)}
                      onChange={(e) => handleCurrencyInput(mutation.id, e.target.value)}
                      className="pl-10"
                      placeholder="0"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveMutation(mutation.id)}
                    className="hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
