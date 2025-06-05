
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, FileText, Bell, User } from "lucide-react";
import { ContractDialog } from "@/components/ContractDialog";
import { ContractList } from "@/components/ContractList";
import { DashboardStats } from "@/components/DashboardStats";
import { AlertsList } from "@/components/AlertsList";

const Index = () => {
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Gestão de Contratos
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie contratos públicos, notas fiscais e acompanhe prazos
            </p>
          </div>
          <Button 
            onClick={() => setIsContractDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Contrato
          </Button>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Alerts Section */}
        <div className="mb-8">
          <AlertsList />
        </div>

        {/* Contracts List */}
        <ContractList />

        {/* Contract Dialog */}
        <ContractDialog 
          isOpen={isContractDialogOpen}
          onClose={() => setIsContractDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
