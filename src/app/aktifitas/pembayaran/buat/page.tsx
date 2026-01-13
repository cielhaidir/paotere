"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HandCoins,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {InvoiceSearchModal} from "../InvoiceSearchModal";
import { MutationTable, type MutationRecord } from "../MutationTable";
import {InvoiceCard} from "../InvoiceCard";
import AddMutationModal from "../AddMutationModal";
import Link from "next/link";

// Types
type Mutasi = {
  id: number;
  timestamp: Date;
  deskripsi: string;
  reff: string;
  amount: number;
  allocatedInvoices: Array<{ invoiceNo: string; amount: number }>;
  [key: string]: unknown;
};

// Mockup Data - same as parent page
const initialMockMutasi: Mutasi[] = [
  {
    id: 1,
    timestamp: new Date("2026-01-05T10:30:00"),
    deskripsi: "Pembayaran Invoice INV-2026-001 - PT Berkah Umroh Indonesia",
    reff: "TRF20260105001",
    amount: 115550000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-001", amount: 115550000 }],
  },
  {
    id: 2,
    timestamp: new Date("2026-01-08T14:15:00"),
    deskripsi: "Pembayaran Partial Invoice INV-2026-003 - PT Nusantara Travel",
    reff: "TRF20260108001",
    amount: 40000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-003", amount: 40000000 }],
  },
  {
    id: 3,
    timestamp: new Date("2026-01-10T09:45:00"),
    deskripsi: "Pembayaran Invoice INV-2026-004 - CV Makkah Express",
    reff: "TRF20260110001",
    amount: 69540000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-004", amount: 69540000 }],
  },
  {
    id: 4,
    timestamp: new Date("2026-01-12T11:20:00"),
    deskripsi: "Top Up Modal Operasional",
    reff: "TRF20260112001",
    amount: 50000000,
    allocatedInvoices: [],
  },
  {
    id: 5,
    timestamp: new Date("2026-01-15T16:30:00"),
    deskripsi: "Pembayaran Paket Umroh - Multiple Agents",
    reff: "TRF20260115001",
    amount: 85000000,
    allocatedInvoices: [
      { invoiceNo: "INV-2026-007", amount: 45000000 },
      { invoiceNo: "INV-2026-008", amount: 40000000 },
    ],
  },
  {
    id: 6,
    timestamp: new Date("2026-01-18T13:45:00"),
    deskripsi: "Pembayaran Invoice INV-2026-009 - PT Madinah Journey",
    reff: "TRF20260118001",
    amount: 95000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-009", amount: 95000000 }],
  },
  {
    id: 7,
    timestamp: new Date("2026-01-20T10:00:00"),
    deskripsi: "Penerimaan Down Payment Jemaah Group A",
    reff: "TRF20260120001",
    amount: 120000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-010", amount: 120000000 }],
  },
  {
    id: 8,
    timestamp: new Date("2026-01-22T15:20:00"),
    deskripsi: "Pembayaran Invoice INV-2026-011 - CV Rahmat Haji Tour",
    reff: "TRF20260122001",
    amount: 78000000,
    allocatedInvoices: [{ invoiceNo: "INV-2026-011", amount: 78000000 }],
  },
];

