import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Settings from "./pages/Settings";
const Login = React.lazy(() => import("./pages/Login"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Profile = React.lazy(() => import("./pages/Profile"));
const LearningPaths = React.lazy(() => import("./pages/LearningPaths"));
const Quiz = React.lazy(() => import("./pages/Quiz"));
const Leaderboard = React.lazy(() => import("./pages/Leaderboard"));
const Certificates = React.lazy(() => import("./pages/Certificates"));
const Chat = React.lazy(() => import("./pages/Chat"));

export default function App() {

  return (

    <BrowserRouter>

      <Suspense fallback={<LoadingSkeleton />}>      
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/learning" element={<LearningPaths />} />

        <Route path="/quiz" element={<Quiz />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/certificates" element={<Certificates />} />

        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
      </Suspense>

    </BrowserRouter>

  );

}
