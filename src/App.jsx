import { useEffect, useState, useRef } from "react";
import { data } from "./data/portfolio";

/* ── tiny helpers ── */
const useInView = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
};

/* ── NAV ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = ["About", "Skills", "Projects", "Experience", "Research", "Awards", "Contact"];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? "rgba(8,8,12,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      transition: "all 0.4s ease",
      padding: "0 2rem",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <a href="#hero" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "#fff", textDecoration: "none", letterSpacing: "-0.02em" }}>
          R<span style={{ color: "#00e5ff" }}>.</span>
        </a>
        {/* desktop */}
        <div style={{ display: "flex", gap: "2rem" }} className="nav-links">
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#00e5ff"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.55)"}
            >{l}</a>
          ))}
        </div>
        {/* mobile hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: "1.4rem" }} className="hamburger">☰</button>
      </div>
      {menuOpen && (
        <div style={{ background: "rgba(8,8,12,0.98)", padding: "1rem 2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {links.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>{l}</a>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ── HERO ── */
function Hero() {
  const [typed, setTyped] = useState("");
  const full = data.subtitle;
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(full.slice(0, i + 1));
      i++;
      if (i >= full.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="hero" style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", padding: "0 2rem",
    }}>
      {/* grid bg */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(0,229,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      {/* glow */}
      <div style={{
        position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,255,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, maxWidth: 800 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", color: "#00e5ff", letterSpacing: "0.2em", marginBottom: "1.5rem", opacity: 0, animation: "fadeUp 0.6s ease 0.2s forwards" }}>
          AVAILABLE FOR OPPORTUNITIES
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(3rem, 8vw, 6rem)",
          lineHeight: 1.0, letterSpacing: "-0.03em", color: "#fff", margin: 0,
          opacity: 0, animation: "fadeUp 0.7s ease 0.4s forwards",
        }}>
          {data.name.split(" ")[0]}<br />
          <span style={{ color: "#00e5ff" }}>{data.name.split(" ")[1]}</span>{" "}
          {data.name.split(" ")[2]}
        </h1>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: "clamp(0.8rem, 2vw, 1rem)",
          color: "rgba(255,255,255,0.45)", marginTop: "1.5rem", minHeight: "1.5em",
          opacity: 0, animation: "fadeUp 0.7s ease 0.7s forwards",
        }}>
          {typed}<span style={{ color: "#00e5ff", animation: "blink 1s step-end infinite" }}>|</span>
        </div>
        <p style={{
          color: "rgba(255,255,255,0.5)", maxWidth: 520, margin: "2rem auto 0",
          lineHeight: 1.8, fontSize: "0.95rem", fontFamily: "'DM Sans', sans-serif",
          opacity: 0, animation: "fadeUp 0.7s ease 0.9s forwards",
        }}>
          {data.about}
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.7s ease 1.1s forwards" }}>
          <a href={data.links.github} target="_blank" rel="noreferrer" style={btnStyle("outline")}>GitHub</a>
          <a href={data.links.linkedin} target="_blank" rel="noreferrer" style={btnStyle("solid")}>LinkedIn</a>
          <a href="#contact" style={btnStyle("ghost")}>Get in touch</a>
        </div>
        <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "3rem", opacity: 0, animation: "fadeUp 0.7s ease 1.3s forwards" }}>
          {[
            { label: "LeetCode", val: "300+ solved", href: data.links.leetcode },
            { label: "Codeforces", val: "170+ solved", href: data.links.codeforces },
            { label: "CGPA", val: "3.69 / 4.00", href: "#about" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none", textAlign: "center" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "#00e5ff" }}>{s.val}</div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const btnStyle = (type) => ({
  fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.1em",
  textTransform: "uppercase", textDecoration: "none", padding: "0.75rem 1.75rem",
  borderRadius: 4, cursor: "pointer", transition: "all 0.2s",
  ...(type === "solid" ? { background: "#00e5ff", color: "#000", border: "1px solid #00e5ff" } :
      type === "outline" ? { background: "transparent", color: "#00e5ff", border: "1px solid #00e5ff" } :
      { background: "transparent", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }),
});

/* ── SKILLS ── */
function Skills() {
  return (
    <section id="skills" style={sectionStyle}>
      <div style={containerStyle}>
        <Reveal><SectionLabel>Skills</SectionLabel></Reveal>
        <Reveal delay={0.1}><SectionTitle>Technical Arsenal</SectionTitle></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "3rem" }}>
          {data.skills.map((s, i) => (
            <Reveal key={s.category} delay={i * 0.07}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "1.5rem", transition: "border-color 0.3s, transform 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.4)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#00e5ff", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "1rem" }}>{s.category}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {s.items.map(item => (
                    <span key={item} style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: "rgba(255,255,255,0.75)",
                      background: "rgba(255,255,255,0.06)", padding: "0.3rem 0.75rem", borderRadius: 20,
                    }}>{item}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── PROJECTS ── */
function Projects() {
  return (
    <section id="projects" style={{ ...sectionStyle, background: "rgba(0,229,255,0.02)" }}>
      <div style={containerStyle}>
        <Reveal><SectionLabel>Projects</SectionLabel></Reveal>
        <Reveal delay={0.1}><SectionTitle>What I've Built</SectionTitle></Reveal>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "3rem" }}>
          {data.projects.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "2rem 2.5rem", transition: "border-color 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "0.75rem" }}>
                  <div>
                    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff", margin: 0 }}>{p.name}</h3>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.85rem", color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{p.tagline}</div>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <a href={p.live} target="_blank" rel="noreferrer" style={{ ...btnStyle("solid"), padding: "0.5rem 1.25rem", fontSize: "0.7rem" }}>Live ↗</a>
                    <a href={p.github} target="_blank" rel="noreferrer" style={{ ...btnStyle("outline"), padding: "0.5rem 1.25rem", fontSize: "0.7rem" }}>GitHub</a>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", margin: "1.25rem 0" }}>
                  {p.stack.map(t => (
                    <span key={t} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#00e5ff", background: "rgba(0,229,255,0.08)", padding: "0.25rem 0.6rem", borderRadius: 4, letterSpacing: "0.05em" }}>{t}</span>
                  ))}
                </div>
                <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {p.bullets.map((b, bi) => (
                    <li key={bi} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>{b}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── EXPERIENCE ── */
function Experience() {
  return (
    <section id="experience" style={sectionStyle}>
      <div style={containerStyle}>
        <Reveal><SectionLabel>Experience</SectionLabel></Reveal>
        <Reveal delay={0.1}><SectionTitle>Where I've Worked</SectionTitle></Reveal>
        <div style={{ marginTop: "3rem" }}>
          {data.experience.map((e, i) => (
            <Reveal key={i} delay={0.1}>
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                <div style={{ width: 3, background: "linear-gradient(to bottom, #00e5ff, transparent)", borderRadius: 2, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#00e5ff", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{e.period} · {e.location}</div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#fff", margin: "0 0 0.2rem" }}>{e.company}</h3>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.25rem" }}>{e.role} — {e.sub}</div>
                  <ul style={{ margin: 0, paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {e.bullets.map((b, bi) => (
                      <li key={bi} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.75 }}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── RESEARCH ── */
function Research() {
  return (
    <section id="research" style={{ ...sectionStyle, background: "rgba(0,229,255,0.02)" }}>
      <div style={containerStyle}>
        <Reveal><SectionLabel>Research</SectionLabel></Reveal>
        <Reveal delay={0.1}><SectionTitle>Academic Work</SectionTitle></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "3rem" }}>
          {data.research.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "1.75rem", height: "100%", boxSizing: "border-box",
                transition: "border-color 0.3s, transform 0.3s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#00e5ff", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{r.type}</div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fff", margin: "0 0 1rem", lineHeight: 1.5 }}>{r.title}</h3>
                <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {r.bullets.map((b, bi) => (
                    <li key={bi} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{b}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── AWARDS ── */
function Awards() {
  return (
    <section id="awards" style={sectionStyle}>
      <div style={containerStyle}>
        <Reveal><SectionLabel>Recognition</SectionLabel></Reveal>
        <Reveal delay={0.1}><SectionTitle>Awards & Competitions</SectionTitle></Reveal>

        {/* CP stats */}
        <Reveal delay={0.15}>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {[{ val: "300+", label: "LeetCode Problems", href: data.links.leetcode }, { val: "170+", label: "Codeforces Problems", href: data.links.codeforces }].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                textDecoration: "none", background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)",
                borderRadius: 8, padding: "1.25rem 2rem", flex: 1, minWidth: 160,
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#00e5ff" }}>{s.val}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
              </a>
            ))}
          </div>
        </Reveal>

        <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          {data.awards.map((a, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{
                display: "flex", alignItems: "center", gap: "1.5rem",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "1.25rem 1.75rem", flexWrap: "wrap",
                transition: "border-color 0.3s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", minWidth: 36 }}>{a.year}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#00e5ff", minWidth: 180 }}>{a.rank}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "rgba(255,255,255,0.6)" }}>{a.event}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CONTACT ── */
function Contact() {
  return (
    <section id="contact" style={{ ...sectionStyle, background: "rgba(0,229,255,0.02)" }}>
      <div style={{ ...containerStyle, textAlign: "center" }}>
        <Reveal><SectionLabel>Contact</SectionLabel></Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#fff", margin: "0.5rem 0 1.5rem", lineHeight: 1.1 }}>
            Let's build something<br /><span style={{ color: "#00e5ff" }}>together.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.45)", fontSize: "1rem", maxWidth: 480, margin: "0 auto 2.5rem" }}>
            Open to full-time SWE roles, internships, and interesting projects. Reach out anytime.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3rem" }}>
            <a href={`mailto:${data.email}`} style={{ ...btnStyle("solid"), fontSize: "0.8rem" }}>✉ {data.email}</a>
            <a href={`tel:${data.phone}`} style={{ ...btnStyle("outline"), fontSize: "0.8rem" }}>{data.phone}</a>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {Object.entries(data.links).map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" style={{
                fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)",
                textDecoration: "none", letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "color 0.2s",
              }}
                onMouseEnter={e => e.target.style.color = "#00e5ff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}
              >{key} ↗</a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2rem", textAlign: "center" }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
        © {new Date().getFullYear()} REDWAN AHMED UTSAB · BUILT WITH REACT · DEPLOYED ON VERCEL
      </div>
    </footer>
  );
}

/* ── SHARED STYLES ── */
const sectionStyle = { padding: "7rem 2rem" };
const containerStyle = { maxWidth: 1100, margin: "0 auto" };
const SectionLabel = ({ children }) => (
  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#00e5ff", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
    // {children}
  </div>
);
const SectionTitle = ({ children }) => (
  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#fff", margin: 0, lineHeight: 1.15 }}>{children}</h2>
);

/* ── APP ── */
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #08080c; color: #fff; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #08080c; }
        ::-webkit-scrollbar-thumb { background: #00e5ff33; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @media (max-width: 640px) {
          .nav-links { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Research />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
