import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp
} from "firebase/firestore";

/*
SAVE CHAT MESSAGE
*/
export async function saveChatMessage(userMessage, aiResponse) {

  try {

    const user = auth.currentUser;

    if (!user) {
      console.log("No user logged in");
      return;
    }

    await addDoc(collection(db, "chatHistory"), {

      userId: user.uid,

      message: userMessage,

      response: aiResponse,

      createdAt: serverTimestamp()

    });

    console.log("Chat saved successfully");

  } catch (error) {

    console.error("Error saving chat:", error);

  }

}

/*
LOAD CHAT HISTORY
*/
export async function loadChatHistory() {

  try {

    const user = auth.currentUser;

    if (!user) {
      console.log("No user found");
      return [];
    }

    const q = query(
      collection(db, "chatHistory"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    const history = [];

    snapshot.forEach((doc) => {

      const data = doc.data();

      history.push({
        message: data.message,
        response: data.response,
        createdAt: data.createdAt
      });

    });

    console.log("Loaded history:", history);

    return history;

  } catch (error) {

    console.error("Error loading chat:", error);

    return [];

  }

}