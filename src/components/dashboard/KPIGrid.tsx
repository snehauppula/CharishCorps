import { motion } from "framer-motion";
import { TrendingUp, ShoppingCart, CreditCard, AlertCircle } from "lucide-react";
import { useData } from "../../contexts/DataContext";
import { 
  calculateTotalRevenue, 
  calculateTotalOrders, 
  calculatePaymentsReceived, 
  calculatePaymentsDue 
} from "../../services/googleSheetsService";

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  delay: number;
}

const KPICard = ({ title, value, subtitle, icon, trend, delay }: KPICardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="kpi-card group"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-lg bg-gradient-primary text-primary-foreground shadow-glow">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-medium ${
              trend.isPositive ? 'text-success' : 'text-destructive'
            }`}>
              <TrendingUp className={`w-4 h-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
              {trend.value}%
            </div>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gradient-primary">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const KPIGrid = () => {
  const { transactions, loading } = useData();
  
  const totalRevenue = calculateTotalRevenue(transactions);
  const totalOrders = calculateTotalOrders(transactions);
  const paymentsReceived = calculatePaymentsReceived(transactions);
  const paymentsDue = calculatePaymentsDue(transactions);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const kpiCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtitle: "Across all transactions",
      icon: <TrendingUp className="w-6 h-6" />,
      trend: { value: 12.5, isPositive: true },
      delay: 0
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      subtitle: "Completed transactions",
      icon: <ShoppingCart className="w-6 h-6" />,
      trend: { value: 8.3, isPositive: true },
      delay: 0.1
    },
    {
      title: "Payments Received",
      value: formatCurrency(paymentsReceived),
      subtitle: "Successfully collected",
      icon: <CreditCard className="w-6 h-6" />,
      trend: { value: 15.2, isPositive: true },
      delay: 0.2
    },
    {
      title: "Payments Due",
      value: formatCurrency(paymentsDue),
      subtitle: "Pending collection",
      icon: <AlertCircle className="w-6 h-6" />,
      trend: { value: 3.7, isPositive: false },
      delay: 0.3
    }
  ];

  return (
    <section>
      <motion.h2 
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Key Performance Indicators
        {loading && (
          <span className="text-sm font-normal text-muted-foreground ml-2">
            Loading...
          </span>
        )}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {kpiCards.map((card, index) => (
          <KPICard key={card.title} {...card} />
        ))}
      </div>
    </section>
  );
};