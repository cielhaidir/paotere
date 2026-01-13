"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Printer,
  Users,
  DollarSign,
  Calendar,
  ChevronDown,
  ChevronUp,
  Barcode,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox, type ComboboxOption } from "@/components/ui/combobox";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";
import { generateHijriahInvoiceNumber } from "@/lib/hijriah-utils";

// Types
type InvoiceStatus = "DRAFT" | "PAID" | "OVERDUE";

interface Invoice {
  id: number;
  nomor: string;
  tanggal: Date;
  agenId: number;
  agenNama: string;
  taxPercent: number;
  diskon: number;
  subtotal: number;
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  jumlahJemaah: number;
  jemaahIds: number[];
  amountPaid: number;
  [key: string]: unknown;
}

interface Agen {
  id: number;
  nama: string;
}

interface Jemaah {
  id: number;
  nama: string;
  ktp: string;
  alamat: string;
  agenId: number;
  agenNama: string;
  produkId: number;
  produkNama: string;
  paketId: number;
  paketNama: string;
  tingkat: string;
  tanggalKeberangkatan: Date;
  harga: number;
  deskripsi?: string;
  oldBarcode?: string;
  invoiceId?: number;
  invoiceNomor?: string;
  [key: string]: unknown;
}

// Validation Schema
const invoiceFormSchema = z.object({
  nomor: z.string().min(5, "Nomor invoice minimal 5 karakter"),
  tanggal: z.date({ required_error: "Tanggal harus diisi" }),
  agenId: z.number({ required_error: "Agen harus dipilih" }).min(1, "Agen harus dipilih"),
  taxPercent: z.number().min(0, "Tax percent tidak boleh negatif").max(100, "Tax percent maksimal 100%"),
  diskon: z.number().min(0, "Diskon tidak boleh negatif"),
  status: z.enum(["DRAFT", "PAID", "OVERDUE"], {
    required_error: "Status harus dipilih",
  }),
  dueDate: z.date({ required_error: "Due date harus diisi" }),
  jemaahIds: z.array(z.number()).min(1, "Minimal 1 jemaah harus dipilih"),
});

type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

// Mockup Data
const mockAgens: Agen[] = [
  { id: 1, nama: "PT Berkah Umroh Indonesia" },
  { id: 2, nama: "CV Rahmat Haji Tour" },
  { id: 3, nama: "PT Nusantara Travel" },
  { id: 4, nama: "CV Makkah Express" },
  { id: 5, nama: "PT Madinah Journey" },
];

