import { useState, useEffect } from "react";
import { auth, db, storage } from "../firebase";
import { signOut } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSignOutAlt,
  FaUserCircle,
  FaCamera
} from "react-icons/fa";

export default function Settings() {

  const user = auth.currentUser;

  const [profileURL, setProfileURL] = useState("");
  const [popup, setPopup] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  LOAD PROFILE IMAGE
  */
  useEffect(() => {

    async function loadProfile() {

      if (!user) return;

      const docRef = doc(db, "users", user.uid);

      const snap = await getDoc(docRef);

      if (snap.exists()) {

        setProfileURL(snap.data().photoURL);

      }

      setLoading(false);

    }

    loadProfile();

  }, [user]);

  /*
  UPLOAD PROFILE IMAGE
  */
  async function handleImageUpload(e) {

    const file = e.target.files[0];

    if (!file) return;

    const storageRef = ref(storage, `profiles/${user.uid}`);

    await uploadBytes(storageRef, file);

    const url = await getDownloadURL(storageRef);

    await setDoc(doc(db, "users", user.uid), {
      photoURL: url,
      email: user.email
    });

    setProfileURL(url);

    setPopup({
      message: "Profile picture updated"
    });

    setTimeout(() => setPopup(null), 2000);

  }

  /*
  LOGOUT
  */
  async function handleLogout() {

    await signOut(auth);

    setPopup({
      message: "Logged out successfully"
    });

    setTimeout(() => {

      window.location.href = "/login";

    }, 1500);

  }

  if (loading) {

    return (
      <div className="text-white p-10">
        Loading Settings...
      </div>
    );

  }

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-indigo-950 text-white p-10">

        {/* Popup */}
        <AnimatePresence>
          {popup && (
            <motion.div
              initial={{ opacity: 0, y: -40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-5 right-5 bg-indigo-600 px-6 py-3 rounded-lg shadow-lg"
            >
              {popup.message}
            </motion.div>
          )}
        </AnimatePresence>


        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Account Settings
        </h1>


        {/* Profile Card */}
        <motion.div
          className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl mb-6 border border-indigo-500/20 w-96"
          whileHover={{ scale: 1.02 }}
        >

          <div className="flex flex-col items-center">

            {/* Profile Image */}
            <div className="relative">

              {profileURL ? (

                <img
                  src={profileURL}
                  className="w-28 h-28 rounded-full object-cover border border-indigo-400"
                />

              ) : (

                <FaUserCircle size={110} />

              )}

              {/* Upload Button */}
              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer">

                <FaCamera />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

              </label>

            </div>


            <p className="mt-4 text-lg font-semibold">
              {user.email}
            </p>

          </div>

        </motion.div>


        {/* Logout Card */}
        <motion.div
          className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl border border-red-500/20 w-96"
          whileHover={{ scale: 1.02 }}
        >

          <h2 className="text-xl mb-4 font-semibold">
            Session
          </h2>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2"
          >

            <FaSignOutAlt />

            Logout

          </motion.button>

        </motion.div>

      </div>

    </div>

  );

}