import { motion } from "framer-motion";

export default function AchievementBadge({ title, achieved }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      animate={{ scale: achieved ? [1, 1.03, 1] : 1 }}
      transition={{ duration: 0.6 }}
      className={`p-3 rounded-xl text-white flex items-center gap-3 shadow-lg ${achieved ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-purple-500/40' : 'bg-gray-800/60'}`}
    >
      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{achieved ? '🏅' : '🔒'}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs opacity-80">{achieved ? 'Unlocked' : 'Locked'}</div>
      </div>
    </motion.div>
  );
}

