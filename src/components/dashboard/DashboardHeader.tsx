import { motion } from "framer-motion";
import { RefreshCw, Calendar } from "lucide-react";

export const DashboardHeader = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="glass-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gradient-primary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Charish Corporates
          </motion.h1>
          <motion.p 
            className="text-muted-foreground flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Calendar className="w-4 h-4" />
            {currentDate}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <button className="btn-glass group">
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            <span>Refresh Data</span>
          </button>
          
          <div className="glass-card px-4 py-2 bg-gradient-primary text-primary-foreground">
            <span className="font-semibold">Live Dashboard</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
};