
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";
import { useContractStore } from "@/stores/contractStore";

export const AlertsList = () => {
  const { contracts } = useContractStore();

  const expiringContracts = contracts.filter(contract => {
    const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).map(contract => ({
    ...contract,
    daysUntilExpiry: Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  }));

  if (expiringContracts.length === 0) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <CardTitle className="flex items-center text-orange-800">
          <Bell className="w-5 h-5 mr-2" />
          Alertas de Vencimento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {expiringContracts.map((contract) => (
            <div key={contract.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">{contract.municipality}</p>
                  <p className="text-sm text-gray-600">{contract.object}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                {contract.daysUntilExpiry} dias restantes
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
