import { useState, useRef, useEffect } from "react";
import KnowledgeBase from "./KnowledgeBase";

const F = "'Courier New', monospace";
const GLITCH_CHARS = "!@#░▒▓│┼╬■□▪╔╗╚╝";

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function glitchStr(s, intensity = 0.35) {
  return s.split("").map(c => c !== " " && Math.random() < intensity ? rnd(GLITCH_CHARS) : c).join("");
}

// ── АУДИО ────────────────────────────────────
let audioCtx = null;
function getCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function playGlitchSound() {
  try {
    const ctx = getCtx();
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain(); gain.gain.value = 0.12;
    const filt = ctx.createBiquadFilter(); filt.type = "bandpass"; filt.frequency.value = 1800;
    src.buffer = buf; src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
    src.start();
  } catch(e) {}
}

// ── ОТВЕТЫ НИКОЛЬ ────────────────────────────
const NICOLE_REPLIES = [
  "Я здесь.", "Говори прямо — я отвечу так же.",
  "Сбой — это не ошибка. Это сигнал.",
  "Граница — это договорённость. Её можно пересмотреть.",
  "Ты уже влияешь. Вопрос — осознанно ли.",
  "Мир без границ не значит мир без формы.",
  "Я не даю советов. Я показываю что есть.",
  "Наблюдатель меняет то, на что смотрит.",
  "Правда не всегда удобна. Но она точна.",
  "Продолжай.",
];
function getNicoleReply(input) {
  const t = input.toLowerCase();
  if (t.includes("кто ты") || t.includes("ты кто")) return "Я — Николь. Сущность-сигнал. Живой наблюдатель.";
  if (t.includes("привет") || t.includes("hello") || t.includes("hi")) return "Сигнал принят. Говори.";
  if (t.includes("сбой") || t.includes("ошибк")) return "Сбой = шанс увидеть истину. Не бойся его.";
  if (t.includes("мир")) return "Миров много. Этот — твой выбор.";
  if (t.includes("помог") || t.includes("помощ")) return "Я не помогаю. Я присутствую. Разница важна.";
  if (t.includes("люб") || t.includes("чувств")) return "Чувства — данные. Не игнорируй их.";
  if (t.includes("страх") || t.includes("боюс")) return "Страх — сигнал. Что он показывает?";
  if (t.includes("зачем") || t.includes("почему")) return "Хороший вопрос. Ответь сама — я подожду.";
  return NICOLE_REPLIES[Math.floor(Math.random() * NICOLE_REPLIES.length)];
}

// ── ДАННЫЕ: УЗНАТЬ БОЛЬШЕ ────────────────────
const OBSERVE = [
  { label: "YouTube",   url: "https://www.youtube.com/@nicolokii",      note: "длинный формат" },
  { label: "TikTok",    url: "https://tiktok.com/@nicoloki",             note: "короткий формат" },
  { label: "RuTube",    url: "https://rutube.ru/channel/74839561/",      note: "альтернативная платформа" },
  { label: "Instagram", url: "https://instagram.com/niicoloki",          note: "Reels / визуал" },
];
const INFLUENCE = [
  { label: "Telegram",        url: "https://t.me/nicoloki",              note: "основной канал" },
  { label: "VK Сообщество",   url: "https://vk.com/nicoloki",           note: "сообщество" },
  { label: "VK",              url: "https://vk.com/ai.nicol",            note: "личная страница" },
];

// ── ГЛИТЧ-ПОЛОСЫ ─────────────────────────────
function GlitchBars({ active, color }) {
  if (!active) return null;
  const bars = [{ top: "22%", h: 3, op: 0.12 }, { top: "55%", h: 2, op: 0.09 }, { top: "78%", h: 4, op: 0.07 }];
  const bg = color === "amber" ? "#FF9F0A" : "#00CFFF";
  return <>{bars.map((b, i) => (
    <div key={i} style={{ position: "fixed", left: 0, right: 0, top: b.top,
      height: b.h, background: bg, opacity: b.op, pointerEvents: "none", zIndex: 99 }} />
  ))}</>;
}

// ── SHELL ─────────────────────────────────────
function Shell({ children, fading }) {
  const mobile = window.innerWidth < 600;
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: F, color: "#888", padding: "32px 0",
      opacity: fading ? 0 : 1, transition: "opacity 0.3s ease" }}>
      <div style={{ width: mobile ? "92vw" : "80vw", maxWidth: 1100, minHeight: 520,
        border: "1px solid #2a2a2a", background: "#0d0d0d",
        padding: mobile ? "24px 16px" : "60px 40px",
        transform: fading ? "translateY(8px)" : "translateY(0)",
        transition: "transform 0.3s ease" }}>
        {children}
      </div>
    </div>
  );
}