export default function BuatPembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mutasiList, setMutasiList] = useState<Mutasi[]>([]);
  const [isInvoiceSearchOpen, setIsInvoiceSearchOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<{id: number; nomor: string; total: number; agenName: string} | null>(null);
  const [mutations, setMutations] = useState<MutationRecord[]>([]);
  const [isAddMutationModalOpen, setIsAddMutationModalOpen] = useState(false);

  // Load mutasi list on mount
  useEffect(() => {
    setMutasiList(initialMockMutasi);
  }, []);

  // Check for query params and pre-populate invoice
  useEffect(() => {
    const invoiceId = searchParams.get('invoiceId');
    const invoiceNumber = searchParams.get('invoiceNumber');
    const total = searchParams.get('total');

    if (invoiceId && invoiceNumber && total) {
      // Pre-populate from query params
      setSelectedInvoice({
        id: parseInt(invoiceId),
        nomor: invoiceNumber,
        total: parseFloat(total),
        agenName: '', // You can add this to query params if needed
      });
    } else {
      // No query params, show modal to select invoice
      setIsInvoiceSearchOpen(true);
    }
  }, [searchParams]);

  const handleInvoiceSelect = (invoice: {id: number; nomor: string; total: number; agenName: string}) => {
    setSelectedInvoice(invoice);
    setMutations([]);
    setIsInvoiceSearchOpen(false);
  };

  const handleAmountUsedChange = (mutationId: string, newAmountUsed: number) => {
    setMutations((prev) =>
      prev.map((m) => (m.id === mutationId ? { ...m, amountUsed: newAmountUsed } : m))
    );
  };

  const handleRemoveMutation = (mutationId: string) => {
    setMutations((prev) => prev.filter((m) => m.id !== mutationId));
  };

  const handleAddMutation = (mutation: MutationRecord) => {
    setMutations((prev) => [...prev, mutation]);
    setIsAddMutationModalOpen(false);
  };

  const handleSave = () => {
    // Here you would save the payment allocation
    // For now, just navigate back
    router.push("/aktifitas/pembayaran");
  };

  const totalPaid = mutations.reduce((sum, m) => sum + m.amountUsed, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HandCoins className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Buat Pembayaran</h1>
            <p className="text-muted-foreground">
              Alokasikan mutasi pembayaran ke invoice
            </p>
          </div>
        </div>
        <Link href="/aktifitas/pembayaran">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar
          </Button>
        </Link>
      </div>

      {/* Invoice Selection or Allocation Interface */}
      {!selectedInvoice ? (
        <Card>
          <CardHeader>
            <CardTitle>Pilih Invoice</CardTitle>
            <CardDescription>
              Pilih invoice untuk mengalokasikan mutasi pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsInvoiceSearchOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Pilih Invoice
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Alokasi Pembayaran</CardTitle>
                <CardDescription>
                  Mengalokasikan mutasi ke invoice {selectedInvoice.nomor}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedInvoice(null);
                    setMutations([]);
                  }}
                >
                  Ganti Invoice
                </Button>
                <Button onClick={handleSave} disabled={mutations.length === 0}>
                  Simpan Pembayaran
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-6">
              {/* Main Content - Left Side */}
              <div className="col-span-9 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Daftar Mutasi Terkait</h2>
                  <Button onClick={() => setIsAddMutationModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Mutasi
                  </Button>
                </div>
                <MutationTable
                  mutations={mutations}
                  onAmountUsedChange={handleAmountUsedChange}
                  onRemoveMutation={handleRemoveMutation}
                />
              </div>
              {/* Right Side - Invoice Card */}
              <div className="col-span-3">
                <InvoiceCard
                  invoiceNumber={selectedInvoice.nomor}
                  total={selectedInvoice.total}
                  totalPaid={totalPaid}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoice Search Modal */}
      <InvoiceSearchModal
        isOpen={isInvoiceSearchOpen}
        onClose={() => {
          setIsInvoiceSearchOpen(false);
          // If no invoice selected and modal closed, go back
          if (!selectedInvoice) {
            router.push("/aktifitas/pembayaran");
          }
        }}
        onSelectInvoice={handleInvoiceSelect}
      />

      {/* Add Mutation Modal */}
      {selectedInvoice && (
        <AddMutationModal
          isOpen={isAddMutationModalOpen}
          onClose={() => setIsAddMutationModalOpen(false)}
          onAddMutation={handleAddMutation}
          mutasiList={mutasiList}
          existingMutationIds={mutations.map((m) => m.mutationId)}
        />
      )}
    </div>
  );
}