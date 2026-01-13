
import {

    ContactRound,
    DollarSign,
    CircleGauge,
    Book,
    Settings,
    Package2,
    Store,
    BarChart3,
    FileText,
    Truck,
    ClipboardList,
    ArrowLeftRight,
} from "lucide-react";
import { type LucideIcon, HandCoins } from "lucide-react";

interface MenuItem {
    title: string;
    url: string;
    icon?: LucideIcon;
    requiredPermission?: string;
}

interface MenuGroup {
    title: string;
    url: string;
    items: MenuItem[];
}

export const Menu: { navMain: MenuGroup[] } = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            items: [
            {
                title: "Overview",
                url: "/dashboard",
                icon: CircleGauge,
                requiredPermission: "menu:dashboard",
            },
            ],
        },
        {
            title: "Manajemen",
            url: "#",
            items: [
            {
                title: "Agen",
                url: "/manajemen/agen",
                icon: Store,
                requiredPermission: "menu:agen",
            },
            {
                title: "Chart of Accounts",
                url: "/manajemen/chart-of-accounts",
                icon: Book,
                requiredPermission: "menu:chart-of-accounts",
            },
            {
                title: "Produk",
                url: "/manajemen/produk",
                icon: Package2,
                requiredPermission: "menu:produk",
            },
            {
                title: "Paket",
                url: "/manajemen/paket",
                icon: Package2,
                requiredPermission: "menu:paket",
            },
            ],
        },
        {
            title: "Aktifitas",
            url: "#",
            items: [
            {
                title: "Barcode Jemaah",
                url: "/aktifitas/barcode-jemaah",
                icon: ContactRound,
                requiredPermission: "menu:barcode-jemaah",
            },
            {
                title: "Invoice",
                url: "/aktifitas/invoice",
                icon: FileText,
                requiredPermission: "menu:invoice",
            },
            {
                title: "Pembayaran",
                url: "/aktifitas/pembayaran",
                icon: HandCoins,
                requiredPermission: "menu:pembayaran",
            },
            {
                title: "Mutasi",
                url: "/aktifitas/mutasi",
                icon: ArrowLeftRight,
                requiredPermission: "menu:mutasi",
            },
            {
                title: "Batch Penerbangan",
                url: "/aktifitas/batch-flight",
                icon: Truck,
                requiredPermission: "menu:batch-flight",
            },
            // {
            //     title: "Pengeluaran",
            //     url: "/aktifitas/pengeluaran",
            //     icon: DollarSign,
            //     requiredPermission: "menu:pengeluaran",
            // },
            {
                title: "Journal Keuangan",
                url: "/aktifitas/journal-keuangan",
                icon: ClipboardList,
                requiredPermission: "menu:journal-keuangan",
            },
            ],
        },
        {
            title: "Laporan",
            url: "#",
            items: [
                {
                    title: "Laporan Keuangan",
                    url: "/laporan/laporan-keuangan",
                    icon: BarChart3,
                    requiredPermission: "menu:laporan-keuangan",
                },
                // {
                //     title: "Laporan Batch Flight",
                //     url: "/laporan/laporan-batch-flight",
                //     icon: BarChart3,
                //     requiredPermission: "menu:laporan-batch-flight",
                // },
                {
                    title: "Laporan Batch",
                    url: "/laporan/laporan-batch",
                    icon: BarChart3,
                    requiredPermission: "menu:laporan-batch",
                }
            ],
        }

    ],
};

// Dashboard

// Manajemen
/// Agen
/// Chart of Accounts
/// Produk

// Aktifitas
/// Barcode Jemaah
/// Invoice
/// Pembayaran
/// Batch Flight
/// Pengeluaran
/// Journal Keuangan
/// Laporan Keuangan
