import { Navigate, Route, Routes } from "react-router-dom";
import { LandingPage } from "./pages/public/Landing";
import { StartAssessment } from "./pages/public/StartAssessment";
import { Questionnaire } from "./pages/public/Questionnaire";
import { Results } from "./pages/public/Results";
import { Leaderboard } from "./pages/public/Leaderboard";
import { Admin } from "./pages/admin/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/start" element={<StartAssessment />} />
      <Route path="/assessment/:id" element={<Questionnaire />} />
      <Route path="/results/:id" element={<Results />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
