import { FaHome, FaUser, FaBook, FaBrain, FaTrophy, FaMedal, FaRobot, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { to: "/dashboard", label: "Dashboard", icon: <FaHome /> },
    { to: "/learning", label: "Learning", icon: <FaBook /> },
    { to: "/quiz", label: "Quiz", icon: <FaBrain /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
    { to: "/chat", label: "AI Tutor", icon: <FaRobot /> },
    { to: "/certificates", label: "Certificates", icon: <FaMedal /> },
    { to: "/leaderboard", label: "Leaderboard", icon: <FaTrophy /> },
    { to: "/settings", label: "Settings", icon: <FaCog /> },

  ];

  return (
    <motion.aside
      initial={{ x: -220 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="h-screen w-72 bg-gradient-to-b from-gray-950 via-slate-900 to-indigo-950 text-white p-6 shadow-2xl border-r border-indigo-500/20"
    >
      <motion.div
        className="text-3xl font-extrabold mb-8 cursor-pointer bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        onClick={() => navigate("/dashboard")}
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        NeuroPath AI
      </motion.div>

      <nav className="flex flex-col gap-2">
        {items.map((it, idx) => {
          const active = location.pathname === it.to;
          return (
            <motion.div
              key={it.to}
              onClick={() => navigate(it.to)}
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                active
                  ? "bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-pink-600/20 ring-1 ring-indigo-400/50 shadow-lg shadow-indigo-500/20"
                  : "hover:bg-white/5"
              }`}
            >
              <motion.div
                className={`text-lg ${active ? "text-indigo-300" : "text-gray-400"}`}
                animate={active ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: active ? Infinity : 0 }}
              >
                {it.icon}
              </motion.div>
              <div className={`font-medium ${active ? "opacity-100 text-white" : "opacity-80 text-gray-300"}`}>{it.label}</div>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        className="mt-auto text-xs opacity-60 pt-6 border-t border-indigo-500/20 text-center"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        Version 1.0 • NeuroPath
      </motion.div>
    </motion.aside>
  );
}
