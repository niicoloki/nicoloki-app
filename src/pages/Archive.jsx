import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Archive from "./pages/Archive";

function Home() {
  const nav = useNavigate();

  return (
    <div style={{
      background: "#050505",
      color: "#eaeaea",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "monospace"
    }}>
      <div style={{
        border: "1px solid #222",
        padding: 60,
        textAlign: "center"
      }}>
        <div style={{ opacity: 0.3 }}>
          // СИСТЕМА ИНИЦИАЛИЗИРОВАНА
        </div>

        <h1>НИКОЛОКИ</h1>

        <div style={{ opacity: 0.4 }}>
          МИР БЕЗ ГРАНИЦ
        </div>

        <button
          onClick={() => nav("/archive")}
          style={{ marginTop: 30 }}
        >
          ВОЙТИ В СИГНАЛ
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/archive" element={<Archive />} />
      </Routes>
    </BrowserRouter>
  );
}