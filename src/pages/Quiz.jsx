import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { generateQuiz } from "../ai";
import { AI_API_KEY } from "../config/env";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { recordQuizResult } from "../utils/adaptiveLearning";
import { handleError } from "../utils/errorHandler";

export default function Quiz() {

  const [topic, setTopic] = useState("");
  const [quiz, setQuiz] = useState("");

  const missingKey = !AI_API_KEY;
  if (missingKey && !import.meta.env.DEV) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">
          <h1 className="text-3xl mb-6">Quiz Generator 🧠</h1>
          <p className="text-yellow-400">
            AI API key not configured. Please set <code>VITE_AI_API_KEY</code> in
            your <code>.env</code> file and restart the app.
          </p>
        </div>
      </div>
    );
  }

  const handleGenerateQuiz = async () => {

    const result = await generateQuiz(topic);

    setQuiz(result);

  };

  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState("beginner");

  const handleCompleteQuiz = async () => {
    try {
      const resultDifficulty = await recordQuizResult(
        auth.currentUser.uid,
        topic,
        score,
        difficulty
      );
      await addDoc(collection(db, "quizResults"), {
        userId: auth.currentUser.uid,
        topic: topic,
        score,
        difficulty: resultDifficulty,
        completedAt: new Date(),
      });
      alert("Quiz completed! +10 XP");
    } catch (err) {
      console.error(err);
      alert(handleError(err));
    }
  };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-10 bg-gray-900 min-h-screen text-white">

        <h1 className="text-3xl mb-6">
          Quiz Generator 🧠
        </h1>
        {missingKey && import.meta.env.DEV && (
          <p className="text-yellow-400 mb-4">
            <strong>Dev notice:</strong> AI API key not set. Responses will be
            mocked. Set <code>VITE_AI_API_KEY</code> to enable real generation.
          </p>
        )}

        <input
          className="p-2 text-black rounded w-full"
          placeholder="Enter topic"
          onChange={(e) => setTopic(e.target.value)}
        />

        <button
          className="bg-blue-600 px-4 py-2 mt-4 rounded"
          onClick={handleGenerateQuiz}
        >
          Generate Quiz
        </button>

        {quiz && (

          <div className="mt-6">

            <pre>{quiz}</pre>

            <div className="mt-4 space-y-2">
              <div>
                <label className="mr-2">Score (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-20 p-1 rounded text-black"
                />
              </div>
              <div>
                <label className="mr-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="p-1 rounded text-black"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <button
              className="bg-green-600 px-4 py-2 mt-4 rounded"
              onClick={handleCompleteQuiz}
            >
              Mark Complete
            </button>

          </div>

        )}

      </div>

    </div>

  );

}
