import { motion } from "framer-motion";

export default function LoadingSkeleton({ count = 4 }) {
  const items = Array.from({ length: count });
  return (
    <div className="space-y-4">
      {items.map((_, i) => (
        <motion.div
          key={i}
          className="h-20 bg-gray-700 rounded-lg opacity-70"
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
