import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useData } from "../../contexts/DataContext";
import { getTopCategories, getEngagementTrend } from "../../services/googleSheetsService";

const CHART_COLORS = {
  primary: "hsl(17 98% 58%)",      // Brand Orange
  secondary: "hsl(30 26% 39%)",    // Brand Brown
  accent: "hsl(45 29% 94%)",       // Brand Cream
  success: "hsl(120 60% 50%)",     // Green
  warning: "hsl(45 100% 60%)",     // Amber
};

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay: number;
}

const ChartCard = ({ title, subtitle, children, delay }: ChartCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className="chart-container group"
    >
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="h-80">
        {children}
      </div>
    </motion.div>
  );
};

export const ChartsSection = () => {
  const { transactions, loading } = useData();
  
  const topCategories = getTopCategories(transactions);
  const engagementTrend = getEngagementTrend(transactions);
  
  // Prepare pie chart data with colors
  const pieData = topCategories.map((item, index) => ({
    ...item,
    fill: Object.values(CHART_COLORS)[index % Object.values(CHART_COLORS).length]
  }));

  return (
    <section>
      <motion.h2 
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        Analytics & Insights
      </motion.h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Top Categories Bar Chart */}
        <ChartCard
          title="Top Categories"
          subtitle="Revenue by product category"
          delay={0}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topCategories} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <Bar 
                dataKey="revenue" 
                fill={CHART_COLORS.primary}
                radius={[8, 8, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Revenue Trend Line Chart */}
        <ChartCard
          title="Revenue Trend"
          subtitle="Daily revenue performance"
          delay={0.1}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementTrend} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke={CHART_COLORS.primary}
                strokeWidth={3}
                dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: CHART_COLORS.secondary, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Distribution Pie Chart */}
        <ChartCard
          title="Category Distribution"
          subtitle="Revenue share by category"
          delay={0.2}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
                className="hover:opacity-80 transition-opacity"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Payment Status Overview */}
        <ChartCard
          title="Payment Status"
          subtitle="Payment completion rates"
          delay={0.3}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={[
                { status: 'Received', count: transactions.filter(t => t.paymentStatus === 'Received').length, fill: CHART_COLORS.success },
                { status: 'Due', count: transactions.filter(t => t.paymentStatus === 'Due').length, fill: CHART_COLORS.warning },
                { status: 'Pending', count: transactions.filter(t => t.paymentStatus === 'Pending').length, fill: CHART_COLORS.secondary },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="status" 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                stroke="hsl(var(--border))"
              />
              <Bar 
                dataKey="count" 
                radius={[8, 8, 0, 0]}
                className="hover:opacity-80 transition-opacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </section>
  );
};