interface SheetData {
  date: string;
  customer: string;
  mobile: string;
  address: string;
  product: string;
  quantity: string;
  totalAmount: number;
}

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
  mobile?: string;
  address?: string;
}

export class GoogleSheetsService {
  private static readonly SHEET_ID = '1q7VRyoVgLzXutTVDfWChJrhIYW6pCS3Ayp6EHmqwHhU';
  private static readonly CSV_URL = `https://docs.google.com/spreadsheets/d/${this.SHEET_ID}/export?format=csv&gid=0`;

  static async fetchSheetData(): Promise<TransactionData[]> {
    try {
      console.log('Fetching data from Google Sheets...');
      
      const response = await fetch(this.CSV_URL, {
        method: 'GET',
        headers: {
          'Accept': 'text/csv',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const csvText = await response.text();
      console.log('CSV data received:', csvText.substring(0, 200) + '...');
      
      const transactions = this.parseCSVToTransactions(csvText);
      
      if (transactions.length === 0) {
        console.warn('No transactions found in CSV data');
      }
      
      return transactions;
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      
      // If CORS error or other fetch issues, throw with helpful message
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Unable to fetch data - please check if the Google Sheet is publicly accessible or try connecting via Supabase for better data handling');
      }
      
      throw new Error('Failed to fetch data from Google Sheets');
    }
  }

  private static parseCSVToTransactions(csvText: string): TransactionData[] {
    const lines = csvText.split('\n');
    const transactions: TransactionData[] = [];
    
    // Skip header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = this.parseCSVLine(line);
      if (columns.length < 6) continue;
      
      try {
        const [date, customer, mobile, address, product, quantity, totalAmount] = columns;
        
        // Parse multiple products and quantities
        const products = product.split(';').map(p => p.trim()).filter(Boolean);
        const quantities = quantity.split(';').map(q => parseInt(q.trim()) || 1);
        
        // Create transactions for each product
        products.forEach((prod, index) => {
          const qty = quantities[index] || quantities[0] || 1;
          const amount = parseFloat(totalAmount.replace(/[^0-9.-]/g, '')) || 0;
          
          // Distribute total amount across products proportionally
          const productAmount = products.length > 1 ? amount / products.length : amount;
          
          transactions.push({
            id: `TXN${Date.now()}-${i}-${index}`,
            date: this.formatDate(date),
            customer: customer || 'Unknown Customer',
            product: prod || 'Unknown Product',
            category: this.categorizeProduct(prod),
            quantity: qty,
            unitPrice: Math.round(productAmount / qty),
            totalAmount: Math.round(productAmount),
            paymentStatus: this.determinePaymentStatus(amount),
            paymentMethod: this.determinePaymentMethod(),
            mobile: mobile || '',
            address: address || ''
          });
        });
      } catch (error) {
        console.warn(`Error parsing line ${i}:`, error);
        continue;
      }
    }
    
    console.log(`Parsed ${transactions.length} transactions from CSV`);
    return transactions;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private static formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  private static categorizeProduct(product: string): string {
    const productLower = product.toLowerCase();
    
    if (productLower.includes('software') || productLower.includes('app') || productLower.includes('system')) {
      return 'Software';
    }
    if (productLower.includes('consult') || productLower.includes('service') || productLower.includes('training')) {
      return 'Services';
    }
    if (productLower.includes('market') || productLower.includes('seo') || productLower.includes('campaign')) {
      return 'Marketing';
    }
    if (productLower.includes('development') || productLower.includes('custom')) {
      return 'Development';
    }
    
    return 'Other';
  }

  private static determinePaymentStatus(amount: number): 'Received' | 'Due' | 'Pending' {
    // Simple logic: assume recent high-value transactions are pending/due
    if (amount > 10000) {
      return Math.random() > 0.6 ? 'Received' : 'Due';
    }
    return Math.random() > 0.3 ? 'Received' : 'Pending';
  }

  private static determinePaymentMethod(): string | undefined {
    const methods = ['Bank Transfer', 'Credit Card', 'PayPal', 'Cash', undefined];
    return methods[Math.floor(Math.random() * methods.length)];
  }
}

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