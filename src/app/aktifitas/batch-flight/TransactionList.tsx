import type { Transaction } from './ExpenseTracking';
import { Edit2, Trash2, FileText, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Belum ada transaksi. Silakan tambah transaksi baru.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Icon */}
              <div className={`p-2 rounded-lg ${
                transaction.tipe === 'masuk' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {transaction.tipe === 'masuk' ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">{transaction.nama}</h4>
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full mt-1 ${
                      transaction.tipe === 'masuk'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${
                        transaction.tipe === 'masuk' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      {transaction.tipe === 'masuk' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </div>
                  <span className={`text-lg ${
                    transaction.tipe === 'masuk' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.tipe === 'masuk' ? '+' : '-'} {formatCurrency(transaction.nominal)}
                  </span>
                </div>

                {transaction.deskripsi && (
                  <p className="text-sm text-gray-600 mb-2">{transaction.deskripsi}</p>
                )}

                {transaction.file && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FileText className="w-4 h-4" />
                    <span>{transaction.file}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => onEdit(transaction)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(transaction.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Hapus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
