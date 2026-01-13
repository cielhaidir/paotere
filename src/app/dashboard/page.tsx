"use client";

import { useState, useEffect } from "react";
import { 
  CircleGauge, 
  Users, 
  UserCheck, 
  Wallet, 
  Clock,
  TrendingUp,
  Plane,
  FileText,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Mockup Data
const mockStats = {
  totalAgents: 45,
  totalPilgrims: 1250,
  totalRevenue: 5750000000, // in IDR
  pendingPayments: 15
};

const mockRecentPilgrims = [
  { id: 1, name: "Ahmad Sudirman", agent: "PT Berkah Umroh", product: "Umroh Plus", date: "2026-01-10" },
  { id: 2, name: "Siti Aisyah", agent: "CV Hidayah Tour", product: "Umroh Reguler", date: "2026-01-10" },
  { id: 3, name: "Muhammad Rizki", agent: "PT Berkah Umroh", product: "Umroh VIP", date: "2026-01-09" },
  { id: 4, name: "Fatimah Zahra", agent: "PT Madinah Travel", product: "Umroh Plus", date: "2026-01-09" },
  { id: 5, name: "Abdullah Hassan", agent: "CV Hidayah Tour", product: "Umroh Reguler", date: "2026-01-08" },
];

const mockRecentPayments = [
  { id: 1, reference: "PAY-20260110-001", amount: 50000000, date: "2026-01-10", description: "Pembayaran Invoice #INV-001" },
  { id: 2, reference: "PAY-20260110-002", amount: 35000000, date: "2026-01-10", description: "Pembayaran Invoice #INV-005" },
  { id: 3, reference: "PAY-20260109-001", amount: 45000000, date: "2026-01-09", description: "Pembayaran Invoice #INV-012" },
  { id: 4, reference: "PAY-20260109-002", amount: 60000000, date: "2026-01-09", description: "Pembayaran Invoice #INV-008" },
  { id: 5, reference: "PAY-20260108-001", amount: 40000000, date: "2026-01-08", description: "Pembayaran Invoice #INV-015" },
];

const mockUpcomingFlights = [
  { id: 1, batchNumber: "BATCH-001", route: "CGK-JED", date: "2026-02-15", pilgrimsCount: 45 },
  { id: 2, batchNumber: "BATCH-002", route: "CGK-JED", date: "2026-02-20", pilgrimsCount: 52 },
  { id: 3, batchNumber: "BATCH-003", route: "SUB-JED", date: "2026-02-25", pilgrimsCount: 38 },
  { id: 4, batchNumber: "BATCH-004", route: "CGK-JED", date: "2026-03-01", pilgrimsCount: 48 },
  { id: 5, batchNumber: "BATCH-005", route: "UPG-JED", date: "2026-03-05", pilgrimsCount: 42 },
];

const mockMonthlyRevenue = [
  { month: "Jul", revenue: 450000000 },
  { month: "Aug", revenue: 520000000 },
  { month: "Sep", revenue: 480000000 },
  { month: "Oct", revenue: 610000000 },
  { month: "Nov", revenue: 580000000 },
  { month: "Dec", revenue: 720000000 },
];

const mockInvoiceStatus = [
  { status: "PAID", count: 45, percentage: 60 },
  { status: "DRAFT", count: 20, percentage: 27 },
  { status: "OVERDUE", count: 10, percentage: 13 },
];

// Helper Functions
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-32 mt-2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...mockMonthlyRevenue.map(m => m.revenue));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your Umroh & Hajj operations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agen</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active travel agents
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jemaah</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalPilgrims.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered pilgrims
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(mockStats.totalRevenue)}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Revenue Trend Chart */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMonthlyRevenue.map((item) => {
                const barWidth = (item.revenue / maxRevenue) * 100;
                return (
                  <div key={item.month} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.month}</span>
                      <span className="text-muted-foreground">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Invoice Status Breakdown */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Status
            </CardTitle>
            <CardDescription>Breakdown of invoice statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInvoiceStatus.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          item.status === 'PAID' ? 'success' : 
                          item.status === 'OVERDUE' ? 'destructive' : 
                          'secondary'
                        }
                      >
                        {item.status}
                      </Badge>
                      <span className="text-sm font-medium">{item.count} invoices</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === 'PAID' ? 'bg-green-500' : 
                        item.status === 'OVERDUE' ? 'bg-red-500' : 
                        'bg-gray-400'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent Pilgrim Registrations */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Recent Registrations</CardTitle>
            <CardDescription>Latest pilgrim registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentPilgrims.map((pilgrim) => (
                <div key={pilgrim.id} className="flex flex-col space-y-1 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{pilgrim.name}</p>
                      <p className="text-xs text-muted-foreground">{pilgrim.agent}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{pilgrim.product}</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(pilgrim.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Recent Payments</CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentPayments.map((payment) => (
                <div key={payment.id} className="flex flex-col space-y-1 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{payment.reference}</p>
                      <p className="text-xs text-muted-foreground">{payment.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(payment.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Flights */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Plane className="h-4 w-4" />
              Upcoming Flights
            </CardTitle>
            <CardDescription>Scheduled flight batches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingFlights.map((flight) => (
                <div key={flight.id} className="flex flex-col space-y-1 border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{flight.batchNumber}</p>
                      <p className="text-xs text-muted-foreground">{flight.route}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">{flight.pilgrimsCount} jemaah</Badge>
                    <span className="text-xs text-muted-foreground">{formatDate(flight.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}