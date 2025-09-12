import React from 'react';
import { motion } from 'framer-motion';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, Phone, MapPin, Package, Hash, DollarSign } from 'lucide-react';

export const DataTable: React.FC = () => {
  const { transactions, loading } = useData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Apparel': 'bg-blue-100 text-blue-800',
      'Merchandise': 'bg-green-100 text-green-800',
      'Design Services': 'bg-purple-100 text-purple-800',
      'Logistics': 'bg-orange-100 text-orange-800',
      'Software': 'bg-indigo-100 text-indigo-800',
      'Services': 'bg-teal-100 text-teal-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Development': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors['Other'];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bills Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading bills data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <FileText className="h-5 w-5" />
            Bills Data
            <Badge variant="secondary" className="ml-2 text-xs font-medium">
              {transactions.length} records
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-semibold">Date</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">Customer</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span className="font-semibold">Mobile</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-semibold">Address</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="font-semibold">Product</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[80px]">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4" />
                      <span className="font-semibold">Qty</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">Amount</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[120px]"><span className="font-semibold">Category</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No bills data available
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction, index) => (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.customer}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {transaction.mobile || '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate font-medium">
                        {transaction.address || '-'}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="truncate font-medium" title={transaction.product}>
                          {transaction.product}
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {transaction.quantity}
                      </TableCell>
                      <TableCell className="font-medium text-right">
                        {formatCurrency(transaction.totalAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(transaction.category)}>
                          {transaction.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {transactions.length > 0 && (
            <div className="mt-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Bills:</span>
                  <span className="ml-2 font-medium">{transactions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="ml-2 font-medium text-green-600">
                    {formatCurrency(transactions.reduce((sum, t) => sum + t.totalAmount, 0))}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Unique Customers:</span>
                  <span className="ml-2 font-medium">
                    {new Set(transactions.map(t => t.customer)).size}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Categories:</span>
                  <span className="ml-2 font-medium">
                    {new Set(transactions.map(t => t.category)).size}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
