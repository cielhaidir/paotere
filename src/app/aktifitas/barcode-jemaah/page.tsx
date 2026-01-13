"use client";

import { useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  ContactRound,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Printer,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/ui/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataTableColumn, DataTableAction } from "@/components/ui/data-table";

// Mock data for Agen (from Agen page)
const mockAgen = [
  { id: 1, nama: "PT Berkah Umroh Indonesia" },
  { id: 2, nama: "CV Madinah Tour & Travel" },
  { id: 3, nama: "PT Arafah Wisata Religi" },
  { id: 4, nama: "Zahira Tour" },
  { id: 5, nama: "Al Hijaz Travel" },
  { id: 6, nama: "Nurul Iman Travel" },
  { id: 7, nama: "Safar Umroh" },
  { id: 8, nama: "Mecca Journey" },
  { id: 9, nama: "Hajar Aswad Travel" },
  { id: 10, nama: "Ar Rahman Tours" },
  { id: 11, nama: "Tawaf Travel Service" },
  { id: 12, nama: "Baitul Makmur" },
  { id: 13, nama: "Sahabat Haji" },
  { id: 14, nama: "Multazam Tour" },
  { id: 15, nama: "Rohman Travel" },
  { id: 16, nama: "Marwa Express" },
  { id: 17, nama: "Safa Travel Group" },
  { id: 18, nama: "Zamzam Holidays" },
];

// Mock data for Produk (from Produk page)
const mockProduk = [
  { id: 1, nama: "Umroh Reguler" },
  { id: 2, nama: "Umroh Plus Turki" },
  { id: 3, nama: "Umroh Ramadhan" },
  { id: 4, nama: "Haji Reguler" },
  { id: 5, nama: "Haji Plus" },
  { id: 6, nama: "Umroh Plus Dubai" },
  { id: 7, nama: "Umroh Khusus" },
  { id: 8, nama: "Umroh Backpacker" },
  { id: 9, nama: "Umroh Keluarga" },
  { id: 10, nama: "Umroh VIP" },
  { id: 11, nama: "Umroh Plus Mesir" },
  { id: 12, nama: "Umroh Akhir Tahun" },
  { id: 13, nama: "Umroh Murah" },
  { id: 14, nama: "Haji Furoda" },
  { id: 15, nama: "Umroh Milad" },
];

// Mock data for Paket (filtered by Produk)
const mockPaket = [
  { id: 1, nama: "Paket 9 Hari", produkId: 1 },
  { id: 2, nama: "Paket 12 Hari", produkId: 1 },
  { id: 3, nama: "Paket 15 Hari", produkId: 1 },
  { id: 4, nama: "Paket 14 Hari Istanbul", produkId: 2 },
  { id: 5, nama: "Paket 16 Hari Cappadocia", produkId: 2 },
  { id: 6, nama: "Paket 12 Hari Ramadhan", produkId: 3 },
  { id: 7, nama: "Paket 15 Hari Ramadhan", produkId: 3 },
  { id: 8, nama: "Paket 40 Hari", produkId: 4 },
  { id: 9, nama: "Paket 45 Hari", produkId: 4 },
  { id: 10, nama: "Paket ONH Plus", produkId: 5 },
  { id: 11, nama: "Paket 12 Hari Dubai", produkId: 6 },
  { id: 12, nama: "Paket 10 Hari Khusus", produkId: 7 },
  { id: 13, nama: "Paket 7 Hari Hemat", produkId: 8 },
  { id: 14, nama: "Paket 14 Hari Keluarga", produkId: 9 },
  { id: 15, nama: "Paket 10 Hari VIP", produkId: 10 },
  { id: 16, nama: "Paket 16 Hari Mesir", produkId: 11 },
  { id: 17, nama: "Paket 12 Hari Akhir Tahun", produkId: 12 },
  { id: 18, nama: "Paket 9 Hari Ekonomis", produkId: 13 },
  { id: 19, nama: "Paket 45 Hari Furoda", produkId: 14 },
  { id: 20, nama: "Paket 10 Hari Milad", produkId: 15 },
];

// Tingkat options
const tingkatOptions = ["Single", "Double", "Triple", "Quad"];