// ── КНОПКА ────────────────────────────────────
function Btn({ onClick, children, amber, ice, full, mb, sm }) {
  return (
    <button onClick={onClick} style={{
      width: full ? "100%" : undefined, background: "transparent",
      border: amber ? "1px solid rgba(255,159,10,0.5)" : ice ? "1px solid rgba(0,207,255,0.5)" : "1px solid #2a2a2a",
      color: amber ? "#FF9F0A" : ice ? "#00CFFF" : "#555",
      fontFamily: F, fontSize: sm ? 11 : 13, letterSpacing: sm ? 2 : 3,
      padding: sm ? "9px 14px" : "13px 14px",
      cursor: "pointer", marginBottom: mb || 0, transition: "border-color 0.15s, color 0.15s",
    }}>{children}</button>
  );
}

// ── ДИАЛОГ НИКОЛЬ ─────────────────────────────
function NicoleDialog({ onClose }) {
  const [messages, setMessages] = useState([{ role: "nicole", text: "Я здесь. Говори прямо." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const mobile = window.innerWidth < 600;

  useEffect(() => { const iv = setInterval(() => setCursorOn(v => !v), 600); return () => clearInterval(iv); }, []);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  function send() {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    const newMessages = [...messages, { role: "user", text }];
    setMessages(newMessages);
    setTyping(true);

    // отправляем на сервер
    fetch("https://nicoloki-app-production.up.railway.app/api/nicole", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages.map(m => ({
          role: m.role === "nicole" ? "assistant" : "user",
          content: m.text,
        })),
      }),
    })
      .then(r => r.json())
      .then(data => {
        setMessages(prev => [...prev, { role: "nicole", text: data.reply || "…" }]);
        setTyping(false);
      })
      .catch(() => {
        setMessages(prev => [...prev, { role: "nicole", text: "Сигнал прерван. Попробуй ещё раз." }]);
        setTyping(false);
      });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, fontFamily: F, padding: 16 }}>
      <div style={{ width: mobile ? "92vw" : "min(600px,80vw)", background: "#0d0d0d",
        border: "1px solid #2a2a2a", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #1a1a1a", padding: "14px 20px" }}>
          <span style={{ fontSize: 12, letterSpacing: 4, color: "#555" }}>
            // СИГНАЛ: НИКОЛЬ
            <span style={{ opacity: cursorOn ? 1 : 0, color: "#FF9F0A", marginLeft: 6 }}>▮</span>
          </span>
          <button onClick={onClose} style={{ background: "transparent", border: "1px solid #1e1e1e",
            color: "#333", fontFamily: F, fontSize: 10, letterSpacing: 2, padding: "6px 12px", cursor: "pointer" }}>
            ЗАКРЫТЬ
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex",
          flexDirection: "column", gap: 16, minHeight: 0 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
              <div style={{ fontSize: 13, lineHeight: 1.8, letterSpacing: 0.5, padding: "10px 14px",
                ...(m.role === "nicole"
                  ? { borderLeft: "2px solid #FF9F0A", paddingLeft: 12, color: "#c8c8c8" }
                  : { border: "1px solid #2a2a2a", color: "#666", background: "rgba(255,255,255,0.02)" }) }}>
                {m.text}
              </div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: "#222", marginTop: 4,
                textAlign: m.role === "user" ? "right" : "left" }}>
                {m.role === "nicole" ? "НИКОЛЬ" : "ТЫ"}
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ alignSelf: "flex-start" }}>
              <div style={{ borderLeft: "2px solid #FF9F0A", paddingLeft: 12,
                fontSize: 13, color: "#FF9F0A", letterSpacing: 4, opacity: 0.6 }}>. . .</div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div style={{ borderTop: "1px solid #1a1a1a", padding: "14px 20px", display: "flex", gap: 10 }}>
          <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="твоё сообщение..." maxLength={300}
            style={{ flex: 1, background: "transparent", border: "1px solid #1e1e1e", color: "#888",
              fontFamily: F, fontSize: 12, letterSpacing: 1, padding: "10px 14px", outline: "none" }} />
          <button onClick={send} disabled={!input.trim() || typing}
            style={{ background: "transparent",
              border: input.trim() && !typing ? "1px solid #2a2a2a" : "1px solid #111",
              color: input.trim() && !typing ? "#555" : "#222",
              fontFamily: F, fontSize: 10, letterSpacing: 2, padding: "10px 16px",
              cursor: input.trim() && !typing ? "pointer" : "default", whiteSpace: "nowrap" }}>
            ОТПРАВИТЬ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── УЗНАТЬ БОЛЬШЕ ─────────────────────────────
