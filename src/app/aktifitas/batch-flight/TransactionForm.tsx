import { useState, useEffect } from 'react';
import type { Transaction } from './ExpenseTracking';
import { Upload, X } from 'lucide-react';

interface TransactionFormProps {
  transaction?: Transaction;
  onSubmit: (transaction: Transaction) => void;
  onCancel: () => void;
}

export function TransactionForm({ transaction, onSubmit, onCancel }: TransactionFormProps) {
  const [nama, setNama] = useState(transaction?.nama || '');
  const [tipe] = useState<'keluar'>('keluar'); // Only keluar type
  const [nominal, setNominal] = useState(transaction?.nominal.toString() || '');
  const [deskripsi, setDeskripsi] = useState(transaction?.deskripsi || '');
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (transaction) {
      setNama(transaction.nama);
      setNominal(transaction.nominal.toString());
      setDeskripsi(transaction.deskripsi);
    }
  }, [transaction]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama || !nominal) {
      alert('Mohon lengkapi nama transaksi dan nominal');
      return;
    }

    const newTransaction: Transaction = {
      id: transaction?.id || Date.now().toString(),
      nama,
      tipe,
      nominal: parseFloat(nominal),
      deskripsi,
      file: fileName || transaction?.file
    };

    onSubmit(newTransaction);
  };

  const formatCurrency = (value: string) => {
    const num = value.replace(/\D/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setNominal(value);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg">
          {transaction ? 'Edit Transaksi' : 'Tambah Transaksi Baru'}
        </h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Nama Transaksi */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              Nama Transaksi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Biaya Bahan Bakar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tipe Transaksi */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              Tipe Transaksi
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="keluar"
                  checked={true}
                  disabled
                  className="w-4 h-4 text-blue-600"
                />
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Pengeluaran
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Hanya transaksi pengeluaran yang dicatat
            </p>
          </div>

          {/* Nominal */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              Nominal <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                Rp
              </span>
              <input
                type="text"
                value={formatCurrency(nominal)}
                onChange={handleNominalChange}
                placeholder="0"
                className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Keterangan tambahan (opsional)"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              Upload File
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  {fileName || 'Pilih file untuk diupload'}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Format: PDF, JPG, PNG, DOC, DOCX (Maks. 5MB)
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {transaction ? 'Update' : 'Simpan'} Transaksi
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}