// Mock data structure matching the Google Sheets format
export interface TransactionData {
  id: string;
  date: string;
  customer: string;
  product: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: 'Received' | 'Due' | 'Pending';
  paymentMethod?: string;
}

export const mockTransactions: TransactionData[] = [
  {
    id: "TXN001",
    date: "2024-01-15",
    customer: "Tech Solutions Ltd",
    product: "Enterprise Software License",
    category: "Software",
    quantity: 5,
    unitPrice: 2500,
    totalAmount: 12500,
    paymentStatus: "Received",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TXN002",
    date: "2024-01-16",
    customer: "Global Manufacturing Inc",
    product: "Consulting Services",
    category: "Services",
    quantity: 40,
    unitPrice: 150,
    totalAmount: 6000,
    paymentStatus: "Due",
  },
  {
    id: "TXN003",
    date: "2024-01-17",
    customer: "Retail Chain Co",
    product: "Marketing Campaign",
    category: "Marketing",
    quantity: 1,
    unitPrice: 8500,
    totalAmount: 8500,
    paymentStatus: "Received",
    paymentMethod: "Credit Card"
  },
  {
    id: "TXN004",
    date: "2024-01-18",
    customer: "Healthcare Partners",
    product: "Data Analysis Tool",
    category: "Software",
    quantity: 3,
    unitPrice: 1200,
    totalAmount: 3600,
    paymentStatus: "Pending",
  },
  {
    id: "TXN005",
    date: "2024-01-19",
    customer: "Finance Corp",
    product: "Training Program",
    category: "Services",
    quantity: 25,
    unitPrice: 200,
    totalAmount: 5000,
    paymentStatus: "Received",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "TXN006",
    date: "2024-01-20",
    customer: "Energy Solutions",
    product: "Custom Development",
    category: "Software",
    quantity: 1,
    unitPrice: 15000,
    totalAmount: 15000,
    paymentStatus: "Due",
  },
  {
    id: "TXN007",
    date: "2024-01-21",
    customer: "Logistics Network",
    product: "SEO Optimization",
    category: "Marketing",
    quantity: 6,
    unitPrice: 800,
    totalAmount: 4800,
    paymentStatus: "Received",
    paymentMethod: "PayPal"
  },
  {
    id: "TXN008",
    date: "2024-01-22",
    customer: "Educational Institute",
    product: "Consultation",
    category: "Services",
    quantity: 15,
    unitPrice: 300,
    totalAmount: 4500,
    paymentStatus: "Pending",
  }
];

// Utility functions for data processing
export const calculateTotalRevenue = (data: TransactionData[]) => {
  return data.reduce((sum, transaction) => sum + transaction.totalAmount, 0);
};

export const calculateTotalOrders = (data: TransactionData[]) => {
  return data.length;
};

export const calculatePaymentsReceived = (data: TransactionData[]) => {
  return data
    .filter(transaction => transaction.paymentStatus === 'Received')
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);
};

export const calculatePaymentsDue = (data: TransactionData[]) => {
  return data
    .filter(transaction => transaction.paymentStatus === 'Due')
    .reduce((sum, transaction) => sum + transaction.totalAmount, 0);
};

export const getTopCategories = (data: TransactionData[]) => {
  const categoryTotals = data.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + transaction.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryTotals)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
};

export const getEngagementTrend = (data: TransactionData[]) => {
  const dailyTotals = data.reduce((acc, transaction) => {
    const date = transaction.date;
    acc[date] = (acc[date] || 0) + transaction.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(dailyTotals)
    .map(([date, revenue]) => ({ 
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      revenue 
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};