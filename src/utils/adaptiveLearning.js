import { db } from "../firebase";
import { collection, addDoc, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from "firebase/firestore";

// Records a quiz result and updates userProgress accordingly.
export async function recordQuizResult(userId, topic, score, difficulty) {
  // save raw result
  try {
    await addDoc(collection(db, "quizResults"), {
      userId,
      topic,
      score,
      difficulty,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("Failed to save quiz result:", err);
  }

  // determine strength
  let strengthLevel = "medium";
  if (score < 50) strengthLevel = "weak";
  else if (score >= 80) strengthLevel = "strong";

  // recommended next topic logic
  let recommendedNextTopic = "";
  if (strengthLevel === "weak") {
    recommendedNextTopic = `Review ${topic}`;
  } else if (strengthLevel === "strong") {
    recommendedNextTopic = `Advance from ${topic}`;
  } else {
    recommendedNextTopic = `Continue practicing ${topic}`;
  }

  // upsert progress document
  const key = `${userId}_${topic}`;
  const progRef = doc(db, "userProgress", key);
  const snap = await getDoc(progRef);
  const data = {
    userId,
    topic,
    strengthLevel,
    recommendedNextTopic,
    updatedAt: new Date(),
  };
  if (snap.exists()) {
    await updateDoc(progRef, data);
  } else {
    await setDoc(progRef, data);
  }

  // adjust difficulty
  let newDifficulty = difficulty;
  if (score >= 80) {
    if (difficulty === "beginner") newDifficulty = "intermediate";
    else if (difficulty === "intermediate") newDifficulty = "advanced";
  } else if (score < 50) {
    if (difficulty === "advanced") newDifficulty = "intermediate";
    else if (difficulty === "intermediate") newDifficulty = "beginner";
  }

  return newDifficulty;
}

// fetch recommendations for user
export async function fetchRecommendations(userId) {
  const q = query(collection(db, "userProgress"), where("userId", "==", userId));
  const snap = await getDocs(q);
  const recs = [];
  snap.forEach((d) => recs.push({ id: d.id, ...d.data() }));
  return recs;
}
