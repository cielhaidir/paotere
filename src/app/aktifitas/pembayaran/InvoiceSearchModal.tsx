"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Types
interface Invoice {
  id: number;
  nomor: string;
  tanggal: Date;
  agenName: string;
  total: number;
  status: 'DRAFT' | 'PAID' | 'OVERDUE';
  dueDate: Date;
}

interface InvoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectInvoice: (invoice: { id: number; nomor: string; total: number; agenName: string; status: string }) => void;
}

// Mock Data
const mockInvoices: Invoice[] = [
  {
    id: 1,
    nomor: "INV-2026-001",
    tanggal: new Date("2026-01-05"),
    agenName: "PT Berkah Umroh Indonesia",
    total: 115550000,
    status: "PAID",
    dueDate: new Date("2026-01-20"),
  },
  {
    id: 2,
    nomor: "INV-2026-002",
    tanggal: new Date("2026-01-06"),
    agenName: "CV Makkah Express",
    total: 89750000,
    status: "OVERDUE",
    dueDate: new Date("2026-01-15"),
  },
  {
    id: 3,
    nomor: "INV-2026-003",
    tanggal: new Date("2026-01-08"),
    agenName: "PT Nusantara Travel",
    total: 125000000,
    status: "DRAFT",
    dueDate: new Date("2026-01-25"),
  },
  {
    id: 4,
    nomor: "INV-2026-004",
    tanggal: new Date("2026-01-10"),
    agenName: "CV Makkah Express",
    total: 69540000,
    status: "PAID",
    dueDate: new Date("2026-01-22"),
  },
  {
    id: 5,
    nomor: "INV-2026-005",
    tanggal: new Date("2026-01-12"),
    agenName: "PT Madinah Journey",
    total: 156000000,
    status: "DRAFT",
    dueDate: new Date("2026-01-28"),
  },
  {
    id: 6,
    nomor: "INV-2026-006",
    tanggal: new Date("2026-01-14"),
    agenName: "CV Rahmat Haji Tour",
    total: 98500000,
    status: "OVERDUE",
    dueDate: new Date("2026-01-18"),
  },
  {
    id: 7,
    nomor: "INV-2026-007",
    tanggal: new Date("2026-01-15"),
    agenName: "PT Berkah Umroh Indonesia",
    total: 45000000,
    status: "PAID",
    dueDate: new Date("2026-01-30"),
  },
  {
    id: 8,
    nomor: "INV-2026-008",
    tanggal: new Date("2026-01-16"),
    agenName: "PT Nusantara Travel",
    total: 40000000,
    status: "DRAFT",
    dueDate: new Date("2026-02-01"),
  },
  {
    id: 9,
    nomor: "INV-2026-009",
    tanggal: new Date("2026-01-18"),
    agenName: "PT Madinah Journey",
    total: 95000000,
    status: "PAID",
    dueDate: new Date("2026-02-03"),
  },
  {
    id: 10,
    nomor: "INV-2026-010",
    tanggal: new Date("2026-01-20"),
    agenName: "CV Rahmat Haji Tour",
    total: 120000000,
    status: "DRAFT",
    dueDate: new Date("2026-02-05"),
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

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case "PAID":
      return "default";
    case "OVERDUE":
      return "destructive";
    case "DRAFT":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PAID":
      return "text-green-600 dark:text-green-400";
    case "OVERDUE":
      return "text-white";
    case "DRAFT":
      return "text-gray-600 dark:text-gray-400";
    default:
      return "";
  }
};

export function InvoiceSearchModal({ isOpen, onClose, onSelectInvoice }: InvoiceSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter invoices based on search query
  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return mockInvoices;

    const query = searchQuery.toLowerCase();
    return mockInvoices.filter(
      (invoice) =>
        invoice.nomor.toLowerCase().includes(query) ||
        invoice.agenName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectInvoice = (invoice: Invoice) => {
    onSelectInvoice({
      id: invoice.id,
      nomor: invoice.nomor,
      total: invoice.total,
      agenName: invoice.agenName,
      status: invoice.status,
    });
    onClose();
    setSearchQuery(""); // Reset search on close
  };

  const handleClose = () => {
    onClose();
    setSearchQuery(""); // Reset search on close
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Cari Invoice</DialogTitle>
          <DialogDescription>
            Cari dan pilih invoice untuk membuat alokasi pembayaran
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan nomor invoice atau nama agen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Invoice Table */}
        <div className="flex-1 overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Invoice</TableHead>
                <TableHead>Nama Agen</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleSelectInvoice(invoice)}
                  >
                    <TableCell className="font-mono font-medium">
                      {invoice.nomor}
                    </TableCell>
                    <TableCell>{invoice.agenName}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(invoice.total)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(invoice.status)}
                        className={getStatusColor(invoice.status)}
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    Tidak ada invoice yang ditemukan untuk &quot;{searchQuery}&quot;
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Menampilkan {filteredInvoices.length} dari {mockInvoices.length} invoice
        </div>
      </DialogContent>
    </Dialog>
  );
}