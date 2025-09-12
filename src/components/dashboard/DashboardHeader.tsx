import { motion } from "framer-motion";
import { RefreshCw, MessageCircle } from "lucide-react";
import { useData } from "../../contexts/DataContext";

export const DashboardHeader = () => {
  const { refreshData, loading } = useData();

  const handleRefresh = async () => {
    await refreshData();
  };

  const handleTelegramRedirect = () => {
    const telegramUrl = import.meta.env.VITE_TELEGRAM_BOT_URL;
    if (!telegramUrl) {
      console.error('VITE_TELEGRAM_BOT_URL environment variable is not set');
      return;
    }
    window.open(telegramUrl, '_blank');
  };

  return (
    <header className="glass-card p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img 
              src="/CharishCorps.jpg" 
              alt="Charish Corporates Logo" 
              className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover shadow-lg border-2 border-white/20"
            />
            <h1 className="text-3xl md:text-4xl font-bold text-gradient-primary tracking-tight">
              Charish Corporates
            </h1>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4"
        >
          <button 
            className="btn-glass group"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
            <span className="font-semibold">{loading ? 'Refreshing...' : 'Refresh Data'}</span>
          </button>

          <button 
            className="btn-glass group bg-gradient-to-r from-[#0088cc] to-[#0088cc] text-white hover:from-[#006699] hover:to-[#006699]"
            onClick={handleTelegramRedirect}
            title="Add an Invoice via Telegram Bot"
          >
            <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
            <span className="font-semibold">Add an Invoice</span>
          </button>
        </motion.div>
      </div>
    </header>
  );
};