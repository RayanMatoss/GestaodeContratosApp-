
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Calendar, Bell, User } from "lucide-react";
import { useContractStore } from "@/stores/contractStore";

export const DashboardStats = () => {
  const { contracts, invoices } = useContractStore();

  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => new Date(c.endDate) > new Date()).length;
  const totalValue = contracts.reduce((sum, contract) => sum + contract.totalValue, 0);
  const totalInvoiced = invoices.reduce((sum, invoice) => sum + invoice.value, 0);
  const expiringContracts = contracts.filter(c => {
    const daysUntilExpiry = Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  }).length;

  const stats = [
    {
      title: "Contratos Ativos",
      value: activeContracts,
      total: totalContracts,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Valor Total",
      value: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(totalValue),
      subtitle: "em contratos",
      icon: User,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Faturado",
      value: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(totalInvoiced),
      subtitle: "total de notas",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Vencendo em 30 dias",
      value: expiringContracts,
      total: totalContracts,
      icon: Bell,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stat.value}
              {stat.total && (
                <span className="text-sm font-normal text-gray-500 ml-1">
                  / {stat.total}
                </span>
              )}
            </div>
            {stat.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
