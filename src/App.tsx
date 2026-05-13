import { BrowserRouter, Routes, Route } from "react-router";
import { routes } from "./routes";
import CourtRoom from "./pages/CourtRoom";
import Buzzer from "./pages/Buzzer";
import Setup from "./pages/Setup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.SETUP} element={<Setup />} />
        <Route path={routes.COURT} element={<CourtRoom />} />
        <Route path={routes.PLAYER_A} element={<Buzzer team="A" />} />
        <Route path={routes.PLAYER_B} element={<Buzzer team="B" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
