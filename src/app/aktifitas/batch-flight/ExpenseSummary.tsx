import type { Transaction, Batch } from './ExpenseTracking';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface ExpenseSummaryProps {
  transactions: Transaction[];
  batch: Batch;
}

export function ExpenseSummary({ transactions, batch }: ExpenseSummaryProps) {
  // Calculate total income from invoices
  const totalMasuk = batch.invoices.reduce((sum, invNumber) => {
    const amount = batch.invoiceAmounts?.[invNumber] || 0;
    return sum + amount;
  }, 0);

  const totalKeluar = transactions
    .filter(t => t.tipe === 'keluar')
    .reduce((sum, t) => sum + t.nominal, 0);

  const netProfit = totalMasuk - totalKeluar;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {/* Batch Info Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm text-gray-600 mb-3">Informasi Batch</h3>
        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500">Nomor Batch</p>
            <p className="font-medium">{batch.nomorBatch}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Rute</p>
            <p className="text-sm">{batch.rutePenerbangan}</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(batch.tanggal)}</span>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm text-gray-600 mb-4">Ringkasan Keuangan</h3>
        
        <div className="space-y-4">
          {/* Total Pemasukan */}
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-700">Total Pemasukan</span>
            </div>
            <p className="text-lg text-green-600">
              {formatCurrency(totalMasuk)}
            </p>
            <p className="text-xs text-green-600 mt-1">
              dari {batch.invoices.length} invoice
            </p>
          </div>

          {/* Total Pengeluaran */}
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-xs text-red-700">Total Pengeluaran</span>
            </div>
            <p className="text-lg text-red-600">
              {formatCurrency(totalKeluar)}
            </p>
            <p className="text-xs text-red-600 mt-1">
              {transactions.filter(t => t.tipe === 'keluar').length} transaksi
            </p>
          </div>

          {/* Net Profit/Loss */}
          <div className={`rounded-lg p-3 ${
            netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className={`w-4 h-4 ${
                netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`} />
              <span className={`text-xs ${
                netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'
              }`}>
                {netProfit >= 0 ? 'Profit Bersih' : 'Loss Bersih'}
              </span>
            </div>
            <p className={`text-lg ${
              netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
            }`}>
              {formatCurrency(Math.abs(netProfit))}
            </p>
            {totalMasuk > 0 && (
              <p className={`text-xs mt-1 ${
                netProfit >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}>
                {((netProfit / totalMasuk) * 100).toFixed(1)}% margin
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-sm text-gray-600 mb-3">Statistik</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Total Transaksi</span>
            <span className="font-medium">{transactions.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Rata-rata Transaksi</span>
            <span className="font-medium">
              {transactions.length > 0 
                ? formatCurrency((totalMasuk + totalKeluar) / transactions.length)
                : 'Rp 0'
              }
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">Invoice Terkait</span>
            <span className="font-medium">{batch.invoices.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}