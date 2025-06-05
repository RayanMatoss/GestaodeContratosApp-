
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, FileText, Calendar, Trash2 } from "lucide-react";
import { useContractStore } from "@/stores/contractStore";
import { toast } from "@/hooks/use-toast";

interface ContractDetailsDialogProps {
  contractId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractDetailsDialog = ({ contractId, isOpen, onClose }: ContractDetailsDialogProps) => {
  const { contracts, invoices, addInvoice, removeInvoice, updateContract } = useContractStore();
  const [newInvoice, setNewInvoice] = useState({ number: "", value: "", date: "" });
  const [notes, setNotes] = useState("");

  const contract = contracts.find(c => c.id === contractId);
  const contractInvoices = invoices.filter(inv => inv.contractId === contractId);

  useEffect(() => {
    if (contract) {
      setNotes(contract.notes || "");
    }
  }, [contract]);

  if (!contract) return null;

  const totalInvoiced = contractInvoices.reduce((sum, inv) => sum + inv.value, 0);
  const balance = contract.totalValue - totalInvoiced;
  const progressPercentage = (totalInvoiced / contract.totalValue) * 100;

  const handleAddInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newInvoice.number || !newInvoice.value || !newInvoice.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos da nota fiscal.",
        variant: "destructive",
      });
      return;
    }

    const value = parseFloat(newInvoice.value.replace(/[^\d,]/g, '').replace(',', '.'));
    
    if (value > balance) {
      toast({
        title: "Erro",
        description: "O valor da nota fiscal não pode ser maior que o saldo do contrato.",
        variant: "destructive",
      });
      return;
    }

    addInvoice({
      contractId,
      number: newInvoice.number,
      value,
      date: newInvoice.date
    });

    setNewInvoice({ number: "", value: "", date: "" });
    
    toast({
      title: "Sucesso",
      description: "Nota fiscal adicionada com sucesso!",
    });
  };

  const handleUpdateNotes = () => {
    updateContract(contractId, { notes });
    toast({
      title: "Sucesso",
      description: "Observações atualizadas com sucesso!",
    });
  };

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    const amount = parseFloat(numbers) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount || 0);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setNewInvoice(prev => ({ ...prev, value: formatted }));
  };

  const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const getStatusBadge = () => {
    if (daysUntilExpiry < 0) return <Badge variant="destructive">Vencido</Badge>;
    if (daysUntilExpiry <= 30) return <Badge variant="outline">Vencendo em {daysUntilExpiry} dias</Badge>;
    return <Badge variant="secondary">Ativo</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{contract.municipality}</DialogTitle>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contract Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Informações do Contrato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Objeto</Label>
                <p className="text-sm">{contract.object}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data Inicial</Label>
                  <p className="text-sm">{new Date(contract.startDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Data Final</Label>
                  <p className="text-sm">{new Date(contract.endDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Valor Total</Label>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.totalValue)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Faturado</Label>
                  <p className="text-lg font-semibold text-blue-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvoiced)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Saldo</Label>
                  <p className="text-lg font-semibold text-green-600">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600 mb-2 block">Progresso</Label>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% utilizado</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Resumo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{contractInvoices.length}</p>
                <p className="text-sm text-gray-600">Notas Fiscais</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{Math.max(daysUntilExpiry, 0)}</p>
                <p className="text-sm text-gray-600">Dias restantes</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{(balance / contract.totalValue * 100).toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Saldo disponível</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="invoices" className="mt-6">
          <TabsList>
            <TabsTrigger value="invoices">Notas Fiscais</TabsTrigger>
            <TabsTrigger value="notes">Observações</TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4">
            {/* Add New Invoice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nova Nota Fiscal</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddInvoice} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Número da NF"
                    value={newInvoice.number}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, number: e.target.value }))}
                  />
                  <Input
                    placeholder="Valor"
                    value={newInvoice.value}
                    onChange={handleValueChange}
                  />
                  <Input
                    type="date"
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice(prev => ({ ...prev, date: e.target.value }))}
                  />
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Invoices List */}
            <div className="space-y-3">
              {contractInvoices.map((invoice) => (
                <Card key={invoice.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium">NF {invoice.number}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="font-semibold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(invoice.value)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            removeInvoice(invoice.id);
                            toast({ title: "Nota fiscal removida com sucesso!" });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {contractInvoices.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma nota fiscal cadastrada</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observações e Anotações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Adicione observações, lembretes ou anotações sobre este contrato..."
                  rows={8}
                />
                <Button onClick={handleUpdateNotes} className="bg-gradient-to-r from-blue-600 to-blue-700">
                  Salvar Observações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
