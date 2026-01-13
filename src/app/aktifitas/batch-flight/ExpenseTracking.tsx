import { useState } from 'react';
import { TransactionList } from './TransactionList';
import { TransactionForm } from './TransactionForm';
import { ExpenseSummary } from './ExpenseSummary';
import { Plus } from 'lucide-react';

export interface Batch {
  id: number;
  nomorBatch: string;
  rutePenerbangan: string;
  tanggal: string;
  invoices: string[];
  invoiceAmounts?: { [key: string]: number };
}

export interface Transaction {
  id: string;
  nama: string;
  tipe: 'masuk' | 'keluar';
  nominal: number;
  deskripsi: string;
  file?: string;
}

interface ExpenseTrackingProps {
  batch: Batch;
}

export function ExpenseTracking({ batch }: ExpenseTrackingProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      nama: 'Biaya Bahan Bakar',
      tipe: 'keluar',
      nominal: 5000000,
      deskripsi: 'Pengisian bahan bakar untuk penerbangan'
    },
    {
      id: '2',
      nama: 'Biaya Handling',
      tipe: 'keluar',
      nominal: 3000000,
      deskripsi: 'Biaya handling di bandara'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
    setShowForm(false);
  };

  const handleUpdateTransaction = (transaction: Transaction) => {
    setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Transactions */}
      <div className="col-span-12 lg:col-span-9">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl">Pencatatan Modal</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Batch: <span className="font-medium">{batch.nomorBatch}</span>
                </p>
              </div>
              {!showForm && !editingTransaction && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Tambah Transaksi
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {showForm && (
              <div className="mb-6">
                <TransactionForm
                  onSubmit={handleAddTransaction}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}

            {editingTransaction && (
              <div className="mb-6">
                <TransactionForm
                  transaction={editingTransaction}
                  onSubmit={handleUpdateTransaction}
                  onCancel={handleCancelEdit}
                />
              </div>
            )}

            <TransactionList
              transactions={transactions}
              onEdit={handleEdit}
              onDelete={handleDeleteTransaction}
            />
          </div>
        </div>
      </div>

      {/* Right Column - Summary */}
      <div className="col-span-12 lg:col-span-3">
        <ExpenseSummary transactions={transactions} batch={batch} />
      </div>
    </div>
  );
}