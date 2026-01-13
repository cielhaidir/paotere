
"use client";

import { useState } from "react";
import { MutationDetailCard } from "./MutationDetailCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

// Mock data
interface Barcode {
  barcodeId: string;
  namaJemaah: string;
  alamat: string;
  paket: string;
  qty: string;
  harga: number;
}

interface Invoice {
  invoiceNumber: string;
  tanggalInvoice: string;
  jumlahBarcode: number;
  totalTerpakai: number;
  barcodes: Barcode[];
}

// Mock data untuk contoh - matches invoice page mockup data
const MOCK_MUTATION_DETAIL = {
  "1": {
    mutationId: "1",
    total: 118880000,
    totalUsed: 118880000,
    invoices: [
      {
        invoiceNumber: "INV-48-07-0001",
        tanggalInvoice: "2026-01-05",
        jumlahBarcode: 3,
        totalTerpakai: 118880000,
        barcodes: [
          {
            barcodeId: "BC-1",
            namaJemaah: "Ahmad Sudirman",
            alamat: "Jl. Mangga Dua No. 15, Jakarta Utara",
            paket: "Paket 9 Hari",
            qty: "Single",
            harga: 35000000
          },
          {
            barcodeId: "BC-11",
            namaJemaah: "Ibrahim Khalil",
            alamat: "Jl. Dago No. 234, Bandung",
            paket: "Paket 15 Hari",
            qty: "Single",
            harga: 36000000
          },
          {
            barcodeId: "BC-19",
            namaJemaah: "Khalid Umar",
            alamat: "Jl. Tebet Raya No. 67, Jakarta Selatan",
            paket: "Paket 10 Hari Milad",
            qty: "Single",
            harga: 37000000
          }
        ]
      }
    ]
  },
  "2": {
    mutationId: "2",
    total: 82140000,
    totalUsed: 82140000,
    invoices: [
      {
        invoiceNumber: "INV-48-07-0002",
        tanggalInvoice: "2026-01-08",
        jumlahBarcode: 2,
        totalTerpakai: 82140000,
        barcodes: [
          {
            barcodeId: "BC-2",
            namaJemaah: "Siti Rahmawati",
            alamat: "Jl. Sudirman No. 45, Bandung",
            paket: "Paket 15 Hari Ramadhan",
            qty: "Quad",
            harga: 45000000
          },
          {
            barcodeId: "BC-20",
            namaJemaah: "Aisha Zahra",
            alamat: "Jl. Buah Batu No. 145, Bandung",
            paket: "Paket 9 Hari",
            qty: "Triple",
            harga: 29000000
          }
        ]
      }
    ]
  }
};

export function MutationDetailPage() {
  const params = useParams<{ mutationId: string }>();
  const mutationId = params?.mutationId;
  const navigate = (path: string) => window.location.assign(path);

  // Get mutation details from mock data
  const mutationData = mutationId ? MOCK_MUTATION_DETAIL[mutationId as keyof typeof MOCK_MUTATION_DETAIL] : null;
  
  // State for accordion - set first invoice as default open
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(
    mutationData?.invoices[0]?.invoiceNumber
  );

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

  if (!mutationData) {
    return (
      <div className="min-h-screen  p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">Data Mutasi Tidak Ditemukan</h2>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/aktifitas/mutasi')} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <h1 className="text-3xl font-semibold mb-2">Detail Mutasi</h1>
          <p className="text-muted-foreground">
            Detail penggunaan mutasi bank untuk invoice terkait
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Col-9: Invoice Accordion */}
          <div className="col-span-9">
            <h2 className="text-xl font-semibold mb-4">Daftar Invoice Terkait</h2>
            <Accordion
              type="single"
              collapsible
              value={openAccordion}
              onValueChange={setOpenAccordion}
              className="space-y-4"
            >
              {mutationData.invoices.map((invoice) => (
                <AccordionItem 
                  key={invoice.invoiceNumber} 
                  value={invoice.invoiceNumber}
                  className="border rounded-lg bg-white"
                >
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-8">
                        <div>
                          <div className="text-sm text-muted-foreground">Nomor Invoice</div>
                          <div className="font-semibold">{invoice.invoiceNumber}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Tanggal</div>
                          <div>{formatDate(invoice.tanggalInvoice)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Jumlah Barcode</div>
                          <div>{invoice.jumlahBarcode} item</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Total Terpakai</div>
                          <div className="font-semibold text-blue-600">{formatCurrency(invoice.totalTerpakai)}</div>
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="mt-4">
                      <h3 className="font-semibold mb-3">Detail Barcode</h3>
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID Barcode</TableHead>
                              <TableHead>Nama Jemaah</TableHead>
                              <TableHead>Alamat</TableHead>
                              <TableHead>Paket</TableHead>
                              <TableHead>Jenis Paket</TableHead>
                              <TableHead className="text-right">Harga</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invoice.barcodes.map((barcode) => (
                              <TableRow key={barcode.barcodeId}>
                                <TableCell className="font-medium">{barcode.barcodeId}</TableCell>
                                <TableCell>{barcode.namaJemaah}</TableCell>
                                <TableCell>{barcode.alamat}</TableCell>
                                <TableCell>{barcode.paket}</TableCell>
                                <TableCell>{barcode.qty}</TableCell>
                                <TableCell className="text-right">{formatCurrency(barcode.harga)}</TableCell>
                              </TableRow>
                            ))}
                            <TableRow className="">
                              <TableCell colSpan={5} className="text-right font-semibold">
                                Subtotal:
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {formatCurrency(invoice.totalTerpakai)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Col-3: Mutation Info Card */}
          <div className="col-span-3">
            <MutationDetailCard
              mutationId={mutationData.mutationId}
              total={mutationData.total}
              totalUsed={mutationData.totalUsed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