const initialMockJemaah: Jemaah[] = [
  {
    id: 1,
    nama: "Ahmad Sudirman",
    ktp: "3175012345671234",
    alamat: "Jl. Mangga Dua No. 15, Jakarta Utara",
    agenId: 1,
    agenNama: "PT Berkah Umroh Indonesia",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 1,
    paketNama: "Paket 9 Hari",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-03-15"),
    harga: 35000000,
    deskripsi: "Jamaah dengan kebutuhan khusus kursi roda",
    oldBarcode: "UM-2025-001",
    invoiceId: 1,
    invoiceNomor: "INV-48-07-0001",
  },
  {
    id: 2,
    nama: "Siti Rahmawati",
    ktp: "3275023456782345",
    alamat: "Jl. Sudirman No. 45, Bandung",
    agenId: 2,
    agenNama: "CV Madinah Tour & Travel",
    produkId: 3,
    produkNama: "Umroh Ramadhan",
    paketId: 7,
    paketNama: "Paket 15 Hari Ramadhan",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-04-20"),
    harga: 45000000,
    deskripsi: "",
    oldBarcode: "",
    invoiceId: 2,
    invoiceNomor: "INV-48-07-0002",
  },
  {
    id: 3,
    nama: "Muhammad Rizki",
    ktp: "3374034567893456",
    alamat: "Jl. Pemuda No. 88, Semarang",
    agenId: 3,
    agenNama: "PT Arafah Wisata Religi",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 2,
    paketNama: "Paket 12 Hari",
    tingkat: "Triple",
    tanggalKeberangkatan: new Date("2026-05-10"),
    harga: 32000000,
    deskripsi: "Perjalanan pertama",
    oldBarcode: "UM-2025-002",
  },
  {
    id: 4,
    nama: "Fatimah Zahra",
    ktp: "3573045678904567",
    alamat: "Jl. Diponegoro No. 23, Surabaya",
    agenId: 4,
    agenNama: "Zahira Tour",
    produkId: 2,
    produkNama: "Umroh Plus Turki",
    paketId: 4,
    paketNama: "Paket 14 Hari Istanbul",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-06-05"),
    harga: 42000000,
    deskripsi: "Termasuk wisata Istanbul",
    oldBarcode: "",
  },
  {
    id: 5,
    nama: "Abdullah Rahman",
    ktp: "3671056789015678",
    alamat: "Jl. Gatot Subroto No. 67, Jakarta Selatan",
    agenId: 5,
    agenNama: "Al Hijaz Travel",
    produkId: 4,
    produkNama: "Haji Reguler",
    paketId: 8,
    paketNama: "Paket 40 Hari",
    tingkat: "Double",
    tanggalKeberangkatan: new Date("2026-07-15"),
    harga: 65000000,
    deskripsi: "Haji pertama kali",
    oldBarcode: "HJ-2025-001",
  },
  {
    id: 6,
    nama: "Khadijah Aisyah",
    ktp: "3275067890126789",
    alamat: "Jl. Cihampelas No. 102, Bandung",
    agenId: 6,
    agenNama: "Nurul Iman Travel",
    produkId: 9,
    produkNama: "Umroh Keluarga",
    paketId: 14,
    paketNama: "Paket 14 Hari Keluarga",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-08-20"),
    harga: 38000000,
    deskripsi: "Bersama 2 anak",
    oldBarcode: "",
  },
  {
    id: 7,
    nama: "Umar Faruq",
    ktp: "3374078901237890",
    alamat: "Jl. Pandanaran No. 156, Semarang",
    agenId: 7,
    agenNama: "Safar Umroh",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 1,
    paketNama: "Paket 9 Hari",
    tingkat: "Triple",
    tanggalKeberangkatan: new Date("2026-09-12"),
    harga: 30000000,
    deskripsi: "",
    oldBarcode: "UM-2025-003",
  },
  {
    id: 8,
    nama: "Aminah Putri",
    ktp: "3573089012348901",
    alamat: "Jl. Tunjungan No. 78, Surabaya",
    agenId: 8,
    agenNama: "Mecca Journey",
    produkId: 10,
    produkNama: "Umroh VIP",
    paketId: 15,
    paketNama: "Paket 10 Hari VIP",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-10-05"),
    harga: 55000000,
    deskripsi: "VIP Service penuh",
    oldBarcode: "",
  },
  {
    id: 9,
    nama: "Yusuf Ibrahim",
    ktp: "3671090123459012",
    alamat: "Jl. Kuningan No. 34, Jakarta Selatan",
    agenId: 9,
    agenNama: "Hajar Aswad Travel",
    produkId: 3,
    produkNama: "Umroh Ramadhan",
    paketId: 6,
    paketNama: "Paket 12 Hari Ramadhan",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-11-18"),
    harga: 40000000,
    deskripsi: "Ramadhan spesial",
    oldBarcode: "UM-2025-004",
  },
  {
    id: 10,
    nama: "Maryam Salwa",
    ktp: "3175101234560123",
    alamat: "Jl. Kemang Raya No. 90, Jakarta Selatan",
    agenId: 10,
    agenNama: "Ar Rahman Tours",
    produkId: 6,
    produkNama: "Umroh Plus Dubai",
    paketId: 11,
    paketNama: "Paket 12 Hari Dubai",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-12-10"),
    harga: 48000000,
    deskripsi: "Transit Dubai 2 hari",
    oldBarcode: "",
  },
  {
    id: 11,
    nama: "Ibrahim Khalil",
    ktp: "3275112345671234",
    alamat: "Jl. Dago No. 234, Bandung",
    agenId: 11,
    agenNama: "Tawaf Travel Service",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 3,
    paketNama: "Paket 15 Hari",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-03-25"),
    harga: 36000000,
    deskripsi: "Extra ziarah",
    oldBarcode: "UM-2025-005",
  },
  {
    id: 12,
    nama: "Zainab Husna",
    ktp: "3374123456782345",
    alamat: "Jl. Pahlawan No. 45, Semarang",
    agenId: 12,
    agenNama: "Baitul Makmur",
    produkId: 8,
    produkNama: "Umroh Backpacker",
    paketId: 13,
    paketNama: "Paket 7 Hari Hemat",
    tingkat: "Double",
    tanggalKeberangkatan: new Date("2026-04-08"),
    harga: 22000000,
    deskripsi: "Budget friendly",
    oldBarcode: "",
  },
  {
    id: 13,
    nama: "Hassan Ali",
    ktp: "3573134567893456",
    alamat: "Jl. Raya Darmo No. 123, Surabaya",
    agenId: 13,
    agenNama: "Sahabat Haji",
    produkId: 5,
    produkNama: "Haji Plus",
    paketId: 10,
    paketNama: "Paket ONH Plus",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-07-20"),
    harga: 95000000,
    deskripsi: "Haji Plus dengan fasilitas lengkap",
    oldBarcode: "HJ-2025-002",
  },
  {
    id: 14,
    nama: "Ruqayyah Laila",
    ktp: "3671145678904567",
    alamat: "Jl. Senopati No. 56, Jakarta Selatan",
    agenId: 14,
    agenNama: "Multazam Tour",
    produkId: 11,
    produkNama: "Umroh Plus Mesir",
    paketId: 16,
    paketNama: "Paket 16 Hari Mesir",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-05-22"),
    harga: 44000000,
    deskripsi: "Wisata piramida termasuk",
    oldBarcode: "",
  },
  {
    id: 15,
    nama: "Ali Hasan",
    ktp: "3275156789015678",
    alamat: "Jl. Setiabudhi No. 178, Bandung",
    agenId: 15,
    agenNama: "Rohman Travel",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 2,
    paketNama: "Paket 12 Hari",
    tingkat: "Triple",
    tanggalKeberangkatan: new Date("2026-06-14"),
    harga: 31000000,
    deskripsi: "",
    oldBarcode: "UM-2025-006",
  },
  {
    id: 16,
    nama: "Hafsa Fatimah",
    ktp: "3374167890126789",
    alamat: "Jl. Gajah Mada No. 89, Semarang",
    agenId: 16,
    agenNama: "Marwa Express",
    produkId: 12,
    produkNama: "Umroh Akhir Tahun",
    paketId: 17,
    paketNama: "Paket 12 Hari Akhir Tahun",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-12-28"),
    harga: 46000000,
    deskripsi: "Tahun baru di Mekkah",
    oldBarcode: "",
  },
  {
    id: 17,
    nama: "Usman Affan",
    ktp: "3573178901237890",
    alamat: "Jl. Basuki Rahmat No. 234, Surabaya",
    agenId: 17,
    agenNama: "Safa Travel Group",
    produkId: 13,
    produkNama: "Umroh Murah",
    paketId: 18,
    paketNama: "Paket 9 Hari Ekonomis",
    tingkat: "Double",
    tanggalKeberangkatan: new Date("2026-03-30"),
    harga: 24000000,
    deskripsi: "Paket hemat berkualitas",
    oldBarcode: "UM-2025-007",
  },
  {
    id: 18,
    nama: "Safiya Hanan",
    ktp: "3671189012348901",
    alamat: "Jl. Dharmawangsa No. 45, Jakarta Selatan",
    agenId: 18,
    agenNama: "Zamzam Holidays",
    produkId: 7,
    produkNama: "Umroh Khusus",
    paketId: 12,
    paketNama: "Paket 10 Hari Khusus",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-08-15"),
    harga: 52000000,
    deskripsi: "Pembimbing khusus ustadz",
    oldBarcode: "",
  },
  {
    id: 19,
    nama: "Khalid Umar",
    ktp: "3175190123459012",
    alamat: "Jl. Tebet Raya No. 67, Jakarta Selatan",
    agenId: 1,
    agenNama: "PT Berkah Umroh Indonesia",
    produkId: 15,
    produkNama: "Umroh Milad",
    paketId: 20,
    paketNama: "Paket 10 Hari Milad",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-09-25"),
    harga: 37000000,
    deskripsi: "Spesial Maulid Nabi",
    oldBarcode: "",
    invoiceId: 1,
    invoiceNomor: "INV-48-07-0001",
  },
  {
    id: 20,
    nama: "Aisha Zahra",
    ktp: "3275201234560123",
    alamat: "Jl. Buah Batu No. 145, Bandung",
    agenId: 2,
    agenNama: "CV Madinah Tour & Travel",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 1,
    paketNama: "Paket 9 Hari",
    tingkat: "Triple",
    tanggalKeberangkatan: new Date("2026-10-18"),
    harga: 29000000,
    deskripsi: "",
    oldBarcode: "UM-2025-008",
    invoiceId: 2,
    invoiceNomor: "INV-48-07-0002",
  },
  {
    id: 21,
    nama: "Hamza Malik",
    ktp: "3374212345671234",
    alamat: "Jl. Imam Bonjol No. 78, Semarang",
    agenId: 3,
    agenNama: "PT Arafah Wisata Religi",
    produkId: 14,
    produkNama: "Haji Furoda",
    paketId: 19,
    paketNama: "Paket 45 Hari Furoda",
    tingkat: "Triple",
    tanggalKeberangkatan: new Date("2026-07-08"),
    harga: 72000000,
    deskripsi: "Haji dengan fasilitas memadai",
    oldBarcode: "HJ-2025-003",
  },
  {
    id: 22,
    nama: "Nadia Salsabila",
    ktp: "3573223456782345",
    alamat: "Jl. Ahmad Yani No. 234, Surabaya",
    agenId: 4,
    agenNama: "Zahira Tour",
    produkId: 2,
    produkNama: "Umroh Plus Turki",
    paketId: 5,
    paketNama: "Paket 16 Hari Cappadocia",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-11-05"),
    harga: 49000000,
    deskripsi: "Naik balon udara Cappadocia",
    oldBarcode: "",
  },
  {
    id: 23,
    nama: "Bilal Muadz",
    ktp: "3671234567893456",
    alamat: "Jl. Pejaten No. 123, Jakarta Selatan",
    agenId: 5,
    agenNama: "Al Hijaz Travel",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 3,
    paketNama: "Paket 15 Hari",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-04-16"),
    harga: 35500000,
    deskripsi: "Tambahan ziarah Taif",
    oldBarcode: "UM-2025-009",
  },
  {
    id: 24,
    nama: "Raihan Qasim",
    ktp: "3275245678904567",
    alamat: "Jl. Pajajaran No. 89, Bandung",
    agenId: 6,
    agenNama: "Nurul Iman Travel",
    produkId: 3,
    produkNama: "Umroh Ramadhan",
    paketId: 7,
    paketNama: "Paket 15 Hari Ramadhan",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2027-03-25"),
    harga: 47000000,
    deskripsi: "Ramadhan 1448 H",
    oldBarcode: "",
  },
  {
    id: 25,
    nama: "Layla Huda",
    ktp: "3374256789015678",
    alamat: "Jl. MT Haryono No. 156, Semarang",
    agenId: 7,
    agenNama: "Safar Umroh",
    produkId: 9,
    produkNama: "Umroh Keluarga",
    paketId: 14,
    paketNama: "Paket 14 Hari Keluarga",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-05-28"),
    harga: 39000000,
    deskripsi: "Dengan orang tua",
    oldBarcode: "",
  },
  {
    id: 26,
    nama: "Tariq Ziyad",
    ktp: "3573267890126789",
    alamat: "Jl. Mayjen Sungkono No. 45, Surabaya",
    agenId: 8,
    agenNama: "Mecca Journey",
    produkId: 10,
    produkNama: "Umroh VIP",
    paketId: 15,
    paketNama: "Paket 10 Hari VIP",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-06-20"),
    harga: 56000000,
    deskripsi: "Kamar triple private",
    oldBarcode: "",
  },
  {
    id: 27,
    nama: "Salma Azizah",
    ktp: "3671278901237890",
    alamat: "Jl. Panglima Polim No. 78, Jakarta Selatan",
    agenId: 9,
    agenNama: "Hajar Aswad Travel",
    produkId: 6,
    produkNama: "Umroh Plus Dubai",
    paketId: 11,
    paketNama: "Paket 12 Hari Dubai",
    tingkat: "Single",
    tanggalKeberangkatan: new Date("2026-09-10"),
    harga: 47500000,
    deskripsi: "Shopping di Dubai Mall",
    oldBarcode: "UM-2025-010",
  },
  {
    id: 28,
    nama: "Harun Rashid",
    ktp: "3175289012348901",
    alamat: "Jl. Ampera Raya No. 234, Jakarta Selatan",
    agenId: 10,
    agenNama: "Ar Rahman Tours",
    produkId: 8,
    produkNama: "Umroh Backpacker",
    paketId: 13,
    paketNama: "Paket 7 Hari Hemat",
    tingkat: "Double",
    tanggalKeberangkatan: new Date("2026-10-22"),
    harga: 23000000,
    deskripsi: "Backpacker Muslim",
    oldBarcode: "",
  },
  {
    id: 29,
    nama: "Mariam Khadijah",
    ktp: "3275290123459012",
    alamat: "Jl. Ciumbuleuit No. 67, Bandung",
    agenId: 11,
    agenNama: "Tawaf Travel Service",
    produkId: 11,
    produkNama: "Umroh Plus Mesir",
    paketId: 16,
    paketNama: "Paket 16 Hari Mesir",
    tingkat: "Quad",
    tanggalKeberangkatan: new Date("2026-11-12"),
    harga: 45500000,
    deskripsi: "Museum Kairo tour",
    oldBarcode: "",
  },
  {
    id: 30,
    nama: "Zaid Muhammad",
    ktp: "3374301234560123",
    alamat: "Jl. Sisingamangaraja No. 123, Semarang",
    agenId: 12,
    agenNama: "Baitul Makmur",
    produkId: 1,
    produkNama: "Umroh Reguler",
    paketId: 2,
    paketNama: "Paket 12 Hari",
    tingkat: "Triple",
    tanggalKeberangkatan: new Date("2026-12-15"),
    harga: 32500000,
    deskripsi: "",
    oldBarcode: "UM-2025-011",
  },
];

