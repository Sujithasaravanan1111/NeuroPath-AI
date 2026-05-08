import Sidebar from "../components/Sidebar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, increment } from "firebase/firestore";
import { generateLearningPath } from "../ai";
import { generateCertificate } from "../utils/certificate";
import { AI_API_KEY } from "../config/env";

export default function LearningPaths() {
  const [topic, setTopic] = useState("");
  const [generatedPath, setGeneratedPath] = useState("");
  const [savedPaths, setSavedPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  // show a banner if the AI key is missing in production; in dev we allow the UI
  const missingKey = !AI_API_KEY;
  if (missingKey && !import.meta.env.DEV) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">
          <h1 className="text-3xl font-bold mb-6">Learning Paths 📚</h1>
          {missingKey && import.meta.env.DEV && (
            <p className="text-yellow-400 mb-4">
              <strong>Dev notice:</strong> AI API key not set. Using mock
              responses. Set <code>VITE_AI_API_KEY</code> to enable real
              generation.
            </p>
          )}
          <p className="text-yellow-400">
            AI API key not configured. Please set <code>VITE_AI_API_KEY</code> in
            your <code>.env</code> file and reload the app.
          </p>
        </div>
      </div>
    );
  }

  // don't read auth.currentUser here; use inside effects or callbacks

  const handleGenerate = async () => {

    if (!topic) return;

    setGeneratedPath("Generating...");

    const result = await generateLearningPath(topic);

    setGeneratedPath(result);
  };

  const handleSave = async () => {

    // prevent saving when the output is an error or placeholder
    if (!generatedPath) return;
    const isErrorOutput = generatedPath.startsWith("Error:") ||
      generatedPath.toLowerCase().includes("api key not configured");
    if (isErrorOutput) {
      alert("Cannot save because the generated content is an error message.");
      return;
    }
    if (!AI_API_KEY && import.meta.env.DEV) {
      alert(
        "Cannot save learning path because AI API key is missing. " +
          "Set VITE_AI_API_KEY to generate real content."
      );
      return;
    }

    const u = auth.currentUser;
    if (!u) return;

    await addDoc(collection(db, "learningPaths"), {
      userId: u.uid,
      topic: topic,
      content: generatedPath,
      createdAt: new Date(),
    });

    // increase xp
    const userRef = doc(db, "users", u.uid);
    await updateDoc(userRef, { xp: increment(20) });

    alert("Learning Path Saved! (XP +20)");

    loadSavedPaths(u);
  };

  const loadSavedPaths = async (u) => {
    if (!u) return;
    const q = query(
      collection(db, "learningPaths"),
      where("userId", "==", u.uid)
    );
    const querySnapshot = await getDocs(q);
    const paths = [];
    querySnapshot.forEach((doc) => {
      paths.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    setSavedPaths(paths);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this learning path?")) {
      try {
        await deleteDoc(doc(db, "learningPaths", id));
        alert("Learning Path Deleted!");
        const u = auth.currentUser;
        loadSavedPaths(u);
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Failed to delete learning path");
      }
    }
  };

  useEffect(() => {
    const init = async (u) => {
      if (u) {
        await loadSavedPaths(u);
        setLoading(false);
      }
    };
    const unsub = auth.onAuthStateChanged((u) => {
      init(u);
    });
    return () => unsub();
  }, []);

  // grab the user when rendering so we can use it in event handlers
  const currentUser = auth.currentUser;

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">

        <h1 className="text-3xl font-bold mb-6">
          Learning Paths 📚
        </h1>

        <div className="bg-gray-800 p-6 rounded-xl mb-6">

          <input
            type="text"
            placeholder="Enter topic (Python, AI, etc)"
            className="p-2 text-black w-full rounded"
            onChange={(e) => setTopic(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            className="mt-4 bg-blue-600 px-4 py-2 rounded"
          >
            Generate Learning Path
          </button>

          {generatedPath && (

            <div className="mt-4">

              <pre>{generatedPath}</pre>

              <button
                onClick={handleSave}
                disabled={missingKey && import.meta.env.DEV}
                className={
                  "mt-4 px-4 py-2 rounded " +
                  (missingKey && import.meta.env.DEV
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600")
                }
                title={
                  missingKey && import.meta.env.DEV
                    ? "Cannot save mock path without AI key"
                    : "Save Learning Path"
                }
              >
                Save Learning Path
              </button>

            </div>

          )}

        </div>

        <h2 className="text-2xl mb-4">
          Saved Learning Paths
        </h2>

        {loading ? (
          <LoadingSkeleton count={3} />
        ) : (
          savedPaths.map((path) => (
            <div key={path.id} className="bg-gray-800 p-4 mb-4 rounded">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">{path.topic}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDelete(path.id)}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() =>
                      generateCertificate(
                        currentUser?.email,
                        path.topic,
                        currentUser?.uid
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                  >
                    Certificate
                  </button>
                </div>
              </div>
              <pre className="bg-gray-900 p-3 rounded overflow-auto max-h-64">
                {path.content}
              </pre>
            </div>
          ))
        )}

      </div>

    </div>

  );
}
