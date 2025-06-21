import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Upload from "./pages/Upload";
import Summary from "./pages/Summary";
import Logs from "./pages/Logs";
import Report from "./pages/Report";
import Assistant from "./pages/Assistant";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-white/40 backdrop-blur-md shadow-md border-b border-white/30 px-6 py-3 sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">OPEN API</h1>
        <div className="space-x-4">
          <Link to="/" className="text-blue-600 hover:underline font-semibold">Upload</Link>
          <Link to="/logs" className="text-blue-600 hover:underline font-semibold">Logs</Link>
          <Link to="/report" className="text-blue-600 hover:underline font-semibold">report</Link>
          <Link to="/assistant/latest" className="text-blue-600 hover:underline font-semibold">assistent</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/summary/:id" element={<Summary />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/report" element={<Report />} /> {/* NEW */}
        <Route path="/assistant/latest" element={<Assistant />} />
      </Routes>
    </BrowserRouter>
  );
}