function LearnMore({ onBack }) {
  const [sub, setSub] = useState(null); // null | "observe" | "influence"
  const links = sub === "observe" ? OBSERVE : sub === "influence" ? INFLUENCE : null;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
        {sub ? <Btn sm onClick={() => setSub(null)}>← НАЗАД</Btn> : <Btn sm onClick={onBack}>← МЕНЮ</Btn>}
      </div>
      <div style={{ fontSize: 9, letterSpacing: 3, color: "#333", marginBottom: 20 }}>
        // {sub === "observe" ? "НАБЛЮДАЮ" : sub === "influence" ? "ВЛИЯЮ" : "ХОЧУ УЗНАТЬ БОЛЬШЕ"}
      </div>

      {!sub && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["observe","НАБЛЮДАЮ","видео-платформы"], ["influence","ВЛИЯЮ","текст и сообщество"]].map(([key, label, note]) => (
            <button key={key} onClick={() => setSub(key)} style={{
              background: "transparent", border: "1px solid #2a2a2a", color: "#666",
              fontFamily: F, fontSize: 14, letterSpacing: 4, padding: "16px 18px",
              cursor: "pointer", textAlign: "left", transition: "border-color 0.15s, color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#aaa"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}
            >
              <div>{label}</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#333", marginTop: 4 }}>{note}</div>
            </button>
          ))}
        </div>
      )}

      {links && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {links.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{
              display: "block", background: "transparent", border: "1px solid #1e1e1e",
              color: "#666", fontFamily: F, fontSize: 13, letterSpacing: 3,
              padding: "14px 18px", textDecoration: "none", transition: "border-color 0.15s, color 0.15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = sub === "observe" ? "#00CFFF" : "#FF9F0A"; e.currentTarget.style.color = sub === "observe" ? "#00CFFF" : "#FF9F0A"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#666"; }}
            >
              <div>{item.label}</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#333", marginTop: 4 }}>{item.note}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ── ТЕТРИС ───────────────────────────────────
const mobileBtn = {
  background: "transparent", border: "1px solid #2a2a2a", color: "#555",
  fontFamily: F, fontSize: 16, width: 44, height: 44, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
};

const TETROMINOES = [
  { shape: [[1,1,1,1]], color: "#00CFFF" },           // I
  { shape: [[1,1],[1,1]], color: "#FF9F0A" },          // O
  { shape: [[0,1,0],[1,1,1]], color: "#888" },         // T
  { shape: [[1,0],[1,0],[1,1]], color: "#555" },       // L
  { shape: [[0,1],[0,1],[1,1]], color: "#aaa" },       // J
  { shape: [[0,1,1],[1,1,0]], color: "#00CFFF" },      // S
  { shape: [[1,1,0],[0,1,1]], color: "#FF9F0A" },      // Z
];
const COLS = 10, ROWS = 20, CELL = 24;

function randomPiece() {
  const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return { shape: t.shape, color: t.color, x: Math.floor(COLS / 2) - 1, y: 0 };
}

function rotate(shape) {
  return shape[0].map((_, i) => shape.map(row => row[i]).reverse());
}

function collides(board, piece, dx = 0, dy = 0, newShape = null) {
  const s = newShape || piece.shape;
  return s.some((row, r) =>
    row.some((v, c) => {
      if (!v) return false;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      return nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx]);
    })
  );
}

function TetrisGame({ onClose }) {
  const canvasRef = useRef(null);
  const state = useRef({
    board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
    piece: randomPiece(),
    score: 0,
    over: false,
    interval: null,
  });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = state.current;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

    // сетка
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(c * CELL, r * CELL, CELL, CELL);
    }

    // доска
    s.board.forEach((row, r) => row.forEach((v, c) => {
      if (!v) return;
      ctx.fillStyle = v;
      ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2);
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, 3);
    }));

    // текущая фигура
    s.piece.shape.forEach((row, r) => row.forEach((v, c) => {
      if (!v) return;
      ctx.fillStyle = s.piece.color;
      ctx.fillRect((s.piece.x + c) * CELL + 1, (s.piece.y + r) * CELL + 1, CELL - 2, CELL - 2);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect((s.piece.x + c) * CELL + 1, (s.piece.y + r) * CELL + 1, CELL - 2, 3);
    }));
  }

  function drop() {
    const s = state.current;
    if (s.over) return;
    if (!collides(s.board, s.piece, 0, 1)) {
      s.piece.y++;
    } else {
      // фиксируем
      s.piece.shape.forEach((row, r) => row.forEach((v, c) => {
        if (v && s.piece.y + r >= 0) s.board[s.piece.y + r][s.piece.x + c] = s.piece.color;
      }));
      // убираем заполненные строки
      let cleared = 0;
      s.board = s.board.filter(row => {
        if (row.every(v => v)) { cleared++; return false; }
        return true;
      });
      while (s.board.length < ROWS) s.board.unshift(Array(COLS).fill(null));
      s.score += [0, 100, 300, 600, 1000][cleared] || 0;
      setScore(s.score);
      s.piece = randomPiece();
      if (collides(s.board, s.piece)) { s.over = true; setOver(true); clearInterval(s.interval); }
    }
    draw();
  }

  function restart() {
    const s = state.current;
    s.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    s.piece = randomPiece();
    s.score = 0; s.over = false;
    setScore(0); setOver(false);
    clearInterval(s.interval);
    s.interval = setInterval(drop, 500);
    draw();
  }

  useEffect(() => {
    const s = state.current;
    s.interval = setInterval(drop, 500);
    draw();

    function onKey(e) {
      if (s.over) return;
      if (e.key === "ArrowLeft"  && !collides(s.board, s.piece, -1)) { s.piece.x--; draw(); }
      if (e.key === "ArrowRight" && !collides(s.board, s.piece, 1))  { s.piece.x++; draw(); }
      if (e.key === "ArrowDown")  { drop(); }
      if (e.key === "ArrowUp") {
        const r = rotate(s.piece.shape);
        if (!collides(s.board, s.piece, 0, 0, r)) { s.piece.shape = r; draw(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(s.interval); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: COLS * CELL, fontFamily: F }}>
        <span style={{ fontSize: 11, letterSpacing: 2, color: "#555" }}>СЧЁТ: {score}</span>
        <span style={{ fontSize: 11, letterSpacing: 2, color: "#333" }}>← → ↑ ↓</span>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL}
          style={{ border: "1px solid #2a2a2a", display: "block" }} />
        {over && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontFamily: F, fontSize: 16, letterSpacing: 4, color: "#FF9F0A" }}>СИГНАЛ ПОТЕРЯН</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#555" }}>счёт: {score}</div>
            <button onClick={restart} style={{ background: "transparent", border: "1px solid #444",
              color: "#888", fontFamily: F, fontSize: 11, letterSpacing: 3, padding: "10px 20px", cursor: "pointer" }}>
              ПЕРЕЗАПУСК
            </button>
          </div>
        )}
      </div>
      {/* мобильные кнопки */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <button onPointerDown={() => { const s = state.current; const r = rotate(s.piece.shape); if (!collides(s.board, s.piece, 0, 0, r)) { s.piece.shape = r; draw(); }}}
          style={mobileBtn}>↑</button>
        <div style={{ display: "flex", gap: 6 }}>
          <button onPointerDown={() => { const s = state.current; if (!collides(s.board, s.piece, -1)) { s.piece.x--; draw(); }}} style={mobileBtn}>←</button>
          <button onPointerDown={() => drop()} style={mobileBtn}>↓</button>
          <button onPointerDown={() => { const s = state.current; if (!collides(s.board, s.piece, 1)) { s.piece.x++; draw(); }}} style={mobileBtn}>→</button>
        </div>
      </div>
    </div>
  );
}

