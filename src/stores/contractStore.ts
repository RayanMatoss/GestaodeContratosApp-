
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
      contracts: [],
      invoices: [],
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
