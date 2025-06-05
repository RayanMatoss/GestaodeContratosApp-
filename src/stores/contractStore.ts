
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Contract {
  id: string;
  municipality: string;
  object: string;
  startDate: string;
  endDate: string;
  totalValue: number;
  notes?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  contractId: string;
  number: string;
  value: number;
  date: string;
  createdAt: string;
}

interface ContractStore {
  contracts: Contract[];
  invoices: Invoice[];
  addContract: (contract: Omit<Contract, 'id' | 'createdAt'>) => void;
  updateContract: (id: string, updates: Partial<Contract>) => void;
  removeContract: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  removeInvoice: (id: string) => void;
}

export const useContractStore = create<ContractStore>()(
  persist(
    (set, get) => ({
      contracts: [
        {
          id: '1',
          municipality: 'Prefeitura de São Paulo',
          object: 'Prestação de serviços de consultoria em tecnologia da informação para modernização dos sistemas municipais',
          startDate: '2024-01-15',
          endDate: '2024-12-31',
          totalValue: 150000,
          notes: 'Contrato piloto para implementação de sistema integrado de gestão municipal.',
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: '2',
          municipality: 'Câmara Municipal de Campinas',
          object: 'Desenvolvimento e manutenção de portal de transparência',
          startDate: '2024-02-01',
          endDate: '2025-01-31',
          totalValue: 75000,
          notes: 'Inclui treinamento da equipe e suporte técnico por 12 meses.',
          createdAt: '2024-02-01T14:30:00Z'
        },
        {
          id: '3',
          municipality: 'Prefeitura de Santos',
          object: 'Implantação de sistema de gestão de recursos humanos',
          startDate: '2024-03-01',
          endDate: '2024-08-30',
          totalValue: 95000,
          notes: 'Migração de dados do sistema legado incluída no escopo.',
          createdAt: '2024-03-01T09:15:00Z'
        }
      ],
      invoices: [
        {
          id: '1',
          contractId: '1',
          number: '001/2024',
          value: 25000,
          date: '2024-02-15',
          createdAt: '2024-02-15T10:00:00Z'
        },
        {
          id: '2',
          contractId: '1',
          number: '002/2024',
          value: 30000,
          date: '2024-03-15',
          createdAt: '2024-03-15T10:00:00Z'
        },
        {
          id: '3',
          contractId: '2',
          number: '003/2024',
          value: 15000,
          date: '2024-03-01',
          createdAt: '2024-03-01T10:00:00Z'
        },
        {
          id: '4',
          contractId: '3',
          number: '004/2024',
          value: 35000,
          date: '2024-04-01',
          createdAt: '2024-04-01T10:00:00Z'
        }
      ],
      addContract: (contract) => {
        const newContract: Contract = {
          ...contract,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ contracts: [...state.contracts, newContract] }));
      },
      updateContract: (id, updates) => {
        set((state) => ({
          contracts: state.contracts.map((contract) =>
            contract.id === id ? { ...contract, ...updates } : contract
          )
        }));
      },
      removeContract: (id) => {
        set((state) => ({
          contracts: state.contracts.filter((contract) => contract.id !== id),
          invoices: state.invoices.filter((invoice) => invoice.contractId !== id)
        }));
      },
      addInvoice: (invoice) => {
        const newInvoice: Invoice = {
          ...invoice,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        set((state) => ({ invoices: [...state.invoices, newInvoice] }));
      },
      removeInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== id)
        }));
      }
    }),
    {
      name: 'contract-storage'
    }
  )
);