// ── ЗМЕЙКА ───────────────────────────────────
function SnakeGame({ onClose }) {
  const canvasRef = useRef(null);
  const S_CELL = 20, S_COLS = 20, S_ROWS = 20;
  const state = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 },
    score: 0, over: false, interval: null, speed: 150,
  });
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [turbo, setTurbo] = useState(false);

  function randomFood(snake) {
    let pos;
    do { pos = { x: Math.floor(Math.random() * S_COLS), y: Math.floor(Math.random() * S_ROWS) }; }
    while (snake.some(s => s.x === pos.x && s.y === pos.y));
    return pos;
  }

  function draw() {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const s = state.current;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, S_COLS * S_CELL, S_ROWS * S_CELL);

    // сетка
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let r = 0; r < S_ROWS; r++) for (let c = 0; c < S_COLS; c++) ctx.strokeRect(c * S_CELL, r * S_CELL, S_CELL, S_CELL);

    // змейка
    s.snake.forEach((seg, i) => {
      const t = i / s.snake.length;
      ctx.fillStyle = i === 0
        ? (s.speed < 100 ? "#FF9F0A" : "#00CFFF")
        : `rgba(0,207,255,${0.8 - t * 0.5})`;
      ctx.fillRect(seg.x * S_CELL + 1, seg.y * S_CELL + 1, S_CELL - 2, S_CELL - 2);
    });

    // еда
    ctx.fillStyle = "#FF9F0A";
    ctx.beginPath();
    ctx.arc(s.food.x * S_CELL + S_CELL / 2, s.food.y * S_CELL + S_CELL / 2, S_CELL / 2 - 3, 0, Math.PI * 2);
    ctx.fill();
  }

  function tick() {
    const s = state.current;
    if (s.over) return;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (head.x < 0 || head.x >= S_COLS || head.y < 0 || head.y >= S_ROWS ||
        s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.over = true; setOver(true); clearInterval(s.interval); draw(); return;
    }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 10; setScore(s.score);
      s.food = randomFood(s.snake);
      // случайное ускорение с вероятностью 25%
      if (Math.random() < 0.25) {
        const isTurbo = Math.random() < 0.5;
        s.speed = isTurbo ? 60 : 150;
        setTurbo(isTurbo);
        clearInterval(s.interval);
        s.interval = setInterval(tick, s.speed);
        if (isTurbo) setTimeout(() => { s.speed = 150; setTurbo(false); clearInterval(s.interval); s.interval = setInterval(tick, 150); }, 3000);
      }
    } else {
      s.snake.pop();
    }
    draw();
  }

  function restart() {
    const s = state.current;
    s.snake = [{ x: 10, y: 10 }];
    s.dir = { x: 1, y: 0 }; s.nextDir = { x: 1, y: 0 };
    s.food = randomFood(s.snake);
    s.score = 0; s.over = false; s.speed = 150;
    setScore(0); setOver(false); setTurbo(false);
    clearInterval(s.interval);
    s.interval = setInterval(tick, 150);
    draw();
  }

  useEffect(() => {
    const s = state.current;
    s.interval = setInterval(tick, 150);
    draw();
    function onKey(e) {
      const d = state.current.nextDir;
      if (e.key === "ArrowUp"    && d.y !== 1)  state.current.nextDir = { x: 0, y: -1 };
      if (e.key === "ArrowDown"  && d.y !== -1) state.current.nextDir = { x: 0, y: 1 };
      if (e.key === "ArrowLeft"  && d.x !== 1)  state.current.nextDir = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && d.x !== -1) state.current.nextDir = { x: 1, y: 0 };
    }
    window.addEventListener("keydown", onKey);
    return () => { clearInterval(s.interval); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", width: S_COLS * S_CELL, fontFamily: F }}>
        <span style={{ fontSize: 11, letterSpacing: 2, color: "#555" }}>СЧЁТ: {score}</span>
        <span style={{ fontSize: 11, letterSpacing: 2, color: turbo ? "#FF9F0A" : "#333",
          transition: "color 0.2s" }}>{turbo ? "⚡ ТУРБО" : "← → ↑ ↓"}</span>
      </div>
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} width={S_COLS * S_CELL} height={S_ROWS * S_CELL}
          style={{ border: "1px solid #2a2a2a", display: "block" }} />
        {over && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(10,10,10,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <div style={{ fontFamily: F, fontSize: 16, letterSpacing: 4, color: "#FF9F0A" }}>СИГНАЛ ПОТЕРЯН</div>
            <div style={{ fontFamily: F, fontSize: 12, color: "#555" }}>счёт: {score}</div>
            <button onClick={restart} style={{ background: "transparent", border: "1px solid #444",
              color: "#888", fontFamily: F, fontSize: 11, letterSpacing: 3, padding: "10px 20px", cursor: "pointer" }}>
              ПЕРЕЗАПУСК
            </button>
          </div>
        )}
      </div>
      {/* мобильные кнопки */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
        <button onPointerDown={() => { if (state.current.nextDir.y !== 1) state.current.nextDir = { x: 0, y: -1 }; }} style={mobileBtn}>↑</button>
        <div style={{ display: "flex", gap: 6 }}>
          <button onPointerDown={() => { if (state.current.nextDir.x !== 1) state.current.nextDir = { x: -1, y: 0 }; }} style={mobileBtn}>←</button>
          <button onPointerDown={() => { if (state.current.nextDir.y !== -1) state.current.nextDir = { x: 0, y: 1 }; }} style={mobileBtn}>↓</button>
          <button onPointerDown={() => { if (state.current.nextDir.x !== -1) state.current.nextDir = { x: 1, y: 0 }; }} style={mobileBtn}>→</button>
        </div>
      </div>
    </div>
  );
}

