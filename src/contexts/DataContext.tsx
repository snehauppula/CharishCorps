import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { GoogleSheetsService, TransactionData } from '../services/googleSheetsService';
import { useToast } from '@/components/ui/use-toast';

interface DataContextType {
  transactions: TransactionData[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  lastUpdated: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (enabled: boolean) => void;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default
  const { toast } = useToast();

  const fetchData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await GoogleSheetsService.fetchSheetData(forceRefresh);
      setTransactions(data);
      setLastUpdated(new Date());
      
      if (data.length > 0 && forceRefresh) {
        toast({
          title: "Data Updated",
          description: `Refreshed ${data.length} transactions from Google Sheets`,
          duration: 3000,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching data:', err);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData(true);
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchData(false); // Use cache if available
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const value: DataContextType = {
    transactions,
    loading,
    error,
    refreshData,
    lastUpdated,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    setRefreshInterval,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};