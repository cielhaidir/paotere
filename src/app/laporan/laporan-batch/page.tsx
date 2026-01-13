"use client";

import { useState, useEffect } from "react";
import { BarChart3, Download, FileText, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import type { DataTableColumn } from "@/components/ui/data-table";

// Types
interface BatchFlight {
  id: number;
  nomorBatch: string;
  route: string;
  flightDate: Date;
}

interface AgentReport {
  agentId: number;
  agentName: string;
  totalPax: number;
  commission: number;
}

// Mock batch data
const mockBatches: BatchFlight[] = [
  { id: 1, nomorBatch: "BATCH-001", route: "CGK-JED", flightDate: new Date("2026-02-15") },
  { id: 2, nomorBatch: "BATCH-002", route: "SUB-JED", flightDate: new Date("2026-02-20") },
  { id: 3, nomorBatch: "BATCH-003", route: "CGK-MED", flightDate: new Date("2026-03-01") },
  { id: 4, nomorBatch: "BATCH-004", route: "BDO-JED", flightDate: new Date("2026-03-10") },
  { id: 5, nomorBatch: "BATCH-005", route: "CGK-JED", flightDate: new Date("2026-03-15") },
  { id: 6, nomorBatch: "BATCH-006", route: "UPG-JED", flightDate: new Date("2026-03-25") },
  { id: 7, nomorBatch: "BATCH-007", route: "CGK-MED", flightDate: new Date("2026-04-05") },
  { id: 8, nomorBatch: "BATCH-008", route: "SUB-MED", flightDate: new Date("2026-04-12") },
  { id: 9, nomorBatch: "BATCH-009", route: "CGK-JED", flightDate: new Date("2026-04-20") },
  { id: 10, nomorBatch: "BATCH-010", route: "JOG-JED", flightDate: new Date("2026-04-28") },
];

// Mock agent data per batch (would come from Invoice + BarcodeJemaah relations)
const mockAgentDataByBatch: { [batchId: number]: AgentReport[] } = {
  1: [
    { agentId: 1, agentName: "PT Berkah Umroh", totalPax: 25, commission: 25000000 },
    { agentId: 2, agentName: "CV Haji Mabrur", totalPax: 12, commission: 12000000 },
    { agentId: 3, agentName: "UD Nurul Huda", totalPax: 8, commission: 8000000 },
  ],
  2: [
    { agentId: 1, agentName: "PT Berkah Umroh", totalPax: 18, commission: 18000000 },
    { agentId: 4, agentName: "PT Wisata Religi", totalPax: 12, commission: 12000000 },
  ],
  3: [
    { agentId: 2, agentName: "CV Haji Mabrur", totalPax: 22, commission: 22000000 },
    { agentId: 3, agentName: "UD Nurul Huda", totalPax: 15, commission: 15000000 },
    { agentId: 5, agentName: "CV Makkah Permai", totalPax: 15, commission: 15000000 },
  ],
  4: [
    { agentId: 1, agentName: "PT Berkah Umroh", totalPax: 16, commission: 16000000 },
    { agentId: 4, agentName: "PT Wisata Religi", totalPax: 12, commission: 12000000 },
  ],
  5: [
    { agentId: 2, agentName: "CV Haji Mabrur", totalPax: 28, commission: 28000000 },
    { agentId: 3, agentName: "UD Nurul Huda", totalPax: 20, commission: 20000000 },
    { agentId: 5, agentName: "CV Makkah Permai", totalPax: 20, commission: 20000000 },
  ],
  6: [
    { agentId: 1, agentName: "PT Berkah Umroh", totalPax: 20, commission: 20000000 },
    { agentId: 6, agentName: "PT Umroh Sejahtera", totalPax: 18, commission: 18000000 },
  ],
  7: [
    { agentId: 2, agentName: "CV Haji Mabrur", totalPax: 25, commission: 25000000 },
    { agentId: 4, agentName: "PT Wisata Religi", totalPax: 18, commission: 18000000 },
    { agentId: 5, agentName: "CV Makkah Permai", totalPax: 12, commission: 12000000 },
  ],
  8: [
    { agentId: 3, agentName: "UD Nurul Huda", totalPax: 20, commission: 20000000 },
    { agentId: 6, agentName: "PT Umroh Sejahtera", totalPax: 12, commission: 12000000 },
  ],
  9: [
    { agentId: 1, agentName: "PT Berkah Umroh", totalPax: 22, commission: 22000000 },
    { agentId: 2, agentName: "CV Haji Mabrur", totalPax: 20, commission: 20000000 },
  ],
  10: [
    { agentId: 4, agentName: "PT Wisata Religi", totalPax: 15, commission: 15000000 },
    { agentId: 5, agentName: "CV Makkah Permai", totalPax: 10, commission: 10000000 },
  ],
};

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
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function LaporanBatchPage() {
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState<BatchFlight[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<number | null>(null);
  const [reportData, setReportData] = useState<AgentReport[]>([]);

  // Load batches
  useEffect(() => {
    setTimeout(() => {
      setBatches(mockBatches);
      setLoading(false);
    }, 800);
  }, []);

  // Load report data when batch is selected
  useEffect(() => {
    if (selectedBatchId !== null) {
      const data = mockAgentDataByBatch[selectedBatchId] || [];
      setReportData(data);
    } else {
      setReportData([]);
    }
  }, [selectedBatchId]);

  const selectedBatch = batches.find((b) => b.id === selectedBatchId);

  const totalPax = reportData.reduce((sum, agent) => sum + agent.totalPax, 0);
  const totalCommission = reportData.reduce((sum, agent) => sum + agent.commission, 0);

  const handleExport = () => {
    if (!selectedBatch || reportData.length === 0) return;

    // Create CSV content
    const headers = ["Nama Agen", "Total Pax/Barcode", "Komisi (Rp)"];
    const rows = reportData.map((agent) => [
      agent.agentName,
      agent.totalPax.toString(),
      agent.commission.toString(),
    ]);

    const csvContent = [
      `Laporan Batch: ${selectedBatch.nomorBatch}`,
      `Rute: ${selectedBatch.route}`,
      `Tanggal: ${formatDate(selectedBatch.flightDate)}`,
      "",
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      "",
      `Total,${totalPax},${totalCommission}`,
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan-batch-${selectedBatch.nomorBatch}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: DataTableColumn<AgentReport>[] = [
    {
      id: "agentName",
      accessorKey: "agentName",
      header: "Nama Agen",
      cell: (row) => <div className="font-semibold">{row.agentName}</div>,
    },
    {
      id: "totalPax",
      accessorKey: "totalPax",
      header: "Total Pax/Barcode",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono">{row.totalPax}</span>
        </div>
      ),
    },
    {
      id: "commission",
      accessorKey: "commission",
      header: "Komisi",
      cell: (row) => (
        <div className="font-semibold text-green-600">
          {formatCurrency(row.commission)}
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
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Laporan Batch</h1>
          <p className="text-muted-foreground">
            Laporan komisi agen berdasarkan batch penerbangan
          </p>
        </div>
      </div>

      {/* Batch Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Pilih Batch untuk Export</CardTitle>
          <CardDescription>
            Pilih batch penerbangan untuk melihat laporan komisi agen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Batch Penerbangan</label>
              <Select
                value={selectedBatchId?.toString() || ""}
                onValueChange={(value) => setSelectedBatchId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih batch..." />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{batch.nomorBatch}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="font-mono text-sm">{batch.route}</span>
                        <span className="text-muted-foreground">-</span>
                        <span className="text-sm">{formatDate(batch.flightDate)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleExport}
              disabled={!selectedBatch || reportData.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Batch Info */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informasi Batch: {selectedBatch.nomorBatch}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Rute Penerbangan</p>
                <p className="font-mono text-lg font-semibold">{selectedBatch.route}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Tanggal Penerbangan</p>
                <p className="text-lg font-semibold">{formatDate(selectedBatch.flightDate)}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Jumlah Agen</p>
                <p className="text-lg font-semibold">{reportData.length} Agen</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Cards */}
      {reportData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Jemaah
              </CardDescription>
              <CardTitle className="text-3xl">{totalPax}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Komisi
              </CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {formatCurrency(totalCommission)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Rata-rata per Agen
              </CardDescription>
              <CardTitle className="text-2xl">
                {formatCurrency(totalCommission / reportData.length)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Report Table */}
      {reportData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Detail Komisi per Agen</CardTitle>
            <CardDescription>
              Komisi dihitung berdasarkan Rp 1.000.000 per jemaah
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={reportData}
              searchPlaceholder="Cari nama agen..."
            />
          </CardContent>
        </Card>
      ) : (
        selectedBatchId && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Tidak ada data untuk batch ini</p>
                <p className="text-sm mt-2">Pilih batch lain untuk melihat laporan</p>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Empty State */}
      {!selectedBatchId && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Pilih batch untuk melihat laporan</p>
              <p className="text-sm mt-2">
                Gunakan dropdown di atas untuk memilih batch penerbangan
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}