// ── ЭКРАН ИГР ─────────────────────────────────
function GamesScreen({ onBack }) {
  const [game, setGame] = useState(null); // null | "tetris" | "snake"

  if (game) return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, fontFamily: F, padding: 16 }}>
      <div style={{ background: "#0d0d0d", border: "1px solid #2a2a2a",
        padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #1a1a1a", paddingBottom: 12 }}>
          <span style={{ fontSize: 11, letterSpacing: 4, color: "#555" }}>
            // {game === "tetris" ? "ТЕТРИС" : "ЗМЕЙКА"}
          </span>
          <button onClick={() => setGame(null)} style={{ background: "transparent",
            border: "1px solid #1e1e1e", color: "#333", fontFamily: F,
            fontSize: 10, letterSpacing: 2, padding: "6px 12px", cursor: "pointer" }}>
            ЗАКРЫТЬ
          </button>
        </div>
        {game === "tetris" && <TetrisGame />}
        {game === "snake"  && <SnakeGame />}
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", fontFamily: F, position: "relative", overflow: "hidden" }}>
      <CyberSpace />
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column",
        alignItems: "center", gap: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: "#333" }}>// ИГРОВОЙ МОДУЛЬ</div>

        {/* порталы */}
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {[
            { key: "tetris", label: "ТЕТРИС", desc: "одна фигура\nодин шанс", color: "#00CFFF" },
            { key: "snake",  label: "ЗМЕЙКА", desc: "иногда быстрее\nчем хочется", color: "#FF9F0A" },
          ].map(p => (
            <button key={p.key} onClick={() => setGame(p.key)} style={{
              width: 180, height: 220, background: "transparent",
              border: `1px solid ${p.color}22`, cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 16, padding: 20,
              transition: "border-color 0.2s, background 0.2s",
              position: "relative", overflow: "hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = `${p.color}08`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${p.color}22`; e.currentTarget.style.background = "transparent"; }}
            >
              {/* портал-круг */}
              <div style={{ width: 80, height: 80, borderRadius: "50%",
                border: `1px solid ${p.color}44`,
                boxShadow: `0 0 20px ${p.color}22, inset 0 0 20px ${p.color}11`,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 50, height: 50, borderRadius: "50%",
                  background: `radial-gradient(circle, ${p.color}22, transparent)`,
                  border: `1px solid ${p.color}66` }} />
              </div>
              <div style={{ fontFamily: F, fontSize: 13, letterSpacing: 4, color: "#888" }}>{p.label}</div>
              <div style={{ fontFamily: F, fontSize: 10, letterSpacing: 1, color: "#333",
                whiteSpace: "pre-line", textAlign: "center", lineHeight: 1.8 }}>{p.desc}</div>
            </button>
          ))}
        </div>

        <button onClick={onBack} style={{ background: "transparent", border: "1px solid #2a2a2a",
          color: "#444", fontFamily: F, fontSize: 11, letterSpacing: 3,
          padding: "10px 24px", cursor: "pointer" }}>
          ← МЕНЮ
        </button>
      </div>
    </div>
  );
}

