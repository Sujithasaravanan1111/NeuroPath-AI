import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon, color = "bg-indigo-500" }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.05 }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`relative flex items-center p-6 rounded-2xl shadow-xl ${color} text-white overflow-hidden group`}
      layout
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-50 bg-white/20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Icon with pulse animation */}
      <motion.div
        className="text-4xl mr-6 relative z-10"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        {icon}
      </motion.div>

      {/* Text content */}
      <div className="relative z-10">
        <motion.div
          className="text-sm opacity-90 font-semibold"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {title}
        </motion.div>
        <motion.div
          className="text-3xl font-black mt-2"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {value}
        </motion.div>
      </div>

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/30"
        animate={{ boxShadow: ['0 0 0 0 rgba(255,255,255,0.3)', '0 0 20px 5px rgba(255,255,255,0)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}

