"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableColumn } from "@/components/ui/data-table";

// Types
interface Mutasi {
  id: number;
  timestamp: Date;
  deskripsi: string;
  reff: string;
  amount: number;
  hasInvoiceLinks: boolean;
  invoiceLinksCount: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

// Mockup Data - 7 mutation records with realistic Indonesian banking transactions
const initialMockMutasi: Mutasi[] = [
  {
    id: 1,
    timestamp: new Date("2026-01-05T10:30:00"),
    deskripsi: "Transfer masuk dari PT Berkah Umroh Indonesia - Pembayaran Invoice INV-48-07-0001",
    reff: "TRF202601050001",
    amount: 118880000,
    hasInvoiceLinks: true,
    invoiceLinksCount: 1,
    createdAt: new Date("2026-01-05T10:30:00"),
    updatedAt: new Date("2026-01-05T10:30:00"),
  },
  {
    id: 2,
    timestamp: new Date("2026-01-06T14:15:00"),
    deskripsi: "Transfer masuk dari CV Madinah Tour & Travel - Pembayaran Invoice INV-48-07-0002",
    reff: "TRF202601060001",
    amount: 82140000,
    hasInvoiceLinks: true,
    invoiceLinksCount: 1,
    createdAt: new Date("2026-01-06T14:15:00"),
    updatedAt: new Date("2026-01-06T14:15:00"),
  },
  {
    id: 3,
    timestamp: new Date("2026-01-07T09:45:00"),
    deskripsi: "Debit biaya administrasi bank bulanan",
    reff: "DBT202601070001",
    amount: -150000,
    hasInvoiceLinks: false,
    invoiceLinksCount: 0,
    createdAt: new Date("2026-01-07T09:45:00"),
    updatedAt: new Date("2026-01-07T09:45:00"),
  },
  {
    id: 4,
    timestamp: new Date("2026-01-08T11:20:00"),
    deskripsi: "Transfer masuk dari PT Nusantara Travel - Pembayaran parsial",
    reff: "TRF202601080001",
    amount: 15000000,
    hasInvoiceLinks: false,
    invoiceLinksCount: 0,
    createdAt: new Date("2026-01-08T11:20:00"),
    updatedAt: new Date("2026-01-08T11:20:00"),
  },
  {
    id: 5,
    timestamp: new Date("2026-01-10T16:30:00"),
    deskripsi: "Transfer masuk dari CV Makkah Express - Deposit untuk paket Umroh",
    reff: "TRF202601100001",
    amount: 25000000,
    hasInvoiceLinks: false,
    invoiceLinksCount: 0,
    createdAt: new Date("2026-01-10T16:30:00"),
    updatedAt: new Date("2026-01-10T16:30:00"),
  },
  {
    id: 6,
    timestamp: new Date("2026-01-11T13:00:00"),
    deskripsi: "Debit pajak penghasilan pasal 23",
    reff: "DBT202601110001",
    amount: -2500000,
    hasInvoiceLinks: false,
    invoiceLinksCount: 0,
    createdAt: new Date("2026-01-11T13:00:00"),
    updatedAt: new Date("2026-01-11T13:00:00"),
  },
  {
    id: 7,
    timestamp: new Date("2026-01-12T10:15:00"),
    deskripsi: "Transfer masuk dari PT Madinah Journey - Pelunasan invoice",
    reff: "TRF202601120001",
    amount: 40000000,
    hasInvoiceLinks: false,
    invoiceLinksCount: 0,
    createdAt: new Date("2026-01-12T10:15:00"),
    updatedAt: new Date("2026-01-12T10:15:00"),
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

const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

export default function MutasiPage() {
  const [mutasi, setMutasi] = useState<Mutasi[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setMutasi(initialMockMutasi);
      setLoading(false);
    }, 1000);
  }, []);

  const handleViewDetail = (mutation: Mutasi) => {
    // Open detail page in new tab
    window.open(`/aktifitas/mutasi/${mutation.id}`, "_blank");
  };

  const columns: DataTableColumn<Mutasi>[] = [
    {
      id: "timestamp",
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: (row) => <div className="font-medium">{formatDateTime(row.timestamp as Date)}</div>,
    },
    {
      id: "reff",
      accessorKey: "reff",
      header: "Reference",
      cell: (row) => <div className="font-mono text-sm">{row.reff}</div>,
    },
    {
      id: "deskripsi",
      accessorKey: "deskripsi",
      header: "Description",
      cell: (row) => <div className="max-w-md truncate">{row.deskripsi}</div>,
    },
    {
      id: "amount",
      accessorKey: "amount",
      header: "Amount",
      cell: (row) => {
        const amount = row.amount as number;
        return (
          <div className={`font-semibold ${amount >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatCurrency(amount)}
          </div>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => {
        const hasLinks = row.hasInvoiceLinks as boolean;
        return (
          <Badge variant={hasLinks ? "default" : "secondary"}>
            {hasLinks ? "Linked" : "Unlinked"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const mutation = row;
        const hasLinks = mutation.hasInvoiceLinks as boolean;
        
        if (!hasLinks) {
          return <div className="text-muted-foreground text-sm">-</div>;
        }

        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewDetail(mutation)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
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
        <ArrowLeftRight className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Mutasi Bank</h1>
          <p className="text-muted-foreground">
            View bank mutation records and their invoice linkages
          </p>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mutation Records</CardTitle>
          <CardDescription>
            All bank mutation transactions ({mutasi.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mutasi}
            searchPlaceholder="Search by reference or description..."
          />
        </CardContent>
      </Card>
    </div>
  );
}