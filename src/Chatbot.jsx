import {useState, useRef, useEffect} from "react";
import {data} from "./data/portfolio";

const CYAN = "#00e5ff";
const BG = "#08080c";


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


const QUICK_QUESTIONS = [
    "What projects has Redwan built?",
    "What's his tech stack?",
    "Tell me about his education",
    "Any research work?",
    "How to contact him?",
    "What are his awards?",
];


function AgentIcon({size = 22, color = "#000"}) {
    const inner = color === "#000" ? "white" : BG;
    return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="9" y="11" width="18" height="15" rx="5" fill={color}/>
            <line x1="18" y1="11" x2="18" y2="6" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
            <circle cx="18" cy="4.5" r="2" fill={color}/>
            <circle cx="13.5" cy="17.5" r="2.2" fill={inner}/>
            <circle cx="22.5" cy="17.5" r="2.2" fill={inner}/>
            <circle cx="13.5" cy="18" r="0.9" fill={color}/>
            <circle cx="22.5" cy="18" r="0.9" fill={color}/>
            <rect x="13.5" y="22.5" width="9" height="1.8" rx="0.9" fill={inner} opacity="0.85"/>
            <rect x="5" y="15.5" width="4" height="5" rx="2" fill={color}/>
            <rect x="27" y="15.5" width="4" height="5" rx="2" fill={color}/>
        </svg>
    );
}


function AgentAvatar({size = 26}) {
    return (
        <div style={{
            width: size, height: size, borderRadius: "50%",
            background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,80,100,0.3))",
            border: "1px solid rgba(0,229,255,0.28)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
        }}>
            <AgentIcon size={size * 0.62} color={CYAN}/>
        </div>
    );
}


