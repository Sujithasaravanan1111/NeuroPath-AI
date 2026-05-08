import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("xp", "desc"));
        const snapshot = await getDocs(q);
        const list = [];
        snapshot.forEach((d) => {
          const data = d.data();
          list.push({ id: d.id, email: data.email || "", xp: data.xp || 0 });
        });
        setUsers(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Leaderboard 🏆</h1>
        {loading ? (
          <LoadingSkeleton count={5} />
        ) : (
          <table className="w-full table-auto text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">XP</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2 break-words">{u.email}</td>
                <td className="px-4 py-2">{u.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

