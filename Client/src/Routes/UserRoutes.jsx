import { Route } from "react-router-dom";
import MainLayout from "../Components/Layout/MainLayout";
import Home from "../Pages/Home";
import Election from "../Pages/Election";
import ViewElection from "../Pages/ViewElection";
import Login from "../Pages/Login";
import VoiceDemo from "../Pages/VoiceDemo";
import AudioTest from "../Pages/AudioTest";

export const userRoutes = (
  <>
    <Route path="/app" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="election" element={<Election />} />
      <Route path="election/:id" element={<ViewElection />} />
      {/* Result routes removed - only accessible to admin */}
    </Route>
    <Route path="/login" element={<Login />} />
    <Route path="/voice-demo" element={<VoiceDemo />} />
    <Route path="/audio-test" element={<AudioTest />} />
  </>
);
