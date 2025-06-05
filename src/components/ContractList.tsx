
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, User, Plus } from "lucide-react";
import { useContractStore } from "@/stores/contractStore";
import { useState } from "react";
import { ContractDetailsDialog } from "@/components/ContractDetailsDialog";

export const ContractList = () => {
  const { contracts, invoices } = useContractStore();
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const getContractStatus = (contract: any) => {
    const today = new Date();
    const endDate = new Date(contract.endDate);
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return { label: "Vencido", color: "destructive" };
    if (daysUntilExpiry <= 30) return { label: "Vencendo", color: "default" };
    return { label: "Ativo", color: "secondary" };
  };

  const getContractBalance = (contractId: string, totalValue: number) => {
    const contractInvoices = invoices.filter(inv => inv.contractId === contractId);
    const totalInvoiced = contractInvoices.reduce((sum, inv) => sum + inv.value, 0);
    return totalValue - totalInvoiced;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Contratos</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contracts.map((contract) => {
          const status = getContractStatus(contract);
          const balance = getContractBalance(contract.id, contract.totalValue);
          const progressPercentage = ((contract.totalValue - balance) / contract.totalValue) * 100;

          return (
            <Card 
              key={contract.id} 
              className="hover:shadow-lg transition-all duration-300 cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:scale-105"
              onClick={() => setSelectedContractId(contract.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg">{contract.municipality}</CardTitle>
                  </div>
                  <Badge variant={status.color as any}>{status.label}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{contract.object}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valor Total:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.totalValue)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Saldo:</span>
                    <span className="font-medium text-green-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {progressPercentage.toFixed(1)}% utilizado
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FileText className="w-4 h-4 mr-1" />
                    {invoices.filter(inv => inv.contractId === contract.id).length} NFs
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedContractId && (
        <ContractDetailsDialog
          contractId={selectedContractId}
          isOpen={!!selectedContractId}
          onClose={() => setSelectedContractId(null)}
        />
      )}
    </div>
  );
};
