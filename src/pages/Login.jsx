import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [popup, setPopup] = useState(null);

  const navigate = useNavigate();

  async function handleLogin() {

    try {

      await signInWithEmailAndPassword(auth, email, password);

      setPopup({
        type: "success",
        message: "Login successful! Redirecting..."
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (error) {

      setPopup({
        type: "error",
        message: "Invalid email or password"
      });

    }

    setTimeout(() => {
      setPopup(null);
    }, 3000);

  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">

      {/* Animated background glow */}
      <motion.div
        className="absolute w-96 h-96 bg-indigo-600 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 200, 0], y: [0, -100, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Popup Message */}
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 20, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className={`absolute top-5 px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
              popup.type === "success"
                ? "bg-green-600"
                : "bg-red-600"
            }`}
          >
            {popup.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900/80 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-8 w-96 shadow-2xl"
      >

        <motion.h2
          className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          NeuroPath AI Login
        </motion.h2>

        {/* Email */}
        <div className="flex items-center bg-gray-800 rounded-lg mb-4 p-3 border border-indigo-500/20">
          <FaEnvelope className="text-indigo-400 mr-3" />
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent outline-none text-white w-full"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-gray-800 rounded-lg mb-4 p-3 border border-indigo-500/20">
          <FaLock className="text-indigo-400 mr-3" />
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent outline-none text-white w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <motion.button
          onClick={handleLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <FaSignInAlt />
          Login
        </motion.button>

        {/* Signup link */}
        <p className="text-gray-400 mt-4 text-center">

          Don't have an account?

          <span
            onClick={() => navigate("/signup")}
            className="text-indigo-400 ml-2 cursor-pointer hover:text-indigo-300"
          >
            Signup
          </span>

        </p>

      </motion.div>

    </div>

  );

}