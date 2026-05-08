import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AnimatedBackground from "../components/AnimatedBackground";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Certificates() {
  const [certs, setCerts] = useState(null);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(
        collection(db, "certificates"),
        where("userId", "==", user.uid)
      );
      const snap = await getDocs(q);
      const list = [];
      snap.forEach((d) => list.push(d.data()));
      setCerts(list);
    };
    load();
  }, []);

  if (certs === null) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AnimatedBackground />
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">
        <motion.div
          className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold mb-4">Your Certificates</h1>
          {certs.length === 0 ? (
            <p className="text-gray-400">You have no certificates yet.</p>
          ) : (
            <ul className="space-y-2">
              {certs.map((c, i) => (
                <li key={i} className="bg-gray-900 p-3 rounded flex justify-between items-center">
                  <span className="truncate mr-4">{c.courseName}</span>
                  {/* future: provide download link if you store file URL */}
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
