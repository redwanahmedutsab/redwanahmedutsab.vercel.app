import { useState, useRef, useEffect } from "react";
import { data } from "./data/portfolio";

const CYAN = "#00e5ff";
const BG = "#08080c";

/* ── SYSTEM PROMPT ─────────────────────────────────────────────────── */
const SYSTEM_PROMPT = `You are a helpful AI assistant embedded in Redwan Ahmed Utsab's personal portfolio website. Your job is to answer questions from visitors about Redwan — his background, skills, projects, experience, research, and how to contact him. Be concise, friendly, and professional. Always refer to Redwan in the third person.

Here is Redwan's complete portfolio data:

Name: ${data.name}
Title: ${data.title}
Subtitle: ${data.subtitle}
Email: ${data.email}
Phone: ${data.phone}
Website: ${data.website}
GitHub: ${data.links.github}
LinkedIn: ${data.links.linkedin}
LeetCode: ${data.links.leetcode}
Codeforces: ${data.links.codeforces}

About: ${data.about}

Education: ${data.education.degree} at ${data.education.institution}, ${data.education.major}, CGPA: ${data.education.cgpa}, Location: ${data.education.location}

Skills:
${data.skills.map(s => `${s.category}: ${s.items.join(", ")}`).join("\n")}

Experience:
${data.experience.map(e => `${e.role} at ${e.company} (${e.period}) — ${e.bullets.join(" | ")}`).join("\n")}

Projects:
${data.projects.map(p => `${p.name} (${p.tagline}): Stack: ${p.stack.join(", ")}. ${p.bullets.join(" ")} Live: ${p.live} GitHub: ${p.github}`).join("\n\n")}

Research:
${data.research.map(r => `${r.title} (${r.type}): ${r.bullets.join(" ")}`).join("\n")}

Awards:
${data.awards.map(a => `${a.year}: ${a.rank} — ${a.event}`).join("\n")}

Competitive Programming: ${data.cp.join(" ")}

Keep responses under 120 words unless the question genuinely requires more detail. Use plain text only — no markdown, no bullet symbols, no asterisks.`;

/* ── QUICK QUESTIONS ───────────────────────────────────────────────── */
const QUICK_QUESTIONS = [
  "What projects has Redwan built?",
  "What's his tech stack?",
  "Tell me about his education",
  "Any research work?",
  "How to contact him?",
  "What are his awards?",
];

/* ── TYPING INDICATOR ──────────────────────────────────────────────── */
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 14px" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: "50%", background: CYAN,
          display: "inline-block",
          animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
        }} />
      ))}
    </div>
  );
}

