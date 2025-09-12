import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Settings, 
  TrendingUp, 
  Users, 
  Wifi, 
  WifiOff,
  AlertCircle,
  FileSpreadsheet,
  BarChart3
} from 'lucide-react';

export const QuickActionsPanel: React.FC = () => {
  const { 
    transactions, 
    loading, 
    error
  } = useData();

  const [isExporting, setIsExporting] = useState(false);

  // Calculate quick insights
  const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
  const uniqueCustomers = new Set(transactions.map(t => t.customer)).size;
  const topCustomer = transactions.reduce((acc, t) => {
    acc[t.customer] = (acc[t.customer] || 0) + t.totalAmount;
    return acc;
  }, {} as Record<string, number>);
  const topCustomerName = Object.entries(topCustomer).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      // Create CSV content
      const headers = ['Date', 'Customer', 'Mobile', 'Address', 'Product', 'Quantity', 'Amount', 'Category', 'Payment Status'];
      const csvContent = [
        headers.join(','),
        ...transactions.map(t => [
          t.date,
          `"${t.customer}"`,
          t.mobile || '',
          `"${t.address || ''}"`,
          `"${t.product}"`,
          t.quantity,
          t.totalAmount,
          t.category,
          t.paymentStatus
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `charish-corporates-data-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const getConnectionStatus = () => {
    if (loading) return { icon: <AlertCircle className="h-4 w-4" />, text: 'Syncing', color: 'text-blue-600' };
    if (error) return { icon: <WifiOff className="h-4 w-4" />, text: 'Offline', color: 'text-red-600' };
    return { icon: <Wifi className="h-4 w-4" />, text: 'Online', color: 'text-green-600' };
  };

  const status = getConnectionStatus();

  return (
    <Card className="w-full h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2 tracking-tight">
          <BarChart3 className="h-4 w-4" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={status.color}>
              {status.icon}
            </div>
            <span className="text-sm font-medium">{status.text}</span>
          </div>
          <Badge variant="secondary" className="text-xs font-medium">
            {transactions.length} records
          </Badge>
        </div>

        {/* Quick Insights */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total Revenue:</span>
            <span className="font-semibold text-green-600">{formatCurrency(totalRevenue)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Customers:</span>
            <span className="font-semibold">{uniqueCustomers}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Top Customer:</span>
            <span className="font-semibold truncate max-w-[120px]" title={topCustomerName}>
              {topCustomerName}
            </span>
          </div>
        </div>

        {/* Export Data */}
        <Button
          onClick={handleExportData}
          disabled={isExporting || transactions.length === 0}
          size="sm"
          className="w-full"
          variant="outline"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export Data'}
        </Button>


        {/* Data Source Info */}
        <div className="text-xs text-muted-foreground border-t pt-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>Google Sheets</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