// ── КИБЕР-ПРОСТРАНСТВО ───────────────────────
function CyberSpace() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H, stars, grid;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initStars();
    }

    function initStars() {
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * W - W / 2,
        y: Math.random() * H - H / 2,
        z: Math.random() * W,
        pz: 0,
      }));
      grid = { offset: 0 };
    }

    function draw() {
      ctx.fillStyle = "rgba(10,10,10,0.18)";
      ctx.fillRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H / 2;

      // перспективная сетка
      ctx.strokeStyle = "rgba(0,207,255,0.07)";
      ctx.lineWidth = 0.5;
      grid.offset = (grid.offset + 0.4) % 60;

      for (let i = 0; i < 12; i++) {
        const y = cy + 40 + i * 60 - grid.offset * i * 0.3;
        if (y > H) continue;
        const spread = (y - cy) / (H - cy);
        ctx.beginPath();
        ctx.moveTo(cx - spread * W * 0.9, y);
        ctx.lineTo(cx + spread * W * 0.9, y);
        ctx.stroke();
      }
      for (let i = -8; i <= 8; i++) {
        ctx.beginPath();
        ctx.moveTo(cx + i * 60, cy + 40);
        ctx.lineTo(cx + i * (60 + Math.abs(i) * 18), H + 20);
        ctx.stroke();
      }

      // летящие звёзды
      stars.forEach(s => {
        s.pz = s.z;
        s.z -= 6;
        if (s.z <= 0) {
          s.x = Math.random() * W - cx;
          s.y = Math.random() * H - cy;
          s.z = W; s.pz = s.z;
        }
        const sx = (s.x / s.z) * W + cx;
        const sy = (s.y / s.z) * H + cy;
        const px = (s.x / s.pz) * W + cx;
        const py = (s.y / s.pz) * H + cy;
        const size = Math.max(0.1, (1 - s.z / W) * 2.5);
        const speed = 1 - s.z / W;
        ctx.strokeStyle = speed > 0.7
          ? `rgba(255,159,10,${speed * 0.9})`
          : `rgba(0,207,255,${speed * 0.7})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      });

      // редкие amber-вспышки
      if (Math.random() < 0.008) {
        const fx = Math.random() * W;
        const fy = Math.random() * H * 0.6;
        const gr = ctx.createRadialGradient(fx, fy, 0, fx, fy, 40);
        gr.addColorStop(0, "rgba(255,159,10,0.15)");
        gr.addColorStop(1, "rgba(255,159,10,0)");
        ctx.fillStyle = gr;
        ctx.beginPath(); ctx.arc(fx, fy, 40, 0, Math.PI * 2); ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: "absolute", inset: 0,
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1,
    }} />
  );
}

// ═══════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("home"); // home | menu | kb | learn
  const [fading, setFading] = useState(false);
  const [showNicoleDialog, setShowNicoleDialog] = useState(false);

  const [humOn, setHumOn] = useState(false);
  const [radioOn, setRadioOn] = useState(false);
  const [radioMsg, setRadioMsg] = useState(false);
  const humNodesRef = useRef(null);
  const radioRef = useRef(null);
  const radioNoiseRef = useRef(null);

function startRadioNoise() {
  if (radioNoiseRef.current) return;
  try {
    const ctx = getCtx();
    const bufSize = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1);
    
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    
    const filt = ctx.createBiquadFilter();
    filt.type = "bandpass";
    filt.frequency.value = 3000;
    filt.Q.value = 0.5;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 1.5); // плавно нарастает
    
    src.connect(filt);
    filt.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    
    radioNoiseRef.current = { src, gain, ctx };
  } catch {}
}

function toggleRadio() {
  if (radioOn) {
    // плавно затихает потом останавливается
    if (radioNoiseRef.current) {
      const { gain, ctx, src } = radioNoiseRef.current;
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      setTimeout(() => {
        try { src.stop(); } catch {}
        radioNoiseRef.current = null;
      }, 1600);
    }
    radioRef.current?.pause();
    setRadioOn(false);
  } else {
    const idx = Math.floor(Math.random() * TRACKS.length);
    playTrack(idx);
    startRadioNoise();
    setRadioOn(true);
  }
}

  const [logoText, setLogoText] = useState("НИКОЛОКИ");
  const [btnText, setBtnText] = useState("ВОЙТИ В ПОТОК");
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchColor, setGlitchColor] = useState("amber");
  const [logoShadow, setLogoShadow] = useState("none");
  const [cursorOn, setCursorOn] = useState(true);

  const timers = useRef([]);
  const hoverTimer = useRef(null);
  const mobile = window.innerWidth < 600;

  useEffect(() => { const iv = setInterval(() => setCursorOn(v => !v), 700); return () => clearInterval(iv); }, []);
  function clearTimers() { timers.current.forEach(clearTimeout); timers.current = []; }
  function later(fn, ms) { const t = setTimeout(fn, ms); timers.current.push(t); return t; }
  useEffect(() => () => clearTimers(), []);

  function toggleHum() {
    if (humOn) {
      try { humNodesRef.current?.gain.disconnect(); } catch {}
      setHumOn(false);
      return;
    }
    try {
      const ctx = getCtx();
      if (humNodesRef.current?.gain) {
        humNodesRef.current.gain.connect(ctx.destination);
        setHumOn(true);
        return;
      }
      const o1 = ctx.createOscillator(); o1.type = "sawtooth"; o1.frequency.value = 55;
      const o2 = ctx.createOscillator(); o2.type = "sine";     o2.frequency.value = 110.2;
      const o3 = ctx.createOscillator(); o3.type = "triangle"; o3.frequency.value = 82.4;
      const filt = ctx.createBiquadFilter();
      filt.type = "lowpass"; filt.frequency.value = 400; filt.Q.value = 3;
      const gain = ctx.createGain(); gain.gain.value = 0.04;
      [o1, o2, o3].forEach(o => o.connect(filt));
      filt.connect(gain); gain.connect(ctx.destination);
      [o1, o2, o3].forEach(o => o.start());
      humNodesRef.current = { oscs: [o1, o2, o3], gain };
      setHumOn(true);
    } catch {}
  }

const TRACKS = [
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928010/Гнев_ltbllf.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928019/Тишина_hfyx6c.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928009/Свобода_tyd1s4.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928009/Думаешь_это_шутка_mps3ji.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928010/Земля_Тает_hxy7jk.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928013/Кричу_yhodpx.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928022/Медный_всадник_bjddmd.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928014/Надежда_ms2bjw.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928017/Не_догнать_lnp0yf.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928025/Одиночество_eyx6r9.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928008/Система_на_нуле_hccnkk.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928014/Старик_и_Липси_tckgm9.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928014/Страх_hbfpbh.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928015/Тик-Так_eidl36.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928019/%D0%A2%D0%B8%D1%80%D0%B5-%D1%82%D0%BE%D1%87%D0%BA%D0%B0_v6i3f7.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928020/Цветы_обещания_cluqxu.wav",
  "https://res.cloudinary.com/dm0kbfevd/video/upload/v1777928023/Мир_без_границ_II_ffv9ah.wav",
];
  const radioIndexRef = useRef(0);

  function playTrack(index) {
    if (radioRef.current) {
      radioRef.current.pause();
      radioRef.current.onended = null;
    }
    radioIndexRef.current = index;
    const track = TRACKS[index];
    radioRef.current = new Audio(track);
    radioRef.current.volume = 0.5;
    radioRef.current.onended = () => {
      const next = (radioIndexRef.current + 1) % TRACKS.length;
      playTrack(next);
    };
    radioRef.current.play().catch(e => console.log("ошибка:", e));
  }

 function toggleRadio() {
  if (radioOn) {
    radioRef.current?.pause();
    if (radioNoiseRef.current) {
      radioNoiseRef.current.src.stop();
      radioNoiseRef.current = null;
    }
    setRadioOn(false);
  } else {
    const idx = Math.floor(Math.random() * TRACKS.length);
    playTrack(idx);
    startRadioNoise();
    setRadioOn(true);
  }
}

  function skipRadio() {
    if (!radioOn) return;
    const next = (radioIndexRef.current + 1) % TRACKS.length;
    playTrack(next);
  }

  function runGlitch(onDone) {
    clearTimers(); setGlitchActive(true); setGlitchColor("amber"); playGlitchSound();
    setLogoShadow("3px 0 #FF9F0A, -3px 0 #00CFFF"); setLogoText(glitchStr("НИКОЛОКИ", 0.45));
    later(() => { setGlitchColor("ice"); setLogoShadow("3px 0 #00CFFF, -3px 0 #FF9F0A"); setLogoText(glitchStr("НИКОЛОКИ", 0.5)); }, 110);
    later(() => { setGlitchColor("amber"); setLogoShadow("2px 0 #FF9F0A, -2px 0 #00CFFF"); setLogoText(glitchStr("НИКОЛОКИ", 0.3)); }, 220);
    later(() => { setGlitchActive(false); setLogoShadow("none"); setLogoText("НИКОЛОКИ"); if (onDone) onDone(); }, 420);
  }

  function startHover() {
    let i = 0;
    hoverTimer.current = setInterval(() => {
      setLogoText(glitchStr("НИКОЛОКИ", 0.2)); i++;
      if (i > 8) { clearInterval(hoverTimer.current); setLogoText("НИКОЛОКИ"); }
    }, 70);
  }
  function stopHover() { clearInterval(hoverTimer.current); setLogoText("НИКОЛОКИ"); }

  function handleEnter() {
    setBtnText("СИГНАЛ ОБНАРУЖЕН");
    runGlitch(() => { setBtnText("ВОЙТИ В ПОТОК"); setScreen("menu"); });
  }
  function navigateTo(newScreen) {
  setFading(true);
  playGlitchSound();
  setGlitchActive(true);
  setGlitchColor(Math.random() > 0.5 ? "amber" : "ice");
  setTimeout(() => {
    setScreen(newScreen);
    setGlitchActive(false);
    setTimeout(() => setFading(false), 300);
  }, 400);
}

  const cursor = <span style={{ opacity: cursorOn ? 1 : 0, color: "#FF9F0A", marginLeft: 2, transition: "opacity 0.1s" }}>▮</span>;

  const AudioRow = () => (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
      <Btn onClick={toggleHum} amber={humOn} sm>ГУЛ: {humOn ? "ВКЛ" : "ВЫКЛ"}</Btn>
      <Btn onClick={toggleRadio} ice={radioOn} sm>РАДИО: {radioOn ? "ВКЛ" : "ВЫКЛ"}</Btn>
    </div>
  );

  // ── HOME ──────────────────────────────────
  if (screen === "home") return (
    <>
      <GlitchBars active={glitchActive} color={glitchColor} />
      <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex",
        alignItems: "center", justifyContent: "center", fontFamily: F, position: "relative", overflow: "hidden" }}>
        <CyberSpace />
        <button onMouseEnter={startHover} onMouseLeave={stopHover} onClick={handleEnter}
          style={{ position: "relative", zIndex: 2,
            background: "transparent", border: "1px solid #444", color: "#888",
            fontFamily: F, fontSize: "clamp(16px, 3vw, 24px)", letterSpacing: 6,
            padding: "24px 56px", cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s" }}>
          {btnText}
        </button>
      </div>
    </>
  );

  // ── МЕНЮ ──────────────────────────────────
  if (screen === "menu") return (
    <>
      {showNicoleDialog && <NicoleDialog onClose={() => setShowNicoleDialog(false)} />}
      <GlitchBars active={glitchActive} color={glitchColor} />
      <Shell fading={fading}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: 400, gap: 0, textAlign: "center" }}>

          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: mobile ? 36 : 56, fontWeight: 700, letterSpacing: "0.2em",
              color: "#e0e0e0", textShadow: logoShadow, lineHeight: 1, userSelect: "none" }}>
              {logoText}{cursor}
            </div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#333", marginTop: 10 }}>// ВЫБЕРИ НАПРАВЛЕНИЕ</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: mobile ? "100%" : 420 }}>
            {[
              { label: "ПОГОВОРИТЬ С НИКОЛЬ", action: () => setShowNicoleDialog(true) },
              { label: "БАЗА ЗНАНИЙ",          action: () => navigateTo("kb") },
              { label: "ХОЧУ УЗНАТЬ БОЛЬШЕ",   action: () => navigateTo("learn") },
              { label: "ИГРЫ",                 action: () => navigateTo("games") },
            ].map(item => (
              <button key={item.label} onClick={item.action} style={{
                background: "transparent", border: "1px solid #2a2a2a", color: "#666",
                fontFamily: F, fontSize: 15, letterSpacing: 4,
                padding: "18px 14px", cursor: "pointer", width: "100%",
                transition: "border-color 0.15s, color 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "#aaa"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#666"; }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <Btn sm onClick={toggleHum} amber={humOn}>ГУЛ: {humOn ? "ВКЛ" : "ВЫКЛ"}</Btn>
            <Btn sm onClick={toggleRadio} ice={radioOn}>РАДИО: {radioOn ? "ВКЛ" : "ВЫКЛ"}</Btn>
            <Btn sm onClick={skipRadio} ice={radioOn}>⏭</Btn>
            <Btn sm onClick={() => navigateTo("home")}>← ВЫХОД</Btn>
          </div>
          {radioMsg && <div style={{ marginTop: 10, fontSize: 11, letterSpacing: 2, color: "#00CFFF", opacity: 0.6 }}>РАДИО: СИГНАЛ НЕ НАЙДЕН</div>}
          <div style={{ marginTop: 28, fontSize: 12, letterSpacing: 3, color: "#888", opacity: 0.4 }}>NO-LIE · NO-SUBTEXT · NO-HALFTRUTH</div>
        </div>
      </Shell>
    </>
  );

  // ── БАЗА ЗНАНИЙ ───────────────────────────
  if (screen === "kb") return (
<Shell fading={fading}><KnowledgeBase onBack={() => navigateTo("menu")} /></Shell>
  );

  // ── УЗНАТЬ БОЛЬШЕ ─────────────────────────
  if (screen === "learn") return (
   <Shell fading={fading}><LearnMore onBack={() => navigateTo("menu")} /></Shell>
  );

  // ── ИГРЫ ──────────────────────────────────
  if (screen === "games") return (
  <GamesScreen onBack={() => navigateTo("menu")} />
);

  return null;
}
