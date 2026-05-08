import { useEffect, useState } from "react";
import { fetchRecommendations } from "../utils/adaptiveLearning";
import { auth } from "../firebase";
import { motion } from "framer-motion";

export default function Recommendations() {
  const [recs, setRecs] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const list = await fetchRecommendations(user.uid);
      setRecs(list);
    };
    load();
  }, []);

  if (!recs) {
    return <p className="text-gray-400">Loading recommendations...</p>;
  }

  if (recs.length === 0) {
    return <p className="text-gray-400">No recommendations yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recs.map((r) => (
        <motion.div
          key={r.id}
          whileHover={{ scale: 1.03 }}
          className="bg-gray-800 p-4 rounded-xl shadow-lg border border-indigo-500/20"
        >
          <div className="text-sm opacity-70">Topic:</div>
          <div className="font-medium mb-2">{r.topic}</div>
          <div className="text-xs uppercase opacity-80">Strength: {r.strengthLevel}</div>
          <div className="mt-2 text-indigo-300">{r.recommendedNextTopic}</div>
        </motion.div>
      ))}
    </div>
  );
}
