import { useState } from "react";
import { X, Search } from "lucide-react";

// Mock invoices data - should be replaced with actual API call
const mockInvoices = [
  {
    id: "1",
    nomorInvoice: "INV-2024-001",
    pelanggan: "PT ABC Travel",
    tanggal: "2024-01-15",
    jumlah: 50000000,
  },
  {
    id: "2",
    nomorInvoice: "INV-2024-002",
    pelanggan: "CV XYZ Tours",
    tanggal: "2024-01-20",
    jumlah: 75000000,
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount);
};

interface InvoiceModalProps {
  onClose: () => void;
  onSubmit: (invoices: string[], invoiceAmounts: { [key: string]: number }) => void;
  selectedInvoices: string[];
}

export function InvoiceModal({
  onClose,
  onSubmit,
  selectedInvoices,
}: InvoiceModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tempSelected, setTempSelected] =
    useState<string[]>(selectedInvoices);

  const filteredInvoices = mockInvoices.filter(
    (invoice: typeof mockInvoices[0]) =>
      invoice.nomorInvoice
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      invoice.pelanggan
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const handleToggleInvoice = (nomorInvoice: string) => {
    if (tempSelected.includes(nomorInvoice)) {
      setTempSelected(
        tempSelected.filter((i) => i !== nomorInvoice),
      );
    } else {
      setTempSelected([...tempSelected, nomorInvoice]);
    }
  };

  const handleSubmit = () => {
    // Create invoice amounts map
    const invoiceAmounts: { [key: string]: number } = {};
    tempSelected.forEach((invNumber: string) => {
      const invoice = mockInvoices.find((inv: typeof mockInvoices[0]) => inv.nomorInvoice === invNumber);
      if (invoice) {
        invoiceAmounts[invNumber] = invoice.jumlah;
      }
    });
    onSubmit(tempSelected, invoiceAmounts);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-xl">Pilih Invoice</h3>
            <p className="text-sm text-gray-600 mt-1">
              Pilih invoice yang akan dimasukkan ke dalam batch
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nomor invoice atau pelanggan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Tidak ada invoice yang ditemukan
              </div>
            ) : (
              filteredInvoices.map((invoice: typeof mockInvoices[0]) => (
                <label
                  key={invoice.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={tempSelected.includes(
                      invoice.nomorInvoice,
                    )}
                    onChange={() =>
                      handleToggleInvoice(invoice.nomorInvoice)
                    }
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">
                        Nomor Invoice
                      </div>
                      <div>{invoice.nomorInvoice}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        Agen
                      </div>
                      <div>{invoice.pelanggan}</div>
                    </div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-gray-500">
                          Tanggal
                        </div>
                        <div>{formatDate(invoice.tanggal)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Jumlah
                        </div>
                        <div>{formatCurrency(invoice.jumlah)}</div>
                      </div>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              {tempSelected.length} invoice dipilih
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tambahkan Invoice
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}