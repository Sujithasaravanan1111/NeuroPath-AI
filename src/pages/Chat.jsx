import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import AnimatedBackground from "../components/AnimatedBackground";
import { chatWithAI } from "../ai";
import Sidebar from "../components/Sidebar";
import { auth } from "../firebase";
import { saveChatMessage, loadChatHistory } from "../utils/chatHistory";

export default function Chat() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  /*
  AUTO SCROLL TO BOTTOM
  */
 useEffect(() => {

  const unsubscribe = auth.onAuthStateChanged(async (user) => {

    if (!user) return;

    try {

      const history = await loadChatHistory();

      const welcomeMessage = {
        role: "assistant",
        text: "Hi! 👋 I'm your NeuroPath AI Tutor. Ask me anything about learning, creating learning paths, taking quizzes, earning certificates, or how to make the most of NeuroPath AI!"
      };

      if (history.length > 0) {

        const formatted = [];

        history.forEach(item => {

          formatted.push({
            role: "user",
            text: item.message
          });

          formatted.push({
            role: "assistant",
            text: item.response
          });

        });

        setMessages([welcomeMessage, ...formatted]);

      } else {

        setMessages([welcomeMessage]);

      }

    } catch (error) {

      console.error(error);

    }

  });

  return () => unsubscribe();

}, []);
  /*
  SEND MESSAGE
  */
  async function sendMessage() {

    if (!input.trim()) return;

    const userText = input;

    const userMsg = {
      role: "user",
      text: userText
    };

    setMessages(prev => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    try {

      const aiResponse = await chatWithAI(userText);

      const aiMsg = {
        role: "assistant",
        text: aiResponse
      };

      setMessages(prev => [...prev, aiMsg]);

      /*
      SAVE TO FIREBASE
      */
      await saveChatMessage(userText, aiResponse);

    } catch (error) {

      console.error(error);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, error occurred."
        }
      ]);

    } finally {

      setLoading(false);

    }

  }

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 relative min-h-screen bg-gradient-to-b from-slate-900 via-gray-900 to-slate-950">

        <AnimatedBackground />

        <div className="p-8 max-w-4xl mx-auto relative z-10">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-center"
          >

            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              NeuroPath AI Tutor
            </h1>

            <p className="text-gray-400">
              Ask me anything about learning and development
            </p>

          </motion.div>


          <motion.div
            className="bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 min-h-[400px] max-h-[600px] flex flex-col gap-4 shadow-2xl border border-indigo-500/20 mb-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >

            {messages.map((m, i) => (

              <motion.div
                key={i}
                className={`flex gap-3 ${
                  m.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {m.role === "assistant" && (
                  <div className="text-2xl text-indigo-400">
                    <FaRobot />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    m.role === "assistant"
                      ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border border-indigo-400/30"
                      : "bg-gradient-to-r from-blue-600/40 to-indigo-600/40 text-white border border-blue-400/30"
                  }`}
                >
                  {m.text}
                </div>

                {m.role === "user" && (
                  <div className="text-2xl text-blue-400">
                    <FaUser />
                  </div>
                )}

              </motion.div>

            ))}

            {loading && (
              <div className="text-indigo-400">
                AI typing...
              </div>
            )}

            <div ref={chatEndRef} />

          </motion.div>


          <div className="flex gap-3">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              className="flex-1 p-4 rounded-lg bg-gray-800 text-white"
              placeholder="Ask your AI tutor..."
            />

            <button
              onClick={sendMessage}
              className="bg-indigo-600 px-4 py-2 rounded text-white"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}