"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface ReportData {
  totalPendapatan: number;
  totalPengeluaran: number;
  netIncome: number;
  totalTransaksi: number;
  pendapatanByMonth: MonthlyData[];
  pengeluaranByMonth: MonthlyData[];
  balanceByCOA: COABalance[];
  cashFlow: CashFlowData;
}

interface MonthlyData {
  month: string;
  amount: number;
}

interface COABalance {
  kodeAkun: string;
  namaAkun: string;
  debit: number;
  kredit: number;
  balance: number;
}

interface CashFlowData {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netCashFlow: number;
}

// Mockup Report Data
const mockReportData: ReportData = {
  totalPendapatan: 826550000,
  totalPengeluaran: 545500000,
  netIncome: 281050000,
  totalTransaksi: 32,
  pendapatanByMonth: [
    { month: "Jan 2026", amount: 285550000 },
    { month: "Feb 2026", amount: 318000000 },
    { month: "Mar 2026", amount: 223000000 },
  ],
  pengeluaranByMonth: [
    { month: "Jan 2026", amount: 132000000 },
    { month: "Feb 2026", amount: 257500000 },
    { month: "Mar 2026", amount: 156000000 },
  ],
  balanceByCOA: [
    {
      kodeAkun: "1-1000",
      namaAkun: "Kas",
      debit: 80000000,
      kredit: 0,
      balance: 80000000,
    },
    {
      kodeAkun: "1-1100",
      namaAkun: "Bank BCA",
      debit: 407090000,
      kredit: 0,
      balance: 407090000,
    },
    {
      kodeAkun: "1-1200",
      namaAkun: "Bank Mandiri",
      debit: 223000000,
      kredit: 0,
      balance: 223000000,
    },
    {
      kodeAkun: "4-1000",
      namaAkun: "Pendapatan Jasa Umroh",
      debit: 0,
      kredit: 195000000,
      balance: -195000000,
    },
    {
      kodeAkun: "5-1000",
      namaAkun: "Beban Hotel",
      debit: 295000000,
      kredit: 0,
      balance: 295000000,
    },
    {
      kodeAkun: "5-2000",
      namaAkun: "Beban Transportasi",
      debit: 86000000,
      kredit: 0,
      balance: 86000000,
    },
    {
      kodeAkun: "5-3000",
      namaAkun: "Beban Konsumsi",
      debit: 39000000,
      kredit: 0,
      balance: 39000000,
    },
    {
      kodeAkun: "5-4000",
      namaAkun: "Beban Operasional",
      debit: 125500000,
      kredit: 0,
      balance: 125500000,
    },
  ],
  cashFlow: {
    operatingActivities: 281050000,
    investingActivities: -15000000,
    financingActivities: 0,
    netCashFlow: 266050000,
  },
};

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return "0%";
  return ((value / total) * 100).toFixed(1) + "%";
};

