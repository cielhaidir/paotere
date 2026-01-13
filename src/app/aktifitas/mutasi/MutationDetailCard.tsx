
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MutationDetailCardProps {
  mutationId: string;
  total: number;
  totalUsed: number;
}

export function MutationDetailCard({ mutationId, total, totalUsed }: MutationDetailCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const remaining = total - totalUsed;
  const percentageUsed = total > 0 ? (totalUsed / total) * 100 : 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Informasi Mutasi</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">ID Mutasi</span>
            <span className="font-semibold">{mutationId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Mutasi</span>
            <span className="font-semibold">{formatCurrency(total)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Terpakai</span>
            <span className="font-semibold text-blue-600">{formatCurrency(totalUsed)}</span>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-sm text-muted-foreground">Sisa</span>
            <span className="font-semibold text-orange-600">{formatCurrency(remaining)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pemakaian</span>
            <span>{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(percentageUsed, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