function TypingDots() {
    return (
        <div style={{display: "flex", gap: 4, alignItems: "center", padding: "10px 14px"}}>
            {[0, 1, 2].map(i => (
                <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: CYAN,
                    display: "inline-block",
                    animation: `chatDot 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}/>
            ))}
        </div>
    );
}


export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState("quick");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi! I'm Redwan's AI assistant. Ask me anything about his work, skills, or projects — or pick a quick question below."
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
            setTimeout(() => bottomRef.current?.scrollIntoView({behavior: "smooth"}), 80);
        }
    }, [open, messages]);

    const sendMessage = async (text) => {
        if (!text.trim() || loading) return;
        const userMsg = {role: "user", text};
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


            let res, responseData;
            for (let attempt = 1; attempt <= 3; attempt++) {
                res = await fetch("/api/chat", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({system: SYSTEM_PROMPT, messages: apiMessages}),
                });
                responseData = await res.json();
                if (res.ok) break;
                const msg = (responseData.error || "").toLowerCase();
                const isOverload = msg.includes("high demand") || msg.includes("overload") || res.status === 503;
                if (!isOverload || attempt === 3) break;
                await new Promise(r => setTimeout(r, 1200 * attempt));
            }

            if (!res.ok) {
                const msg = (responseData.error || "").toLowerCase();
                const isOverload = msg.includes("high demand") || msg.includes("overload") || res.status === 503;
                setMessages(prev => [...prev, {
                    role: "assistant",
                    text: isOverload
                        ? "The AI is a bit busy right now — please try again in a moment!"
                        : `Error: ${responseData.error || res.status}`,
                }]);
                return;
            }

            const reply = responseData.content?.find(b => b.type === "text")?.text
                || "Sorry, I couldn't generate a response.";
            setMessages(prev => [...prev, {role: "assistant", text: reply}]);
        } catch (err) {
            setMessages(prev => [...prev, {
                role: "assistant",
                text: "Network error — please check your connection and try again.",
            }]);
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const resetChat = () => {
        setMessages([{
            role: "assistant",
            text: "Hi! I'm Redwan's AI assistant. Ask me anything about his work, skills, or projects — or pick a quick question below."
        }]);
        setPhase("quick");
    };

    return (
        <>
            <style>{`
        @keyframes chatDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes chatPop {
          from { opacity: 0; transform: scale(0.9) translateY(16px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes chatMsgIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 4px 24px rgba(0,229,255,0.35), 0 0 0 0 rgba(0,229,255,0.3); }
          60% { box-shadow: 0 4px 24px rgba(0,229,255,0.35), 0 0 0 12px rgba(0,229,255,0); }
        }
        @keyframes badgePop { from { transform:scale(0); } to { transform:scale(1); } }
        .chat-msg { animation: chatMsgIn 0.28s cubic-bezier(.16,1,.3,1); }
        .chat-window { touch-action: pan-y; }
        .chat-scrollbar::-webkit-scrollbar { width: 3px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.2); border-radius: 2px; }
        .chat-input:focus { outline: none; border-color: rgba(0,229,255,0.5) !important; box-shadow: 0 0 0 3px rgba(0,229,255,0.07) !important; }
        .quick-btn:hover { background: rgba(0,229,255,0.12) !important; border-color: rgba(0,229,255,0.5) !important; color: #fff !important; transform: translateY(-1px); }
        .send-btn:hover:not(:disabled) { background: #00b8cc !important; }
        .send-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .fab-btn { transition: transform 0.2s cubic-bezier(.16,1,.3,1) !important; touch-action: manipulation; }
        .fab-btn:hover { transform: scale(1.08) !important; }
        @media (max-width: 480px) {
          .chat-header-title { font-size: 0.82rem !important; }
          .quick-btn { font-size: 0.58rem !important; padding: 4px 10px !important; }
        }
        .reset-btn:hover { color: rgba(0,229,255,0.8) !important; }
      `}</style>


            <button
                className="fab-btn"
                onClick={() => setOpen(o => !o)}
                title="Chat with Redwan's AI"
                style={{
                    position: "fixed", bottom: "max(16px, env(safe-area-inset-bottom, 16px))", right: 16, zIndex: 9998,
                    width: 52, height: 52, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${CYAN}, #0090a8)`,
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: !open ? "fabPulse 3s ease-in-out infinite" : "none",
                    boxShadow: "0 4px 24px rgba(0,229,255,0.35)",
                }}
            >
                {open ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.8"
                         strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                ) : (
                    <AgentIcon size={28} color="#000"/>
                )}
                {hasNewMsg && !open && (
                    <span style={{
                        position: "absolute", top: -3, right: -3,
                        width: 13, height: 13, borderRadius: "50%",
                        background: "#ff4455", border: `2px solid ${BG}`,
                        animation: "badgePop 0.3s cubic-bezier(.16,1,.3,1)",
                    }}/>
                )}
            </button>


            {open && (
                <div style={{
                    position: "fixed", bottom: 80, right: 8, zIndex: 9997,
                    width: "min(400px, calc(100vw - 16px))",
                    height: "min(560px, calc(100dvh - 110px))",
                    background: "rgba(8,8,14,0.98)",
                    border: "1px solid rgba(0,229,255,0.18)",
                    borderRadius: 18,
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                    boxShadow: "0 28px 80px rgba(0,0,0,0.75), 0 0 60px rgba(0,229,255,0.04)",
                    animation: "chatPop 0.3s cubic-bezier(.16,1,.3,1)",
                    backdropFilter: "blur(24px)",
                    WebkitOverflowScrolling: "touch",
                }}>


                    <div style={{
                        padding: "13px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.055)",
                        display: "flex", alignItems: "center", gap: 11,
                        background: "rgba(0,229,255,0.025)",
                        flexShrink: 0,
                    }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: "50%",
                            background: "linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,80,100,0.3))",
                            border: "1px solid rgba(0,229,255,0.28)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0,
                        }}>
                            <AgentIcon size={22} color={CYAN}/>
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{
                                fontFamily: "'Syne', sans-serif",
                                fontWeight: 700,
                                fontSize: "0.87rem",
                                color: "#fff"
                            }}>
                                Ask About Redwan
                            </div>
                            <div style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.58rem",
                                color: CYAN,
                                letterSpacing: "0.08em",
                                display: "flex",
                                alignItems: "center",
                                gap: 5,
                                marginTop: 2
                            }}>
                                <span style={{
                                    width: 5,
                                    height: 5,
                                    borderRadius: "50%",
                                    background: "#00ff88",
                                    display: "inline-block",
                                    boxShadow: "0 0 5px #00ff88"
                                }}/>
                                AI POWERED · ALWAYS ON
                            </div>
                        </div>
                        {phase === "chat" && (
                            <button className="reset-btn" onClick={resetChat} title="Reset chat" style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "rgba(255,255,255,0.28)",
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.58rem",
                                letterSpacing: "0.08em",
                                textTransform: "uppercase",
                                transition: "color 0.2s",
                                padding: "4px 8px"
                            }}>
                                ↺ RESET
                            </button>
                        )}
                    </div>


                    <div className="chat-scrollbar" style={{
                        flex: 1,
                        overflowY: "auto",
                        padding: "14px 14px 6px",
                        display: "flex",
                        flexDirection: "column",
                        gap: 11
                    }}>
                        {messages.map((msg, i) => (
                            <div key={i} className="chat-msg" style={{
                                display: "flex",
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                                gap: 8,
                                alignItems: "flex-end"
                            }}>
                                {msg.role === "assistant" && <AgentAvatar size={26}/>}
                                <div style={{
                                    maxWidth: "82%", padding: "9px 13px",
                                    borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    background: msg.role === "user" ? "linear-gradient(135deg, rgba(0,229,255,0.14), rgba(0,100,130,0.22))" : "rgba(255,255,255,0.035)",
                                    border: msg.role === "user" ? "1px solid rgba(0,229,255,0.28)" : "1px solid rgba(255,255,255,0.065)",
                                    fontFamily: "'DM Sans', sans-serif", fontSize: "0.84rem",
                                    color: msg.role === "user" ? "#dff9ff" : "rgba(255,255,255,0.78)",
                                    lineHeight: 1.68,
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="chat-msg" style={{display: "flex", alignItems: "flex-end", gap: 8}}>
                                <AgentAvatar size={26}/>
                                <div style={{
                                    background: "rgba(255,255,255,0.035)",
                                    border: "1px solid rgba(255,255,255,0.065)",
                                    borderRadius: "16px 16px 16px 4px"
                                }}>
                                    <TypingDots/>
                                </div>
                            </div>
                        )}

                        {phase === "quick" && !loading && (
                            <div className="chat-msg" style={{display: "flex", flexWrap: "wrap", gap: 6, marginTop: 2}}>
                                {QUICK_QUESTIONS.map(q => (
                                    <button key={q} className="quick-btn" onClick={() => sendMessage(q)} style={{
                                        background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.18)",
                                        borderRadius: 100, padding: "5px 12px",
                                        fontFamily: "'DM Mono', monospace", fontSize: "0.61rem",
                                        color: "rgba(255,255,255,0.6)", cursor: "pointer",
                                        letterSpacing: "0.02em", transition: "all 0.16s",
                                    }}>{q}</button>
                                ))}
                            </div>
                        )}
                        <div ref={bottomRef}/>
                    </div>


                    <div style={{
                        padding: "9px 13px 13px",
                        borderTop: "1px solid rgba(255,255,255,0.055)",
                        flexShrink: 0
                    }}>
                        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                            <input
                                ref={inputRef}
                                className="chat-input"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything about Redwan..."
                                disabled={loading}
                                style={{
                                    flex: 1, background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10,
                                    padding: "9px 13px", fontFamily: "'DM Sans', sans-serif",
                                    fontSize: "16px", color: "#fff",
                                    transition: "border-color 0.2s, box-shadow 0.2s", caretColor: CYAN,
                                }}
                            />
                            <button
                                className="send-btn"
                                onClick={() => sendMessage(input)}
                                disabled={loading || !input.trim()}
                                style={{
                                    width: 38, height: 38, borderRadius: 10, background: CYAN,
                                    border: "none", cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    flexShrink: 0, transition: "background 0.2s",
                                }}
                            >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000"
                                     strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"/>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                                </svg>
                            </button>
                        </div>
                        <div style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.53rem",
                            color: "rgba(255,255,255,0.16)",
                            textAlign: "center",
                            marginTop: 7,
                            letterSpacing: "0.06em"
                        }}>
                            POWERED BY GEMINI · ENTER TO SEND
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
