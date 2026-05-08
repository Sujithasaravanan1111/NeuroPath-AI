import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { auth, db } from "../firebase";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const base = snap.exists() ? snap.data() : {};
      // load certificates
      const certsQ = query(collection(db, "certificates"), where("userId", "==", user.uid));
      const certSnap = await getDocs(certsQ);
      const certs = [];
      certSnap.forEach((d) => certs.push(d.data().courseName));
      setUserData({ email: user.email, certificates: certs, ...base });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">
          <LoadingSkeleton count={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gradient-to-b from-slate-900 to-gray-900 min-h-screen text-white">
        <motion.div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-4">Profile</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm opacity-80">Email</div>
              <div className="font-medium mt-1">{userData.email}</div>
            </div>

            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm opacity-80">XP</div>
              <div className="font-medium mt-1">{userData.xp || 0}</div>
            </div>

            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm opacity-80">Streak</div>
              <div className="font-medium mt-1">{userData.streak || 0}</div>
            </div>

            <div className="bg-gray-900 p-4 rounded">
              <div className="text-sm opacity-80">Joined</div>
              <div className="font-medium mt-1">{userData.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : "-"}</div>
            </div>
          </div>

          <div className="mt-6 bg-gray-900 p-4 rounded">
            <div className="text-sm opacity-80">Certificates</div>
            <ul className="mt-2 list-disc list-inside">
              {(userData.certificates || []).length === 0 && <li>No certificates yet</li>}
              {(userData.certificates || []).map((c, i) => (
                <li key={i} className="truncate">{c}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
 
