import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardCards() {

  const [streak, setStreak] = useState(0);
  const [xp, setXP] = useState(0);

  useEffect(() => {

    const loadData = async () => {

      const userRef = doc(db, "users", auth.currentUser.uid);

      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {

        setStreak(docSnap.data().streak || 0);
        setXP(docSnap.data().xp || 0);

      }

    };

    loadData();

  }, []);

  return (

    <div className="grid grid-cols-2 gap-6">

      <div className="bg-blue-600 p-6 rounded">
        🔥 Streak: {streak}
      </div>

      <div className="bg-green-600 p-6 rounded">
        🏆 XP: {xp}
      </div>

    </div>

  );

}
