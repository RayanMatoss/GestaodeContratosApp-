
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContractDialog } from "@/components/ContractDialog";
import { ContractList } from "@/components/ContractList";
import { DashboardStats } from "@/components/DashboardStats";
import { AlertsList } from "@/components/AlertsList";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [isContractDialogOpen, setIsContractDialogOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <Header />

        {/* Action Button */}
        <div className="flex justify-end mb-8">
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