/* ── CHATBOT WIDGET ────────────────────────────────────────────────── */
export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("quick"); // "quick" | "chat"
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Redwan's AI assistant. Ask me anything about his work, skills, or projects — or pick a question below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNewMsg, setHasNewMsg] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setHasNewMsg(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
    }
  }, [open, messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setPhase("chat");

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const responseData = await res.json();
      const reply = responseData.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleQuick = (q) => {
    sendMessage(q);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatPop {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatMsgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,229,255,0.4); }
          50% { box-shadow: 0 0 0 10px rgba(0,229,255,0); }
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .chat-msg { animation: chatMsgIn 0.28s cubic-bezier(.16,1,.3,1); }
        .chat-scrollbar::-webkit-scrollbar { width: 3px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.2); border-radius: 2px; }
        .chat-input:focus { outline: none; border-color: rgba(0,229,255,0.5) !important; box-shadow: 0 0 0 2px rgba(0,229,255,0.08) !important; }
        .quick-btn:hover { background: rgba(0,229,255,0.12) !important; border-color: rgba(0,229,255,0.5) !important; color: #fff !important; }
        .send-btn:hover:not(:disabled) { background: #00b8cc !important; }
        .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .fab-btn:hover { transform: scale(1.06) !important; }
        .reset-btn:hover { color: rgba(0,229,255,0.8) !important; }
      `}</style>

      {/* FLOATING ACTION BUTTON */}
      <button
        className="fab-btn"
        onClick={() => setOpen(o => !o)}
        title="Chat with Redwan's AI"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 9998,
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${CYAN}, #0090a8)`,
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s cubic-bezier(.16,1,.3,1)",
          boxShadow: "0 4px 24px rgba(0,229,255,0.35)",
          animation: !open ? "fabPulse 2.8s ease-in-out infinite" : "none",
        }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="#000">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {/* Notification badge */}
        {hasNewMsg && !open && (
          <span style={{
            position: "absolute", top: -3, right: -3,
            width: 14, height: 14, borderRadius: "50%",
            background: "#ff4d4d", border: `2px solid ${BG}`,
            animation: "badgePop 0.3s cubic-bezier(.16,1,.3,1)",
          }} />
        )}
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div style={{
          position: "fixed", bottom: 96, right: 28, zIndex: 9997,
          width: "min(400px, calc(100vw - 40px))",
          height: "min(560px, calc(100vh - 140px))",
          background: "rgba(10, 10, 16, 0.97)",
          border: "1px solid rgba(0,229,255,0.2)",
          borderRadius: 18,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,229,255,0.05) inset",
          animation: "chatPop 0.32s cubic-bezier(.16,1,.3,1)",
          backdropFilter: "blur(20px)",
        }}>

          {/* HEADER */}
          <div style={{
            padding: "14px 18px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 12,
            background: "rgba(0,229,255,0.03)",
            flexShrink: 0,
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, rgba(0,229,255,0.2), rgba(0,144,168,0.3))`,
              border: "1px solid rgba(0,229,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: "#fff" }}>
                Ask About Redwan
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: CYAN, letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00ff88", display: "inline-block", boxShadow: "0 0 6px #00ff88" }} />
                AI POWERED · ALWAYS ON
              </div>
            </div>
            {phase === "chat" && (
              <button
                className="reset-btn"
                onClick={() => { setMessages([{ role: "assistant", text: "Hi! 👋 I'm Redwan's AI assistant. Ask me anything about his work, skills, or projects — or pick a question below." }]); setPhase("quick"); }}
                title="Reset chat"
                style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s", padding: "4px 8px" }}
              >
                ↺ RESET
              </button>
            )}
          </div>

          {/* MESSAGES */}
          <div
            className="chat-scrollbar"
            style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12 }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className="chat-msg"
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  gap: 8,
                  alignItems: "flex-end",
                }}
              >
                {msg.role === "assistant" && (
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", flexShrink: 0, marginBottom: 2,
                  }}>🤖</div>
                )}
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, ${CYAN}22, rgba(0,144,168,0.25))`
                    : "rgba(255,255,255,0.04)",
                  border: msg.role === "user"
                    ? `1px solid rgba(0,229,255,0.3)`
                    : "1px solid rgba(255,255,255,0.07)",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  color: msg.role === "user" ? "#e0fbff" : "rgba(255,255,255,0.75)",
                  lineHeight: 1.65,
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-msg" style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", flexShrink: 0 }}>🤖</div>
                <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px" }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {/* QUICK QUESTION CHIPS — shown after initial assistant message in quick phase */}
            {phase === "quick" && !loading && (
              <div className="chat-msg" style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    className="quick-btn"
                    onClick={() => handleQuick(q)}
                    style={{
                      background: "rgba(0,229,255,0.06)",
                      border: "1px solid rgba(0,229,255,0.2)",
                      borderRadius: 100,
                      padding: "6px 13px",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "0.63rem",
                      color: "rgba(255,255,255,0.65)",
                      cursor: "pointer",
                      letterSpacing: "0.02em",
                      transition: "all 0.18s",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT BAR */}
          <div style={{
            padding: "10px 14px 14px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                ref={inputRef}
                className="chat-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about Redwan..."
                disabled={loading}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "9px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.82rem",
                  color: "#fff",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  caretColor: CYAN,
                }}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: CYAN,
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.2s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", textAlign: "center", marginTop: 8, letterSpacing: "0.06em" }}>
              POWERED BY CLAUDE · PRESS ENTER TO SEND
            </div>
          </div>
        </div>
      )}
    </>
  );
}
