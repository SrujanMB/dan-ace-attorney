import { BrowserRouter, Routes, Route } from "react-router";
import CourtRoom from "./pages/CourtRoom";
import Buzzer from "./pages/Buzzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourtRoom />} />
        <Route path="/playerA" element={<Buzzer team="A" />} />
        <Route path="/playerB" element={<Buzzer team="B" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