// Form validation schema
const jemaahFormSchema = z.object({
  nama: z.string().min(3, "Nama minimal 3 karakter"),
  ktp: z.string().regex(/^\d{16}$/, "KTP harus 16 digit angka"),
  alamat: z.string().min(3, "Alamat minimal 3 karakter"),
  agenId: z.number({ required_error: "Agen harus dipilih" }),
  produkId: z.number({ required_error: "Produk harus dipilih" }),
  paketId: z.number({ required_error: "Paket harus dipilih" }),
  tingkat: z.string().min(1, "Tingkat harus dipilih"),
  tanggalKeberangkatan: z.date({ required_error: "Tanggal keberangkatan harus diisi" }),
  harga: z.number().positive("Harga harus lebih dari 0"),
  deskripsi: z.string().optional(),
  oldBarcode: z.string().optional(),
});

type JemaahFormValues = z.infer<typeof jemaahFormSchema>;

interface Jemaah extends JemaahFormValues {
  id: number;
  agenNama: string;
  produkNama: string;
  paketNama: string;
  invoiceId?: number;
  invoiceNomor?: string;
  [key: string]: unknown;
}

// Initial mockup data
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
    invoiceNomor: "INV-2026-001",
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
    invoiceNomor: "INV-2026-002",
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
    invoiceId: 3,
    invoiceNomor: "INV-2026-003",
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
    invoiceId: 4,
    invoiceNomor: "INV-2026-004",
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
    invoiceId: 5,
    invoiceNomor: "INV-2026-005",
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
    invoiceId: 6,
    invoiceNomor: "INV-2026-006",
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
    invoiceId: 7,
    invoiceNomor: "INV-2026-007",
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
    invoiceId: 8,
    invoiceNomor: "INV-2026-008",
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
    invoiceId: 9,
    invoiceNomor: "INV-2026-009",
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
    invoiceId: 10,
    invoiceNomor: "INV-2026-010",
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
    invoiceId: 11,
    invoiceNomor: "INV-2026-011",
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
    invoiceId: 12,
    invoiceNomor: "INV-2026-012",
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
    invoiceId: 13,
    invoiceNomor: "INV-2026-013",
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
    invoiceId: 14,
    invoiceNomor: "INV-2026-014",
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
    invoiceId: 15,
    invoiceNomor: "INV-2026-015",
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

