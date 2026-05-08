import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { generateLearningPath } from "../ai";

export default function Dashboard() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [savedPaths, setSavedPaths] = useState([]);

  useEffect(() => {
    const updateStreak = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      const today = new Date().toDateString();

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          streak: 1,
          lastLogin: today,
          xp: 0,
        });
      } else {
        const data = docSnap.data();
        if (data.lastLogin !== today) {
          await setDoc(userRef, {
            ...data,
            streak: (data.streak || 0) + 1,
            lastLogin: today,
          });
        }
      }
    };

    const loadSavedPaths = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "users", user.uid, "learningPaths")
      );
      const snapshot = await getDocs(q);
      const paths = [];
      snapshot.forEach((d) => paths.push({ id: d.id, ...d.data() }));
      setSavedPaths(paths);
    };

    updateStreak();
    loadSavedPaths();
  }, []);

  const saveLearningPath = async (topic, content) => {
    const user = auth.currentUser;
    if (!user) return;
    await addDoc(
      collection(db, "users", user.uid, "learningPaths"),
      { topic, content, createdAt: new Date() }
    );
    // reload saved paths
    const q = query(collection(db, "users", user.uid, "learningPaths"));
    const snapshot = await getDocs(q);
    const paths = [];
    snapshot.forEach((d) => paths.push({ id: d.id, ...d.data() }));
    setSavedPaths(paths);
  };

  const handleGenerate = async () => {
    if (!topic) return;
    setResult("Generating...");
    const r = await generateLearningPath(topic);
    setResult(r);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Welcome to NeuroPath AI 🚀</h1>

        <DashboardCards />

        <div className="mt-8 bg-gray-800 p-6 rounded">
          <input
            type="text"
            placeholder="Enter topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="p-2 text-black w-full rounded"
          />
          <div className="mt-4">
            <button onClick={handleGenerate} className="bg-blue-600 px-4 py-2 rounded mr-2">
              Generate
            </button>
            <button
              onClick={() => saveLearningPath(topic, result)}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
          {result && (
            <pre className="mt-4 whitespace-pre-wrap">{result}</pre>
          )}
        </div>

        <h2 className="text-2xl mt-6 mb-4">Saved Paths</h2>
        {savedPaths.map((p) => (
          <div key={p.id} className="bg-gray-800 p-4 mb-4 rounded">
            <h3 className="text-xl font-bold">{p.topic}</h3>
            <pre>{p.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}