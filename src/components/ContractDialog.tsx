
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useContractStore } from "@/stores/contractStore";
import { toast } from "@/hooks/use-toast";

interface ContractDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContractDialog = ({ isOpen, onClose }: ContractDialogProps) => {
  const [formData, setFormData] = useState({
    municipality: "",
    object: "",
    startDate: "",
    endDate: "",
    totalValue: "",
    notes: ""
  });

  const { addContract } = useContractStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.municipality || !formData.object || !formData.startDate || !formData.endDate || !formData.totalValue) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    addContract({
      municipality: formData.municipality,
      object: formData.object,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalValue: parseFloat(formData.totalValue.replace(/[^\d,]/g, '').replace(',', '.')),
      notes: formData.notes
    });

    toast({
      title: "Sucesso",
      description: "Contrato cadastrado com sucesso!",
    });

    setFormData({
      municipality: "",
      object: "",
      startDate: "",
      endDate: "",
      totalValue: "",
      notes: ""
    });
    
    onClose();
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
    setFormData(prev => ({ ...prev, totalValue: formatted }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Contrato</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="municipality">Município *</Label>
            <Input
              id="municipality"
              value={formData.municipality}
              onChange={(e) => setFormData(prev => ({ ...prev, municipality: e.target.value }))}
              placeholder="Nome do município"
              required
            />
          </div>

          <div>
            <Label htmlFor="object">Objeto do Contrato *</Label>
            <Textarea
              id="object"
              value={formData.object}
              onChange={(e) => setFormData(prev => ({ ...prev, object: e.target.value }))}
              placeholder="Descrição do objeto do contrato"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data Inicial *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="endDate">Data Final *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="totalValue">Valor Total *</Label>
            <Input
              id="totalValue"
              value={formData.totalValue}
              onChange={handleValueChange}
              placeholder="R$ 0,00"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Anotações e observações sobre o contrato"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