// Format currency as IDR
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date as DD/MM/YYYY
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function BarcodeJemaahPage() {
  const [jemaahData, setJemaahData] = useState<Jemaah[]>(initialMockJemaah);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Jemaah | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<Jemaah | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const form = useForm<JemaahFormValues>({
    resolver: zodResolver(jemaahFormSchema),
    defaultValues: {
      nama: "",
      ktp: "",
      alamat: "",
      agenId: undefined,
      produkId: undefined,
      paketId: undefined,
      tingkat: "",
      tanggalKeberangkatan: undefined,
      harga: 0,
      deskripsi: "",
      oldBarcode: "",
    },
  });

  const selectedProdukId = form.watch("produkId");

  // Filter paket based on selected produk
  const availablePaket = useMemo(() => {
    if (!selectedProdukId) return [];
    return mockPaket.filter((paket) => paket.produkId === selectedProdukId);
  }, [selectedProdukId]);

  // Reset paket when produk changes
  useMemo(() => {
    if (selectedProdukId && form.getValues("paketId")) {
      const currentPaketId = form.getValues("paketId");
      const isValidPaket = availablePaket.some((p) => p.id === currentPaketId);
      if (!isValidPaket) {
        form.setValue("paketId", undefined as any);
      }
    }
  }, [selectedProdukId, availablePaket, form]);

  // Simulate loading
  useMemo(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Show success message temporarily
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Handle form submit
  const onSubmit = (values: JemaahFormValues) => {
    const agen = mockAgen.find((a) => a.id === values.agenId);
    const produk = mockProduk.find((p) => p.id === values.produkId);
    const paket = mockPaket.find((p) => p.id === values.paketId);

    if (editingId) {
      // Update existing
      setJemaahData((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...values,
                agenNama: agen?.nama || "",
                produkNama: produk?.nama || "",
                paketNama: paket?.nama || "",
              }
            : item
        )
      );
      showSuccess("Data jemaah berhasil diperbarui");
      setEditingId(null);
    } else {
      // Create new
      const newJemaah: Jemaah = {
        id: Math.max(...jemaahData.map((j) => j.id), 0) + 1,
        ...values,
        agenNama: agen?.nama || "",
        produkNama: produk?.nama || "",
        paketNama: paket?.nama || "",
      };
      setJemaahData((prev) => [newJemaah, ...prev]);
      showSuccess("Data jemaah berhasil ditambahkan");
    }

    form.reset();
    setIsFormOpen(false);
  };

  // Handle edit
  const handleEdit = (jemaah: Jemaah) => {
    setEditingId(jemaah.id);
    form.reset({
      nama: jemaah.nama,
      ktp: jemaah.ktp,
      alamat: jemaah.alamat,
      agenId: jemaah.agenId,
      produkId: jemaah.produkId,
      paketId: jemaah.paketId,
      tingkat: jemaah.tingkat,
      tanggalKeberangkatan: jemaah.tanggalKeberangkatan,
      harga: jemaah.harga,
      deskripsi: jemaah.deskripsi || "",
      oldBarcode: jemaah.oldBarcode || "",
    });
    setIsFormOpen(true);
  };

  // Handle delete
  const handleDelete = (jemaah: Jemaah) => {
    setDeleteTarget(jemaah);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setJemaahData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      showSuccess("Data jemaah berhasil dihapus");
    }
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Handle view details
  const handleView = (jemaah: Jemaah) => {
    setViewTarget(jemaah);
    setViewDialogOpen(true);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    form.reset();
    setIsFormOpen(false);
  };

  // Table columns
  const columns: DataTableColumn<Jemaah>[] = [
    {
      id: "nama",
      accessorKey: "nama",
      header: "Nama Jemaah",
      cell: (row) => <div className="font-medium">{row.nama}</div>,
    },
    {
      id: "agenNama",
      accessorKey: "agenNama",
      header: "Agen",
      cell: (row) => <div className="text-sm">{row.agenNama}</div>,
    },
    {
      id: "produkNama",
      accessorKey: "produkNama",
      header: "Produk",
      cell: (row) => <div className="text-sm">{row.produkNama}</div>,
    },
    {
      id: "paketNama",
      accessorKey: "paketNama",
      header: "Paket",
      cell: (row) => <div className="text-sm">{row.paketNama}</div>,
    },
    {
      id: "tingkat",
      accessorKey: "tingkat",
      header: "Tingkat",
      cell: (row) => {
        const tingkat = row.tingkat as string;
        const variant =
          tingkat === "Quad"
            ? "default"
            : tingkat === "Single"
              ? "secondary"
              : tingkat === "Triple"
                ? "outline"
                : "secondary";
        return <Badge variant={variant}>{tingkat}</Badge>;
      },
    },
    {
      id: "tanggalKeberangkatan",
      accessorKey: "tanggalKeberangkatan",
      header: "Tanggal Keberangkatan",
      cell: (row) => {
        const date = row.tanggalKeberangkatan as Date;
        return <div className="text-sm">{formatDate(date)}</div>;
      },
    },
    {
      id: "harga",
      accessorKey: "harga",
      header: "Harga",
      cell: (row) => {
        const harga = row.harga as number;
        return <div className="text-sm font-medium">{formatCurrency(harga)}</div>;
      },
    },
    {
      id: "invoiceNomor",
      accessorKey: "invoiceNomor",
      header: "Status Invoice",
      cell: (row) => {
        const invoiceNomor = row.invoiceNomor;
        return invoiceNomor ? (
          <Badge variant="default" className="bg-green-600">
            {invoiceNomor}
          </Badge>
        ) : (
          <Badge variant="outline">Belum Invoice</Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => {
        const jemaah = row;
        return (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(jemaah)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(jemaah)}
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(jemaah)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => alert("Print Barcode - Coming Soon")}
              title="Print Barcode"
            >
              <Printer className="h-4 w-4" />
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
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
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
        <ContactRound className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Barcode Jemaah</h1>
          <p className="text-muted-foreground">
            Kelola data registrasi jemaah umroh dan haji
          </p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-green-800 border border-green-200">
          {successMessage}
        </div>
      )}

      {/* Create/Edit Form */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => {
            if (!editingId) {
              setIsFormOpen(!isFormOpen);
            }
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{editingId ? "Edit Data Jemaah" : "Tambah Data Jemaah"}</CardTitle>
              <CardDescription>
                {editingId
                  ? "Perbarui informasi jemaah yang sudah ada"
                  : "Isi formulir untuk menambah jemaah baru"}
              </CardDescription>
            </div>
            {!editingId &&
              (isFormOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              ))}
          </div>
        </CardHeader>
        {(isFormOpen || editingId) && (
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Nama */}
                  <FormField
                    control={form.control}
                    name="nama"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Jemaah *</FormLabel>
                        <FormControl>
                          <Input placeholder="Masukkan nama lengkap" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* KTP */}
                  <FormField
                    control={form.control}
                    name="ktp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KTP *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="16 digit nomor KTP"
                            maxLength={16}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Agen */}
                  <FormField
                    control={form.control}
                    name="agenId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Agen *</FormLabel>
                        <FormControl>
                          <Combobox
                            options={mockAgen.map((agen) => ({
                              value: agen.id.toString(),
                              label: agen.nama,
                            }))}
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            placeholder="Pilih agen"
                            searchPlaceholder="Cari agen..."
                            emptyText="Agen tidak ditemukan."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Produk */}
                  <FormField
                    control={form.control}
                    name="produkId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Produk *</FormLabel>
                        <FormControl>
                          <Combobox
                            options={mockProduk.map((produk) => ({
                              value: produk.id.toString(),
                              label: produk.nama,
                            }))}
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            placeholder="Pilih produk"
                            searchPlaceholder="Cari produk..."
                            emptyText="Produk tidak ditemukan."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Paket */}
                  <FormField
                    control={form.control}
                    name="paketId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paket *</FormLabel>
                        <FormControl>
                          <Combobox
                            options={availablePaket.map((paket) => ({
                              value: paket.id.toString(),
                              label: paket.nama,
                            }))}
                            value={field.value?.toString()}
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            placeholder={
                              selectedProdukId
                                ? "Pilih paket"
                                : "Pilih produk terlebih dahulu"
                            }
                            searchPlaceholder="Cari paket..."
                            emptyText="Paket tidak ditemukan."
                            disabled={!selectedProdukId}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tingkat */}
                  <FormField
                    control={form.control}
                    name="tingkat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tingkat *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tingkat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tingkatOptions.map((tingkat) => (
                              <SelectItem key={tingkat} value={tingkat}>
                                {tingkat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tanggal Keberangkatan */}
                  <FormField
                    control={form.control}
                    name="tanggalKeberangkatan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tanggal Keberangkatan *</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(val ? new Date(val) : undefined);
                            }}
                            placeholder="Pilih tanggal"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Harga */}
                  <FormField
                    control={form.control}
                    name="harga"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Harga (IDR) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="35000000"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Old Barcode */}
                  <FormField
                    control={form.control}
                    name="oldBarcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Old Barcode (Opsional)</FormLabel>
                        <FormControl>
                          <Input placeholder="UM-2025-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Alamat - Full Width */}
                <FormField
                  control={form.control}
                  name="alamat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan alamat lengkap jemaah"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Deskripsi - Full Width */}
                <FormField
                  control={form.control}
                  name="deskripsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi (Opsional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Catatan tambahan atau kebutuhan khusus"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Buttons */}
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? "Update Data" : "Tambah Data"}
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
          <CardTitle>Daftar Jemaah</CardTitle>
          <CardDescription>
            Kelola dan lihat semua data jemaah yang terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={jemaahData}
            searchPlaceholder="Cari berdasarkan nama, KTP, atau agen..."
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data jemaah{" "}
              <strong>{deleteTarget?.nama}</strong>?
              {deleteTarget?.invoiceNomor && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  ⚠️ Perhatian: Jemaah ini sudah memiliki invoice (
                  {deleteTarget.invoiceNomor})
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Jemaah</DialogTitle>
            <DialogDescription>Informasi lengkap data jemaah</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nama</p>
                  <p className="text-sm font-semibold">{viewTarget.nama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">KTP</p>
                  <p className="text-sm font-mono">{viewTarget.ktp}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Alamat</p>
                  <p className="text-sm">{viewTarget.alamat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Agen</p>
                  <p className="text-sm">{viewTarget.agenNama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Produk</p>
                  <p className="text-sm">{viewTarget.produkNama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Paket</p>
                  <p className="text-sm">{viewTarget.paketNama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tingkat</p>
                  <Badge>{viewTarget.tingkat}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Tanggal Keberangkatan
                  </p>
                  <p className="text-sm">{formatDate(viewTarget.tanggalKeberangkatan)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Harga</p>
                  <p className="text-sm font-semibold">{formatCurrency(viewTarget.harga)}</p>
                </div>
                {viewTarget.oldBarcode && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Old Barcode</p>
                    <p className="text-sm font-mono">{viewTarget.oldBarcode}</p>
                  </div>
                )}
                {viewTarget.invoiceNomor && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status Invoice
                    </p>
                    <Badge variant="default" className="bg-green-600">
                      {viewTarget.invoiceNomor}
                    </Badge>
                  </div>
                )}
                {viewTarget.deskripsi && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Deskripsi</p>
                    <p className="text-sm">{viewTarget.deskripsi}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}