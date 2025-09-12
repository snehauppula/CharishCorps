import { motion } from "framer-motion";
import { DollarSign, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { calculatePaymentsReceived, calculatePaymentsDue } from "../../services/googleSheetsService";

interface PaymentCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  variant: 'received' | 'due';
  transactions: any[];
  delay: number;
}

const PaymentCard = ({ title, amount, icon, variant, transactions, delay }: PaymentCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const cardStyles = variant === 'received' 
    ? "border-success/20 bg-gradient-to-br from-success/5 to-transparent" 
    : "border-warning/20 bg-gradient-to-br from-warning/5 to-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`glass-card p-6 ${cardStyles}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${
          variant === 'received' 
            ? 'bg-success text-success-foreground' 
            : 'bg-warning text-warning-foreground'
        } shadow-lg`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${
            variant === 'received' ? 'text-success' : 'text-warning'
          }`}>
            {formatCurrency(amount)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Transactions:</span>
          <span className="font-medium">{transactions.length}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Average:</span>
          <span className="font-medium">
            {transactions.length > 0 ? formatCurrency(amount / transactions.length) : '$0'}
          </span>
        </div>
      </div>

      {/* Recent transactions preview */}
      <div className="mt-4 pt-4 border-t border-border/50">
        <p className="text-xs font-medium text-muted-foreground mb-2">Recent Transactions:</p>
        <div className="space-y-1">
          {transactions.slice(0, 2).map((transaction, index) => (
            <div key={transaction.id} className="flex justify-between items-center text-xs">
              <span className="truncate max-w-32">{transaction.customer}</span>
              <span className="font-medium">{formatCurrency(transaction.totalAmount)}</span>
            </div>
          ))}
          {transactions.length > 2 && (
            <p className="text-xs text-muted-foreground">+{transactions.length - 2} more...</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const PaymentsSection = () => {
  const { transactions } = useData();
  
  const paymentsReceived = calculatePaymentsReceived(transactions);
  const paymentsDue = calculatePaymentsDue(transactions);
  
  const receivedTransactions = transactions.filter(t => t.paymentStatus === 'Received');
  const dueTransactions = transactions.filter(t => t.paymentStatus === 'Due');
  const pendingTransactions = transactions.filter(t => t.paymentStatus === 'Pending');

  return (
    <section>
      <motion.h2 
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Payment Management
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        <PaymentCard
          title="Payments Received"
          amount={paymentsReceived}
          icon={<CheckCircle className="w-6 h-6" />}
          variant="received"
          transactions={receivedTransactions}
          delay={0}
        />
        
        <PaymentCard
          title="Payments Due"
          amount={paymentsDue}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="due"
          transactions={dueTransactions}
          delay={0.1}
        />

        {/* Payment Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="glass-card p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Payment Summary</h3>
              <p className="text-sm text-muted-foreground">Overall status</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Collection Rate:</span>
              <span className="font-bold text-primary">
                {((paymentsReceived / (paymentsReceived + paymentsDue)) * 100).toFixed(1)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending Orders:</span>
              <span className="font-medium text-warning">{pendingTransactions.length}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Outstanding:</span>
              <span className="font-bold text-warning">
                ${(paymentsDue + pendingTransactions.reduce((sum, t) => sum + t.totalAmount, 0)).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-700"
                style={{ 
                  width: `${(paymentsReceived / (paymentsReceived + paymentsDue)) * 100}%` 
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};