export default function LaporanKeuanganPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<string>("income");

  // Load initial data
  useEffect(() => {
    setTimeout(() => {
      setReportData(mockReportData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading || !reportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Calculate profit margin
  const profitMargin = (reportData.netIncome / reportData.totalPendapatan) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Financial reports and analytics dashboard
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Period</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="2026-01">January 2026</SelectItem>
                  <SelectItem value="2026-02">February 2026</SelectItem>
                  <SelectItem value="2026-03">March 2026</SelectItem>
                  <SelectItem value="2026-q1">Q1 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income Statement</SelectItem>
                  <SelectItem value="cashflow">Cash Flow</SelectItem>
                  <SelectItem value="balance">Balance by COA</SelectItem>
                  <SelectItem value="trends">Monthly Trends</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Total Pendapatan
            </CardDescription>
            <CardTitle className="text-2xl text-green-600">
              {formatCurrency(reportData.totalPendapatan)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {reportData.totalTransaksi} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              Total Pengeluaran
            </CardDescription>
            <CardTitle className="text-2xl text-red-600">
              {formatCurrency(reportData.totalPengeluaran)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(reportData.totalPengeluaran, reportData.totalPendapatan)} of revenue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              Net Income
            </CardDescription>
            <CardTitle className="text-2xl text-blue-600">
              {formatCurrency(reportData.netIncome)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              <span>{profitMargin.toFixed(1)}% margin</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Transaksi
            </CardDescription>
            <CardTitle className="text-2xl">
              {reportData.totalTransaksi}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Journal entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Income Statement */}
      {selectedReport === "income" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Income Statement (Laporan Laba Rugi)
            </CardTitle>
            <CardDescription>
              Summary of revenues and expenses for the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Revenue Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-lg">Pendapatan</h3>
                </div>
                <div className="space-y-2 pl-7">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <span className="font-medium">Pendapatan Jasa Umroh</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(reportData.totalPendapatan)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border-t-2 border-green-600">
                    <span className="font-bold">Total Pendapatan</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatCurrency(reportData.totalPendapatan)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expense Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-lg">Beban</h3>
                </div>
                <div className="space-y-2 pl-7">
                  {reportData.balanceByCOA
                    .filter((coa) => coa.kodeAkun.startsWith("5-"))
                    .map((coa) => (
                      <div
                        key={coa.kodeAkun}
                        className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{coa.namaAkun}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ({coa.kodeAkun})
                          </span>
                        </div>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(coa.balance)}
                        </span>
                      </div>
                    ))}
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg border-t-2 border-red-600">
                    <span className="font-bold">Total Beban</span>
                    <span className="font-bold text-red-600 text-lg">
                      {formatCurrency(reportData.totalPengeluaran)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Income */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-600">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-xl">Laba Bersih (Net Income)</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="bg-white dark:bg-gray-900">
                        {profitMargin.toFixed(1)}% margin
                      </Badge>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600 text-2xl">
                    {formatCurrency(reportData.netIncome)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cash Flow */}
      {selectedReport === "cashflow" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cash Flow Statement (Laporan Arus Kas)
            </CardTitle>
            <CardDescription>
              Summary of cash inflows and outflows by activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Operating Activities */}
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Operating Activities</span>
                  <span
                    className={`font-bold ${reportData.cashFlow.operatingActivities >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(reportData.cashFlow.operatingActivities)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cash generated from core business operations
                </p>
              </div>

              {/* Investing Activities */}
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Investing Activities</span>
                  <span
                    className={`font-bold ${reportData.cashFlow.investingActivities >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(reportData.cashFlow.investingActivities)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cash used for investments and asset purchases
                </p>
              </div>

              {/* Financing Activities */}
              <div className="p-4 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Financing Activities</span>
                  <span
                    className={`font-bold ${reportData.cashFlow.financingActivities >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {formatCurrency(reportData.cashFlow.financingActivities)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cash from financing and debt activities
                </p>
              </div>

              {/* Net Cash Flow */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border-2 border-blue-600">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Net Cash Flow</span>
                  <span className="font-bold text-blue-600 text-2xl">
                    {formatCurrency(reportData.cashFlow.netCashFlow)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Balance by COA */}
      {selectedReport === "balance" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Balance by Chart of Accounts
            </CardTitle>
            <CardDescription>
              Account balances organized by COA categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.balanceByCOA.map((coa) => {
                const isAsset = coa.kodeAkun.startsWith("1-");
                const isRevenue = coa.kodeAkun.startsWith("4-");
                const isExpense = coa.kodeAkun.startsWith("5-");

                return (
                  <div
                    key={coa.kodeAkun}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">
                          {coa.kodeAkun}
                        </span>
                        <span className="font-semibold">{coa.namaAkun}</span>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Debit: {formatCurrency(coa.debit)}</span>
                        <span>Kredit: {formatCurrency(coa.kredit)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-lg ${
                          isAsset
                            ? "text-blue-600"
                            : isRevenue
                              ? "text-green-600"
                              : isExpense
                                ? "text-red-600"
                                : "text-gray-600"
                        }`}
                      >
                        {formatCurrency(Math.abs(coa.balance))}
                      </div>
                      <Badge
                        variant={isAsset ? "default" : isRevenue ? "outline" : "secondary"}
                        className="mt-1"
                      >
                        {isAsset ? "Asset" : isRevenue ? "Revenue" : isExpense ? "Expense" : "Other"}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Trends */}
      {selectedReport === "trends" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Monthly Trends
            </CardTitle>
            <CardDescription>
              Revenue and expense trends over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Pendapatan Trend */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Pendapatan Trend
                </h3>
                <div className="space-y-3">
                  {reportData.pendapatanByMonth.map((data) => {
                    const maxAmount = Math.max(
                      ...reportData.pendapatanByMonth.map((d) => d.amount)
                    );
                    const percentage = (data.amount / maxAmount) * 100;

                    return (
                      <div key={data.month} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(data.amount)}
                          </span>
                        </div>
                        <div className="h-8 bg-muted rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pengeluaran Trend */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Pengeluaran Trend
                </h3>
                <div className="space-y-3">
                  {reportData.pengeluaranByMonth.map((data) => {
                    const maxAmount = Math.max(
                      ...reportData.pengeluaranByMonth.map((d) => d.amount)
                    );
                    const percentage = (data.amount / maxAmount) * 100;

                    return (
                      <div key={data.month} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{data.month}</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency(data.amount)}
                          </span>
                        </div>
                        <div className="h-8 bg-muted rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all duration-500 flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs text-white font-medium">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Net Income by Month */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h3 className="font-semibold mb-3">Net Income by Month</h3>
                <div className="space-y-2">
                  {reportData.pendapatanByMonth.map((data, idx) => {
                    const pengeluaran = reportData.pengeluaranByMonth[idx];
                    const netIncome = data.amount - (pengeluaran?.amount || 0);

                    return (
                      <div
                        key={data.month}
                        className="flex justify-between items-center p-2 bg-white dark:bg-gray-900 rounded"
                      >
                        <span className="font-medium">{data.month}</span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${netIncome >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {formatCurrency(netIncome)}
                          </span>
                          {netIncome >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}