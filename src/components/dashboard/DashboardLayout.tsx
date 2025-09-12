import { motion } from "framer-motion";
import { DashboardHeader } from "./DashboardHeader";
import { KPIGrid } from "./KPIGrid";
import { ChartsSection } from "./ChartsSection";
import { QuickActionsPanel } from "./QuickActionsPanel";
import { DataTable } from "./DataTable";
import { LiveClock } from "./LiveClock";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-background p-4 md:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-7xl mx-auto space-y-6 md:space-y-8"
      >
        <DashboardHeader />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className="lg:col-span-2">
            <KPIGrid />
          </div>
          <div className="lg:col-span-1">
            <QuickActionsPanel />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <ChartsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <DataTable />
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DashboardLayout;