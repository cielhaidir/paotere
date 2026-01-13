import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceCardProps {
  invoiceNumber: string;
  total: number;
  totalPaid: number;
}

export function InvoiceCard({ invoiceNumber, total, totalPaid }: InvoiceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const remaining = total - totalPaid;
  const percentagePaid = total > 0 ? (totalPaid / total) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informasi Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nomor Invoice</span>
            <a 
              href={`/invoice/${invoiceNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold cursor-pointer hover:text-blue-600 hover:underline transition-colors"
            >
              {invoiceNumber}
            </a>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Invoice</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Terbayar</span>
            <span className="font-semibold text-green-600">{formatCurrency(totalPaid)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-muted-foreground">Sisa Pembayaran</span>
            <span className="font-semibold text-orange-600">{formatCurrency(remaining)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress Pembayaran</span>
            <span>{percentagePaid.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(percentagePaid, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}