const initialMockInvoices: Invoice[] = [
  {
    id: 1,
    nomor: "INV-48-07-0001",
    tanggal: new Date("2026-01-05"),
    agenId: 1,
    agenNama: "PT Berkah Umroh Indonesia",
    taxPercent: 11,
    diskon: 1000000,
    subtotal: 108000000, // 35M + 36M + 37M
    total: 118880000, // 108M + 11.88M (tax) - 1M (discount)
    status: "PAID",
    dueDate: new Date("2026-02-05"),
    jumlahJemaah: 3,
    jemaahIds: [1, 11, 19], // All from agen 1: Ahmad Sudirman, Ibrahim Khalil, Khalid Umar
    amountPaid: 118880000,
  },
  {
    id: 2,
    nomor: "INV-48-07-0002",
    tanggal: new Date("2026-01-08"),
    agenId: 2,
    agenNama: "CV Madinah Tour & Travel",
    taxPercent: 11,
    diskon: 0,
    subtotal: 74000000, // 45M + 29M
    total: 82140000, // 74M + 8.14M (tax)
    status: "DRAFT",
    dueDate: new Date("2026-02-08"),
    jumlahJemaah: 2,
    jemaahIds: [2, 20], // All from agen 2: Siti Rahmawati, Aisha Zahra
    amountPaid: 0,
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

const generateInvoiceNumber = (existingInvoices: Invoice[]): string => {
  const currentYear = new Date().getFullYear();
  const invoicesThisYear = existingInvoices.filter((inv) =>
    inv.nomor.startsWith(`INV-${currentYear}`)
  );
  const nextNumber = invoicesThisYear.length + 1;
  return `INV-${currentYear}-${String(nextNumber).padStart(3, "0")}`;
};

export default function InvoicePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [jemaahList, setJemaahList] = useState<Jemaah[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [viewDialog, setViewDialog] = useState<{ open: boolean; invoice: Invoice | null }>({
    open: false,
    invoice: null,
  });
  const [selectedJemaahIds, setSelectedJemaahIds] = useState<number[]>([]);
  const [calculatedValues, setCalculatedValues] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [tempSelectedBarcodeIds, setTempSelectedBarcodeIds] = useState<number[]>([]);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      nomor: "",
      tanggal: new Date(),
      agenId: 0,
      taxPercent: 11,
      diskon: 0,
      status: "DRAFT",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      jemaahIds: [],
    },
  });

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setInvoices(initialMockInvoices);
      setJemaahList(initialMockJemaah);
      setLoading(false);
    }, 1000);
  }, []);

  // Auto-generate invoice number using Hijriah date
  useEffect(() => {
    if (!editingInvoice && invoices.length >= 0) {
      const hijriahNumber = generateHijriahInvoiceNumber(
        invoices.map(inv => ({ nomor: inv.nomor }))
      );
      form.setValue("nomor", hijriahNumber);
    }
  }, [invoices, editingInvoice, form]);

  // Calculate totals when jemaah selection or tax/discount changes
  useEffect(() => {
    const taxPercent = form.watch("taxPercent") || 0;
    const diskon = form.watch("diskon") || 0;
    
    const subtotal = jemaahList
      .filter((j) => selectedJemaahIds.includes(j.id))
      .reduce((sum, j) => sum + j.harga, 0);
    
    const tax = subtotal * (taxPercent / 100);
    const total = subtotal + tax - diskon;

    setCalculatedValues({ subtotal, tax, total });
  }, [selectedJemaahIds, form.watch("taxPercent"), form.watch("diskon"), jemaahList]);

  const getAvailableJemaah = (agenId: number): Jemaah[] => {
    return jemaahList.filter(
      (j) => j.agenId === agenId && (!j.invoiceId || (editingInvoice && editingInvoice.jemaahIds.includes(j.id)))
    );
  };

  const handleRemoveBarcode = (jemaahId: number) => {
    setSelectedJemaahIds((prev) => prev.filter((id) => id !== jemaahId));
    form.setValue("jemaahIds", selectedJemaahIds.filter((id) => id !== jemaahId));
  };

  const onSubmit = (data: InvoiceFormValues) => {
    const agen = mockAgens.find((a) => a.id === data.agenId);

    const subtotal = jemaahList
      .filter((j) => selectedJemaahIds.includes(j.id))
      .reduce((sum, j) => sum + j.harga, 0);
    
    const tax = subtotal * (data.taxPercent / 100);
    const total = subtotal + tax - data.diskon;

    if (editingInvoice) {
      // Update existing invoice
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === editingInvoice.id
            ? {
                ...inv,
                ...data,
                agenNama: agen?.nama || "",
                subtotal,
                total,
                jumlahJemaah: selectedJemaahIds.length,
                jemaahIds: selectedJemaahIds,
              }
            : inv
        )
      );

      // Update jemaah invoiceId and invoiceNomor
      setJemaahList((prev) =>
        prev.map((j) => {
          // Remove invoice assignment for jemaah no longer in this invoice
          if (editingInvoice.jemaahIds.includes(j.id) && !selectedJemaahIds.includes(j.id)) {
            return { ...j, invoiceId: undefined, invoiceNomor: undefined };
          }
          // Add invoice assignment for newly selected jemaah
          if (selectedJemaahIds.includes(j.id)) {
            return { ...j, invoiceId: editingInvoice.id, invoiceNomor: data.nomor };
          }
          return j;
        })
      );

      setEditingInvoice(null);
    } else {
      // Create new invoice
      const newInvoice: Invoice = {
        id: Math.max(...invoices.map((i) => i.id), 0) + 1,
        nomor: data.nomor,
        tanggal: data.tanggal,
        agenId: data.agenId,
        agenNama: agen?.nama || "",
        taxPercent: data.taxPercent,
        diskon: data.diskon,
        subtotal,
        total,
        status: data.status,
        dueDate: data.dueDate,
        jumlahJemaah: selectedJemaahIds.length,
        jemaahIds: selectedJemaahIds,
        amountPaid: data.status === "PAID" ? total : 0,
      };

      setInvoices((prev) => [...prev, newInvoice]);

      // Set invoiceId and invoiceNomor on selected jemaah
      setJemaahList((prev) =>
        prev.map((j) =>
          selectedJemaahIds.includes(j.id)
            ? { ...j, invoiceId: newInvoice.id, invoiceNomor: newInvoice.nomor }
            : j
        )
      );
    }

    // Reset form with new auto-generated invoice number
    form.reset({
      nomor: generateHijriahInvoiceNumber(
        invoices.map(inv => ({ nomor: inv.nomor }))
      ),
      tanggal: new Date(),
      agenId: 0,
      taxPercent: 11,
      diskon: 0,
      status: "DRAFT",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      jemaahIds: [],
    });
    setIsFormOpen(false);
    setSelectedJemaahIds([]);
  };

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
    form.reset({
      nomor: invoice.nomor,
      tanggal: invoice.tanggal,
      agenId: invoice.agenId,
      taxPercent: invoice.taxPercent,
      diskon: invoice.diskon,
      status: invoice.status,
      dueDate: invoice.dueDate,
      jemaahIds: invoice.jemaahIds,
    });
    setSelectedJemaahIds(invoice.jemaahIds);
    setIsFormOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingInvoice(null);
    form.reset({
      nomor: generateHijriahInvoiceNumber(
        invoices.map(inv => ({ nomor: inv.nomor }))
      ),
      tanggal: new Date(),
      agenId: 0,
      taxPercent: 11,
      diskon: 0,
      status: "DRAFT",
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      jemaahIds: [],
    });
    setSelectedJemaahIds([]);
  };

  const handleDelete = (invoice: Invoice) => {
    setDeleteDialog({ open: true, invoice });
  };

  const confirmDelete = () => {
    if (deleteDialog.invoice) {
      // Clear invoiceId and invoiceNomor from jemaah
      setJemaahList((prev) =>
        prev.map((j) =>
          deleteDialog.invoice!.jemaahIds.includes(j.id)
            ? { ...j, invoiceId: undefined, invoiceNomor: undefined }
            : j
        )
      );

      // Remove invoice
      setInvoices((prev) => prev.filter((inv) => inv.id !== deleteDialog.invoice!.id));
      setDeleteDialog({ open: false, invoice: null });
    }
  };

  const handleView = (invoice: Invoice) => {
    setViewDialog({ open: true, invoice });
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    const variants: Record<InvoiceStatus, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      PAID: { variant: "default", className: "bg-green-500 hover:bg-green-600" },
      DRAFT: { variant: "secondary", className: "bg-yellow-500 hover:bg-yellow-600" },
      OVERDUE: { variant: "destructive", className: "" },
    };
    return variants[status];
  };

  const columns: DataTableColumn<Invoice>[] = [
    {
      id: "nomor",
      accessorKey: "nomor",
      header: "Nomor",
      cell: (row) => <div className="font-medium">{row.nomor}</div>,
    },
    {
      id: "tanggal",
      accessorKey: "tanggal",
      header: "Tanggal",
      cell: (row) => formatDate(row.tanggal as Date),
    },
    {
      id: "agenNama",
      accessorKey: "agenNama",
      header: "Agen",
    },
    {
      id: "jumlahJemaah",
      accessorKey: "jumlahJemaah",
      header: "Jumlah Jemaah",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {row.jumlahJemaah}
        </div>
      ),
    },
    {
      id: "subtotal",
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: (row) => formatCurrency(row.subtotal as number),
    },
    // {
    //   id: "tax",
    //   header: "Tax",
    //   cell: (row) => {
    //     const subtotal = row.subtotal as number;
    //     const taxPercent = row.taxPercent as number;
    //     const tax = subtotal * (taxPercent / 100);
    //     return (
    //       <div className="text-sm">
    //         {formatCurrency(tax)}
    //         <span className="text-muted-foreground ml-1">({taxPercent}%)</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: "diskon",
    //   accessorKey: "diskon",
    //   header: "Diskon",
    //   cell: (row) => formatCurrency(row.diskon as number),
    // },
    {
      id: "total",
      accessorKey: "total",
      header: "Total",
      cell: (row) => (
        <div className="font-semibold">{formatCurrency(row.total as number)}</div>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (row) => {
        const status = row.status as InvoiceStatus;
        const badge = getStatusBadge(status);
        return (
          <Badge variant={badge.variant} className={badge.className}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "dueDate",
      accessorKey: "dueDate",
      header: "Due Date",
      cell: (row) => formatDate(row.dueDate as Date),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const invoice = row;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(invoice)}
              title="Lihat Detail"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(invoice)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(invoice)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alert("Fungsi cetak akan segera tersedia")}
              title="Cetak"
            >
              <Printer className="h-4 w-4" />
            </Button>
          </div>
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

  const selectedAgenId = form.watch("agenId");
  const availableJemaah = selectedAgenId ? getAvailableJemaah(selectedAgenId) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Invoice</h1>
          <p className="text-muted-foreground">
            Manajemen Invoice 
          </p>
        </div>
      </div>

      {/* Create/Edit Form */}
      <Card>
        <CardHeader
          className="cursor-pointer"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {editingInvoice ? "Edit Invoice" : "Buat Invoice Baru"}
              </CardTitle>
              <CardDescription>
                {editingInvoice
                  ? "Perbarui detail invoice"
                  : "Isi formulir untuk membuat invoice baru"}
              </CardDescription>
            </div>
            {isFormOpen ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </div>
        </CardHeader>
        {isFormOpen && (
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Row 1: Nomor, Tanggal, Agen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="nomor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Invoice</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="INV-48-07-0001"
                            disabled
                            className="bg-muted"
                          />
                        </FormControl>
                        <FormDescription>
                          Nomor otomatis berdasarkan tanggal Hijriah
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tanggal"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Tanggal Invoice</FormLabel>
                        <Input
                          type="date"
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agenId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agen</FormLabel>
                        <FormControl>
                          <Combobox
                            options={mockAgens.map((agen) => ({
                              value: agen.id.toString(),
                              label: agen.nama,
                            }))}
                            value={field.value?.toString() || ""}
                            onValueChange={(value) => {
                              field.onChange(parseInt(value));
                              setSelectedJemaahIds([]);
                            }}
                            placeholder="Pilih agen"
                            searchPlaceholder="Cari agen..."
                            emptyText="Agen tidak ditemukan"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Tax, Diskon, Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="taxPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Percent (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="diskon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Diskon (IDR)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRAFT">DRAFT</SelectItem>
                            <SelectItem value="PAID">PAID</SelectItem>
                            <SelectItem value="OVERDUE">OVERDUE</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Input
                          type="date"
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                          onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Add Barcode Button */}
                {selectedAgenId > 0 && (
                  <div className="col-span-full">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setTempSelectedBarcodeIds(selectedJemaahIds);
                        setBarcodeModalOpen(true);
                      }}
                      className="w-full gap-2"
                    >
                      <Barcode className="h-4 w-4" />
                      Tambah Barcode ({selectedJemaahIds.length} dipilih)
                    </Button>
                  </div>
                )}

                {/* Selected Barcodes Summary */}
                {selectedJemaahIds.length > 0 && (
                  <div className="col-span-full">
                    <Card className="bg-muted/50">
                      <CardHeader>
                        <CardTitle className="text-base">Barcode Terpilih</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {jemaahList
                            .filter((j) => selectedJemaahIds.includes(j.id))
                            .map((jemaah) => (
                              <div
                                key={jemaah.id}
                                className="flex justify-between items-center p-2 border rounded group hover:border-red-300"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{jemaah.nama}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {jemaah.produkNama} - {jemaah.paketNama}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold">
                                    {formatCurrency(jemaah.harga)}
                                  </span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleRemoveBarcode(jemaah.id)}
                                    title="Hapus barcode"
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Calculation Summary */}
                {selectedJemaahIds.length > 0 && (
                  <Card className="bg-muted/50">
                    <CardHeader>
                      <CardTitle className="text-lg">Ringkasan Perhitungan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal ({selectedJemaahIds.length} jemaah):</span>
                        <span className="font-semibold">
                          {formatCurrency(calculatedValues.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax ({form.watch("taxPercent")}%):</span>
                        <span className="font-semibold">
                          {formatCurrency(calculatedValues.tax)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Diskon:</span>
                        <span className="font-semibold text-red-600">
                          -{formatCurrency(form.watch("diskon") || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-bold">Total:</span>
                        <span className="font-bold text-lg text-primary">
                          {formatCurrency(calculatedValues.total)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="gap-2">
                    {editingInvoice ? (
                      <>
                        <Pencil className="h-4 w-4" />
                        Perbarui Invoice
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Buat Invoice
                      </>
                    )}
                  </Button>
                  {editingInvoice && (
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

      {/* Barcode Selection Modal */}
      <Dialog open={barcodeModalOpen} onOpenChange={setBarcodeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Barcode className="h-5 w-5" />
              Pilih Barcode
            </DialogTitle>
            <DialogDescription>
              Pilih barcode jemaah untuk ditambahkan ke invoice ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Select All / Clear All buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const allAvailable = availableJemaah.map((j) => j.id);
                  setTempSelectedBarcodeIds(allAvailable);
                }}
              >
                Pilih Semua
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTempSelectedBarcodeIds([])}
              >
                Hapus Semua
              </Button>
            </div>

            {/* Barcode list */}
            <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
              {availableJemaah.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Tidak ada barcode tersedia untuk agen ini
                </div>
              ) : (
                availableJemaah.map((jemaah) => (
                  <div
                    key={jemaah.id}
                    className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                    onClick={() => {
                      setTempSelectedBarcodeIds((prev) =>
                        prev.includes(jemaah.id)
                          ? prev.filter((id) => id !== jemaah.id)
                          : [...prev, jemaah.id]
                      );
                    }}
                  >
                    <Checkbox
                      checked={tempSelectedBarcodeIds.includes(jemaah.id)}
                      onCheckedChange={(checked) => {
                        setTempSelectedBarcodeIds((prev) =>
                          checked
                            ? [...prev, jemaah.id]
                            : prev.filter((id) => id !== jemaah.id)
                        );
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{jemaah.nama}</p>
                      <p className="text-sm text-muted-foreground">
                        {jemaah.produkNama} - {jemaah.paketNama}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(jemaah.harga)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setBarcodeModalOpen(false);
                setTempSelectedBarcodeIds([]);
              }}
            >
              Batal
            </Button>
            <Button
              onClick={() => {
                setSelectedJemaahIds(tempSelectedBarcodeIds);
                form.setValue("jemaahIds", tempSelectedBarcodeIds);
                setBarcodeModalOpen(false);
              }}
            >
              Tambah Terpilih ({tempSelectedBarcodeIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
          <CardDescription>
            Lihat dan kelola semua invoice ({invoices.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={invoices}
            searchPlaceholder="Cari berdasarkan nomor invoice..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, invoice: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus invoice{" "}
              <span className="font-semibold">{deleteDialog.invoice?.nomor}</span>?
              {deleteDialog.invoice && deleteDialog.invoice.amountPaid > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded text-yellow-800 dark:text-yellow-200">
                  Peringatan: Invoice ini memiliki pembayaran sebesar{" "}
                  {formatCurrency(deleteDialog.invoice.amountPaid)}
                </div>
              )}
              {deleteDialog.invoice && deleteDialog.invoice.jumlahJemaah > 0 && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-blue-800 dark:text-blue-200">
                  Invoice ini memiliki {deleteDialog.invoice.jumlahJemaah} jemaah yang ditugaskan.
                  Mereka akan dilepaskan.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, invoice: null })}
            >
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={(open) => setViewDialog({ open, invoice: null })}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Detail Invoice
            </DialogTitle>
          </DialogHeader>
          {viewDialog.invoice && (
            <div className="space-y-4">
              {/* Invoice Header */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-muted-foreground">Nomor Invoice</Label>
                  <p className="font-semibold">{viewDialog.invoice.nomor}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    <Badge
                      variant={getStatusBadge(viewDialog.invoice.status).variant}
                      className={getStatusBadge(viewDialog.invoice.status).className}
                    >
                      {viewDialog.invoice.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Tanggal</Label>
                  <p>{formatDate(viewDialog.invoice.tanggal)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Due Date</Label>
                  <p>{formatDate(viewDialog.invoice.dueDate)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Agen</Label>
                  <p>{viewDialog.invoice.agenNama}</p>
                </div>
              </div>

              {/* Pilgrims List */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jemaah ({viewDialog.invoice.jumlahJemaah})
                </h3>
                <div className="border rounded-lg divide-y">
                  {jemaahList
                    .filter((j) => viewDialog.invoice!.jemaahIds.includes(j.id))
                    .map((jemaah) => (
                      <div
                        key={jemaah.id}
                        className="flex justify-between items-center p-3"
                      >
                        <span>{jemaah.nama}</span>
                        <span className="font-medium">
                          {formatCurrency(jemaah.harga)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Calculation Breakdown */}
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Rincian Perhitungan
                </h3>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(viewDialog.invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({viewDialog.invoice.taxPercent}%):</span>
                    <span>
                      {formatCurrency(
                        viewDialog.invoice.subtotal *
                          (viewDialog.invoice.taxPercent / 100)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Diskon:</span>
                    <span>-{formatCurrency(viewDialog.invoice.diskon)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">
                      {formatCurrency(viewDialog.invoice.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Status */}
              <div>
                <h3 className="font-semibold mb-2">Progres Pembayaran</h3>
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Jumlah Dibayar:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(viewDialog.invoice.amountPaid)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sisa:</span>
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(
                        viewDialog.invoice.total - viewDialog.invoice.amountPaid
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${
                          (viewDialog.invoice.amountPaid /
                            viewDialog.invoice.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialog({ open: false, invoice: null })}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}