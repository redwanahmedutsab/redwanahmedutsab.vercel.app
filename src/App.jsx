import {useEffect, useState, useRef, useCallback} from "react";
import {data} from "./data/portfolio";
import Chatbot from "./Chatbot";

const CYAN = "#00e5ff";
const BG = "#08080c";

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */
const useInView = (threshold = 0.12) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setVisible(true);
                    obs.disconnect();
                }
            },
            {threshold}
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
};

const useActiveSection = () => {
    const [active, setActive] = useState("hero");
    useEffect(() => {
        const ids = ["hero", "about", "skills", "projects", "experience", "research", "awards", "contact"];
        const onScroll = () => {
            const scrollY = window.scrollY + 80; // offset for nav height
            let current = "hero";
            for (const id of ids) {
                const el = document.getElementById(id);
                if (el && el.offsetTop <= scrollY) current = id;
            }
            setActive(current);
        };
        window.addEventListener("scroll", onScroll, {passive: true});
        onScroll();
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    return active;
};

/* ─────────────────────────────────────────
   MOUSE TRACKER
───────────────────────────────────────── */
function MouseTracker() {
    const spotlightRef = useRef(null);
    const cursorDotRef = useRef(null);
    const cursorRingRef = useRef(null);
    const mouse = useRef({x: -999, y: -999});
    const ring = useRef({x: -999, y: -999});
    const hovering = useRef(false);
    const clicking = useRef(false);
    const hasMoved = useRef(false);

    useEffect(() => {
        // Skip on touch devices
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const onMove = (e) => {
            mouse.current = {x: e.clientX, y: e.clientY};

            // On first move: show custom cursors, hide native
            if (!hasMoved.current) {
                hasMoved.current = true;
                document.documentElement.style.setProperty("--cursor-display", "block");
                // Hide native cursor now
                const style = document.createElement("style");
                style.id = "hide-cursor";
                style.textContent = "*, *::before, *::after { cursor: none !important; }";
                document.head.appendChild(style);
                if (cursorDotRef.current) cursorDotRef.current.style.opacity = "1";
                if (cursorRingRef.current) cursorRingRef.current.style.opacity = "1";
            }

            // Spotlight follows cursor with CSS transform (instant)
            if (spotlightRef.current) {
                spotlightRef.current.style.background =
                    `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(0,229,255,0.055), transparent 70%)`;
            }

            // Dot follows exactly
            if (cursorDotRef.current) {
                cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
            }
        };

        const onDown = () => {
            clicking.current = true;
            if (cursorDotRef.current) cursorDotRef.current.style.transform += " scale(0.6)";
            if (cursorRingRef.current) {
                cursorRingRef.current.style.width = "22px";
                cursorRingRef.current.style.height = "22px";
                cursorRingRef.current.style.borderColor = CYAN;
            }
        };
        const onUp = () => {
            clicking.current = false;
            if (cursorRingRef.current) {
                cursorRingRef.current.style.width = "36px";
                cursorRingRef.current.style.height = "36px";
                cursorRingRef.current.style.borderColor = "rgba(0,229,255,0.5)";
            }
        };

        // Hover detection on interactive elements
        const onOver = (e) => {
            const el = e.target.closest("a, button, [data-magnetic]");
            if (el) {
                hovering.current = true;
                if (cursorRingRef.current) {
                    cursorRingRef.current.style.width = "56px";
                    cursorRingRef.current.style.height = "56px";
                    cursorRingRef.current.style.borderColor = CYAN;
                    cursorRingRef.current.style.background = "rgba(0,229,255,0.06)";
                }
                if (cursorDotRef.current) {
                    cursorDotRef.current.style.opacity = "0";
                }
            }
        };
        const onOut = (e) => {
            const el = e.target.closest("a, button, [data-magnetic]");
            if (el) {
                hovering.current = false;
                if (cursorRingRef.current) {
                    cursorRingRef.current.style.width = "36px";
                    cursorRingRef.current.style.height = "36px";
                    cursorRingRef.current.style.borderColor = "rgba(0,229,255,0.5)";
                    cursorRingRef.current.style.background = "transparent";
                }
                if (cursorDotRef.current) {
                    cursorDotRef.current.style.opacity = "1";
                }
            }
        };

        // Animate ring with lerp for smooth lag
        let rafId;
        const animate = () => {
            ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
            ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
            if (cursorRingRef.current) {
                const w = parseFloat(cursorRingRef.current.style.width) || 36;
                const h = parseFloat(cursorRingRef.current.style.height) || 36;
                cursorRingRef.current.style.transform =
                    `translate(${ring.current.x - w / 2}px, ${ring.current.y - h / 2}px)`;
            }
            rafId = requestAnimationFrame(animate);
        };
        animate();

        window.addEventListener("mousemove", onMove, {passive: true});
        window.addEventListener("mousedown", onDown);
        window.addEventListener("mouseup", onUp);
        document.addEventListener("mouseover", onOver);
        document.addEventListener("mouseout", onOut);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mousedown", onDown);
            window.removeEventListener("mouseup", onUp);
            document.removeEventListener("mouseover", onOver);
            document.removeEventListener("mouseout", onOut);
            // Restore native cursor on cleanup
            const s = document.getElementById("hide-cursor");
            if (s) s.remove();
        };
    }, []);

    // Don't render on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;

    return (
        <>
            {/* Full-page spotlight overlay */}
            <div ref={spotlightRef} style={{
                position: "fixed", inset: 0, zIndex: 9990,
                pointerEvents: "none",
                transition: "background 0.05s",
            }}/>
            {/* Cursor dot */}
            <div ref={cursorDotRef} style={{
                position: "fixed", top: 0, left: 0, zIndex: 9995,
                width: 8, height: 8, borderRadius: "50%",
                background: CYAN,
                pointerEvents: "none",
                willChange: "transform",
                opacity: 0,
                transition: "opacity 0.2s",
                boxShadow: `0 0 8px ${CYAN}`,
            }}/>
            {/* Cursor ring (lagging) */}
            <div ref={cursorRingRef} style={{
                position: "fixed", top: 0, left: 0, zIndex: 9994,
                width: 36, height: 36, borderRadius: "50%",
                border: "1px solid rgba(0,229,255,0.5)",
                background: "transparent",
                pointerEvents: "none",
                opacity: 0,
                willChange: "transform",
                transition: "width 0.2s cubic-bezier(.16,1,.3,1), height 0.2s cubic-bezier(.16,1,.3,1), border-color 0.2s, background 0.2s, opacity 0.2s",
            }}/>
        </>
    );
}

/* ─────────────────────────────────────────
   REVEAL WRAPPER
───────────────────────────────────────── */
const Reveal = ({children, delay = 0, from = "bottom"}) => {
    const [ref, visible] = useInView();
    const transform = {
        bottom: visible ? "translateY(0)" : "translateY(36px)",
        left: visible ? "translateX(0)" : "translateX(-36px)",
        right: visible ? "translateX(0)" : "translateX(36px)",
    }[from];
    return (
        <div ref={ref} style={{
            opacity: visible ? 1 : 0,
            transform,
            transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
            height: "100%",
        }}>
            {children}
        </div>
    );
};

/* ─────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────── */
function Particles() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animId;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const dots = Array.from({length: 55}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.2 + 0.3,
            vx: (Math.random() - 0.5) * 0.25,
            vy: (Math.random() - 0.5) * 0.25,
            o: Math.random() * 0.4 + 0.1,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(d => {
                d.x += d.vx;
                d.y += d.vy;
                if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
                if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0,229,255,${d.o})`;
                ctx.fill();
            });
            // draw faint connections
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x;
                    const dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.strokeStyle = `rgba(0,229,255,${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);
    return <canvas ref={canvasRef} style={{position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none"}}/>;
}

/* ─────────────────────────────────────────
   NAV
───────────────────────────────────────── */
function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const active = useActiveSection();

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const links = ["about", "skills", "projects", "experience", "research", "awards", "contact"];

    return (
        <nav style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
            background: scrolled ? "rgba(8,8,12,0.88)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
            transition: "all 0.4s cubic-bezier(.16,1,.3,1)",
            padding: "0 1.25rem",
        }}>
            <div style={{
                maxWidth: 1160,
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: 66,
                height: "auto",
                flexWrap: "nowrap",
                gap: "0.5rem",
            }}>
                <a href="#hero" style={{textDecoration: "none", display: "flex", alignItems: "center"}}>
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="36" height="36" rx="8" fill="rgba(0,229,255,0.08)" stroke="rgba(0,229,255,0.25)"
                              strokeWidth="1"/>
                        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
                              fontFamily="'Syne', sans-serif" fontWeight="800" fontSize="18" fill="#00e5ff"
                              letterSpacing="-1">R
                        </text>
                        <circle cx="28" cy="28" r="3" fill="#00e5ff" opacity="0.9"/>
                    </svg>
                </a>
                <div style={{display: "flex", gap: "0.1rem", alignItems: "center"}} className="nav-links">
                    {links.map(l => (
                        <a key={l} href={`#${l}`} style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.63rem",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            textDecoration: "none",
                            padding: "0.35rem 0.6rem",
                            borderRadius: 6,
                            whiteSpace: "nowrap",
                            color: active === l ? CYAN : "rgba(255,255,255,0.45)",
                            background: active === l ? "rgba(0,229,255,0.07)" : "transparent",
                            border: active === l ? "1px solid rgba(0,229,255,0.18)" : "1px solid transparent",
                            transition: "all 0.2s",
                        }}
                           onMouseEnter={e => {
                               if (active !== l) e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                           }}
                           onMouseLeave={e => {
                               if (active !== l) e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                           }}
                        >{l}</a>
                    ))}
                </div>
                <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger"
                        style={{
                            display: "none",
                            background: "none",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 6,
                            cursor: "pointer",
                            color: "#fff",
                            fontSize: "1rem",
                            padding: "0.4rem 0.6rem"
                        }}>
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>
            {menuOpen && (
                <div style={{
                    background: "rgba(8,8,12,0.98)",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                    padding: "1rem 2.5rem 1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem"
                }}>
                    {links.map(l => (
                        <a key={l} href={`#${l}`} onClick={() => setMenuOpen(false)}
                           style={{
                               fontFamily: "'DM Mono', monospace",
                               fontSize: "0.78rem",
                               color: active === l ? CYAN : "rgba(255,255,255,0.6)",
                               textDecoration: "none",
                               letterSpacing: "0.1em",
                               textTransform: "uppercase",
                               padding: "0.5rem 0",
                               borderBottom: "1px solid rgba(255,255,255,0.04)"
                           }}>
                            {l}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
}

/* ─────────────────────────────────────────
   HERO
───────────────────────────────────────── */
function Hero() {
    const [typed, setTyped] = useState("");
    const [countLC, setCountLC] = useState(0);
    const [countCF, setCountCF] = useState(0);
    const full = data.subtitle;

    useEffect(() => {
        let i = 0;
        const t = setInterval(() => {
            setTyped(full.slice(0, ++i));
            if (i >= full.length) clearInterval(t);
        }, 36);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const t1 = setInterval(() => setCountLC(c => c < 300 ? c + 5 : 300), 12);
        const t2 = setInterval(() => setCountCF(c => c < 170 ? c + 3 : 170), 12);
        return () => {
            clearInterval(t1);
            clearInterval(t2);
        };
    }, []);

    return (
        <section id="hero" style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            padding: "clamp(90px, 12vh, 120px) 1.25rem 2rem",
            width: "100%"
        }}>
            <Particles/>
            {/* grid */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
                backgroundSize: "72px 72px",
                zIndex: 0
            }}/>
            {/* glow */}
            <div style={{
                position: "absolute",
                top: "38%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                width: "min(700px, 100vw)",
                height: "min(700px, 100vw)",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 65%)",
                pointerEvents: "none",
                zIndex: 0
            }}/>

            <div style={{
                textAlign: "center",
                position: "relative",
                zIndex: 1,
                maxWidth: 860,
                width: "100%",
                padding: "0"
            }}>
                {/* badge */}
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(0,229,255,0.06)",
                    border: "1px solid rgba(0,229,255,0.2)",
                    borderRadius: 100,
                    padding: "0.35rem 1.1rem",
                    marginBottom: "2rem",
                    opacity: 0,
                    animation: "fadeUp 0.6s ease 0.1s forwards"
                }}>
                    <span style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: CYAN,
                        display: "inline-block",
                        animation: "pulse 2s ease infinite"
                    }}/>
                    <span style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "0.68rem",
                        color: CYAN,
                        letterSpacing: "0.18em"
                    }}>AVAILABLE FOR OPPORTUNITIES</span>
                </div>

                {/* name */}
                <h1 style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(3.2rem, 9vw, 6.5rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.03em",
                    color: "#fff",
                    margin: 0,
                    opacity: 0,
                    animation: "fadeUp 0.7s ease 0.35s forwards"
                }}>
                    {data.name.split(" ")[0]}<br/>
                    <span style={{color: CYAN}}>{data.name.split(" ")[1]}</span>{" "}{data.name.split(" ")[2]}
                </h1>

                {/* typewriter */}
                <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "clamp(0.78rem, 2vw, 0.95rem)",
                    color: "rgba(255,255,255,0.42)",
                    marginTop: "1.75rem",
                    minHeight: "1.4em",
                    opacity: 0,
                    animation: "fadeUp 0.7s ease 0.65s forwards",
                    letterSpacing: "0.04em"
                }}>
                    {typed}<span style={{color: CYAN, animation: "blink 0.9s step-end infinite"}}>▋</span>
                </div>

                {/* about */}
                <p style={{
                    color: "rgba(255,255,255,0.48)",
                    maxWidth: 560,
                    margin: "2rem auto 0",
                    lineHeight: 1.85,
                    fontSize: "0.95rem",
                    fontFamily: "'DM Sans', sans-serif",
                    opacity: 0,
                    animation: "fadeUp 0.7s ease 0.85s forwards"
                }}>
                    {data.about}
                </p>

                {/* CTAs */}
                <div style={{
                    display: "flex",
                    gap: "0.85rem",
                    justifyContent: "center",
                    marginTop: "2.75rem",
                    flexWrap: "wrap",
                    opacity: 0,
                    animation: "fadeUp 0.7s ease 1.05s forwards"
                }}>
                    <a href={data.links.github} target="_blank" rel="noreferrer" style={btn("outline")}>GitHub ↗</a>
                    <a href={data.links.linkedin} target="_blank" rel="noreferrer" style={btn("solid")}>LinkedIn ↗</a>
                    <a href="#contact" style={btn("ghost")}>Get in touch</a>
                </div>

                {/* stats */}
                <div style={{
                    display: "flex",
                    gap: "1rem",
                    justifyContent: "center",
                    marginTop: "3.5rem",
                    opacity: 0,
                    animation: "fadeUp 0.7s ease 1.25s forwards",
                    flexWrap: "wrap"
                }}>
                    {[
                        {val: `${countLC}+`, label: "LeetCode", href: data.links.leetcode},
                        {val: `${countCF}+`, label: "Codeforces", href: data.links.codeforces},
                        {val: "3.69", label: "GPA / 4.00", href: "#about"},
                    ].map(s => (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{
                            textDecoration: "none",
                            textAlign: "center",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 10,
                            padding: "1rem 1.75rem",
                            transition: "border-color 0.25s, transform 0.25s"
                        }}
                           onMouseEnter={e => {
                               e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)";
                               e.currentTarget.style.transform = "translateY(-2px)";
                           }}
                           onMouseLeave={e => {
                               e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                               e.currentTarget.style.transform = "none";
                           }}
                        >
                            <div style={{
                                fontFamily: "'Syne', sans-serif",
                                fontWeight: 800,
                                fontSize: "1.5rem",
                                color: CYAN,
                                lineHeight: 1
                            }}>{s.val}</div>
                            <div style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.6rem",
                                color: "rgba(255,255,255,0.35)",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                marginTop: 6
                            }}>{s.label}</div>
                        </a>
                    ))}
                </div>
            </div>

            {/* scroll indicator */}
            <div style={{
                position: "absolute",
                bottom: "2.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                opacity: 0,
                animation: "fadeUp 0.6s ease 1.6s forwards",
                zIndex: 1
            }}>
                <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.58rem",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.18em"
                }}>SCROLL</span>
                <div style={{
                    width: 1,
                    height: 40,
                    background: "linear-gradient(to bottom, rgba(0,229,255,0.5), transparent)",
                    animation: "scrollPulse 2s ease infinite"
                }}/>
            </div>
        </section>
    );
}

const btn = (type) => ({
    fontFamily: "'DM Mono', monospace", fontSize: "0.73rem", letterSpacing: "0.1em",
    textTransform: "uppercase", textDecoration: "none", padding: "0.78rem 1.85rem", borderRadius: 8,
    cursor: "pointer", transition: "all 0.22s",
    ...(type === "solid" ? {background: CYAN, color: "#000", border: `1px solid ${CYAN}`, fontWeight: 600} :
        type === "outline" ? {background: "transparent", color: CYAN, border: `1px solid rgba(0,229,255,0.45)`} :
            {background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)"}),
});

/* ─────────────────────────────────────────
   ABOUT
───────────────────────────────────────── */
function About() {
    return (
        <section id="about" style={sec()}>
            <div style={wrap()}>
                <Reveal><SLabel>About Me</SLabel></Reveal>
                <div className="about-grid"
                     style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", marginTop: "2.5rem"}}>
                    <Reveal delay={0.1}>
                        <STitle>Who I Am</STitle>
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.95rem",
                            color: "rgba(255,255,255,0.55)",
                            lineHeight: 1.9,
                            marginTop: "1.25rem"
                        }}>{data.about}</p>
                        <p style={{
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.92rem",
                            color: "rgba(255,255,255,0.4)",
                            lineHeight: 1.85,
                            marginTop: "1rem"
                        }}>
                            I specialize in bridging backend system design with machine learning — building APIs that
                            don't just serve data but serve intelligence. Currently open to full-time SWE roles
                            globally.
                        </p>
                    </Reveal>
                    <Reveal delay={0.18}>
                        <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                            {[
                                {label: "Institution", val: "United International University"},
                                {label: "Degree", val: "B.Sc. CSE — Data Science"},
                                {label: "CGPA", val: "3.69 / 4.00"},
                                {label: "IELTS", val: "Band 6.5"},
                                {label: "Location", val: "Dhaka, Bangladesh"},
                                {label: "Status", val: "Open to Opportunities"},
                            ].map(r => (
                                <div key={r.label} style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "0.85rem 1.1rem",
                                    background: "rgba(255,255,255,0.02)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: 8,
                                    transition: "border-color 0.2s"
                                }}
                                     onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.2)"}
                                     onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                                >
                                    <span style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "0.65rem",
                                        color: "rgba(255,255,255,0.3)",
                                        letterSpacing: "0.1em",
                                        textTransform: "uppercase"
                                    }}>{r.label}</span>
                                    <span style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.88rem",
                                        color: r.label === "Status" ? CYAN : "rgba(255,255,255,0.75)",
                                        fontWeight: 500
                                    }}>{r.val}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   SKILLS
───────────────────────────────────────── */
function Skills() {
    return (
        <section id="skills" style={sec("rgba(0,229,255,0.015)")}>
            <div style={wrap()}>
                <Reveal><SLabel>Capabilities</SLabel></Reveal>
                <Reveal delay={0.08}><STitle>Technical Skills</STitle></Reveal>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
                    gap: "1.1rem",
                    marginTop: "2.75rem",
                    alignItems: "stretch"
                }}>
                    {data.skills.map((s, i) => (
                        <Reveal key={s.category} delay={i * 0.06}>
                            <div style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 12,
                                padding: "1.6rem",
                                transition: "all 0.3s",
                                height: "100%"
                            }}
                                 onMouseEnter={e => {
                                     e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
                                     e.currentTarget.style.background = "rgba(0,229,255,0.04)";
                                     e.currentTarget.style.transform = "translateY(-3px)";
                                 }}
                                 onMouseLeave={e => {
                                     e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                                     e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                                     e.currentTarget.style.transform = "none";
                                 }}
                            >
                                <div style={{
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: "0.62rem",
                                    color: CYAN,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    marginBottom: "1.1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}>
                                    <span style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: "50%",
                                        background: CYAN,
                                        display: "inline-block"
                                    }}/>{s.category}
                                </div>
                                <div style={{display: "flex", flexWrap: "wrap", gap: "0.45rem"}}>
                                    {s.items.map(item => (
                                        <span key={item} style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: "0.8rem",
                                            color: "rgba(255,255,255,0.7)",
                                            background: "rgba(255,255,255,0.05)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            padding: "0.28rem 0.7rem",
                                            borderRadius: 20,
                                            transition: "all 0.2s"
                                        }}
                                              onMouseEnter={e => {
                                                  e.target.style.background = "rgba(0,229,255,0.1)";
                                                  e.target.style.borderColor = "rgba(0,229,255,0.3)";
                                                  e.target.style.color = CYAN;
                                              }}
                                              onMouseLeave={e => {
                                                  e.target.style.background = "rgba(255,255,255,0.05)";
                                                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                                                  e.target.style.color = "rgba(255,255,255,0.7)";
                                              }}
                                        >{item}</span>
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

/* ─────────────────────────────────────────
   PROJECTS
───────────────────────────────────────── */
function Projects() {
    const [active, setActive] = useState(0);
    return (
        <section id="projects" style={sec()}>
            <div style={wrap()}>
                <Reveal><SLabel>Work</SLabel></Reveal>
                <Reveal delay={0.08}><STitle>Featured Projects</STitle></Reveal>

                {/* tab selector */}
                <Reveal delay={0.14}>
                    <div style={{display: "flex", gap: "0.5rem", marginTop: "2.5rem", flexWrap: "wrap"}}>
                        {data.projects.map((p, i) => (
                            <button key={p.name} onClick={() => setActive(i)} style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.72rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "0.6rem 1.4rem",
                                borderRadius: 8,
                                cursor: "pointer",
                                transition: "all 0.22s",
                                border: "none",
                                background: active === i ? CYAN : "rgba(255,255,255,0.05)",
                                color: active === i ? "#000" : "rgba(255,255,255,0.45)",
                                fontWeight: active === i ? 700 : 400,
                            }}>{p.name}</button>
                        ))}
                    </div>
                </Reveal>

                {data.projects.map((p, i) => i !== active ? null : (
                    <div key={p.name} className="projects-grid"
                         style={{marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem"}}>
                        {/* browser mockup */}
                        <Reveal delay={0.05} from="left">
                            <div style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 12,
                                overflow: "hidden"
                            }}>
                                {/* browser chrome */}
                                <div style={{
                                    background: "rgba(255,255,255,0.04)",
                                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    padding: "0.7rem 1rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem"
                                }}>
                                    <span style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: "#ff5f57",
                                        display: "inline-block"
                                    }}/>
                                    <span style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: "#febc2e",
                                        display: "inline-block"
                                    }}/>
                                    <span style={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: "50%",
                                        background: "#28c840",
                                        display: "inline-block"
                                    }}/>
                                    <div style={{
                                        flex: 1,
                                        background: "rgba(255,255,255,0.06)",
                                        borderRadius: 4,
                                        padding: "0.25rem 0.75rem",
                                        marginLeft: "0.5rem"
                                    }}>
                                        <span style={{
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: "0.65rem",
                                            color: "rgba(255,255,255,0.3)"
                                        }}>{p.live}</span>
                                    </div>
                                </div>
                                {/* project info inside mock */}
                                <div style={{padding: "2rem"}}>
                                    <div style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.4rem",
                                        marginBottom: "1.5rem"
                                    }}>
                                        {p.stack.map(t => <span key={t} style={{
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: "0.62rem",
                                            color: CYAN,
                                            background: "rgba(0,229,255,0.08)",
                                            border: "1px solid rgba(0,229,255,0.15)",
                                            padding: "0.2rem 0.55rem",
                                            borderRadius: 4
                                        }}>{t}</span>)}
                                    </div>
                                    <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem"}}>
                                        {Object.entries(
                                            i === 0
                                                ? {
                                                    "Endpoints": "25+",
                                                    "DB Entities": "8",
                                                    "Query Speed": "+60%",
                                                    "ML Latency": "<200ms"
                                                }
                                                : {
                                                    "Django Apps": "4",
                                                    "Payload Cut": "70%",
                                                    "Auth": "JWT+RBAC",
                                                    "Deploy": "Vercel"
                                                }
                                        ).map(([k, v]) => (
                                            <div key={k} style={{
                                                background: "rgba(0,229,255,0.05)",
                                                border: "1px solid rgba(0,229,255,0.1)",
                                                borderRadius: 8,
                                                padding: "0.85rem"
                                            }}>
                                                <div style={{
                                                    fontFamily: "'Syne', sans-serif",
                                                    fontWeight: 800,
                                                    fontSize: "1.3rem",
                                                    color: CYAN,
                                                    lineHeight: 1
                                                }}>{v}</div>
                                                <div style={{
                                                    fontFamily: "'DM Mono', monospace",
                                                    fontSize: "0.58rem",
                                                    color: "rgba(255,255,255,0.35)",
                                                    letterSpacing: "0.08em",
                                                    marginTop: 5
                                                }}>{k}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>

                        {/* details */}
                        <Reveal delay={0.1} from="right">
                            <div style={{display: "flex", flexDirection: "column", gap: "1.25rem"}}>
                                <div>
                                    <h3 style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontWeight: 800,
                                        fontSize: "1.8rem",
                                        color: "#fff",
                                        margin: 0,
                                        letterSpacing: "-0.02em"
                                    }}>{p.name}</h3>
                                    <p style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.85rem",
                                        color: "rgba(255,255,255,0.38)",
                                        marginTop: "0.4rem"
                                    }}>{p.tagline}</p>
                                </div>
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: "1.1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.65rem"
                                }}>
                                    {p.bullets.map((b, bi) => (
                                        <li key={bi} style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: "0.88rem",
                                            color: "rgba(255,255,255,0.58)",
                                            lineHeight: 1.75
                                        }}>{b}</li>
                                    ))}
                                </ul>
                                <div style={{display: "flex", gap: "0.75rem", marginTop: "0.5rem"}}>
                                    <a href={p.live} target="_blank" rel="noreferrer" style={btn("solid")}>Live ↗</a>
                                    <a href={p.github} target="_blank" rel="noreferrer"
                                       style={btn("outline")}>GitHub</a>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   EXPERIENCE
───────────────────────────────────────── */
function Experience() {
    return (
        <section id="experience" style={sec("rgba(0,229,255,0.015)")}>
            <div style={wrap()}>
                <Reveal><SLabel>Experience</SLabel></Reveal>
                <Reveal delay={0.08}><STitle>Where I've Worked</STitle></Reveal>
                <div style={{marginTop: "2.75rem", position: "relative"}}>
                    {/* timeline line */}
                    <div style={{
                        position: "absolute",
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 1,
                        background: "linear-gradient(to bottom, rgba(0,229,255,0.6), rgba(0,229,255,0.05))"
                    }}/>
                    {data.experience.map((e, i) => (
                        <Reveal key={i} delay={0.1}>
                            <div style={{paddingLeft: "2.5rem", paddingBottom: "2.5rem", position: "relative"}}>
                                {/* dot */}
                                <div style={{
                                    position: "absolute",
                                    left: -5,
                                    top: 6,
                                    width: 11,
                                    height: 11,
                                    borderRadius: "50%",
                                    background: BG,
                                    border: `2px solid ${CYAN}`,
                                    boxShadow: `0 0 10px rgba(0,229,255,0.5)`
                                }}/>
                                <div style={{
                                    background: "rgba(255,255,255,0.025)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: 12,
                                    padding: "1.75rem 2rem",
                                    transition: "border-color 0.3s"
                                }}
                                     onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)"}
                                     onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
                                >
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                        marginBottom: "1.25rem"
                                    }}>
                                        <div>
                                            <h3 style={{
                                                fontFamily: "'Syne', sans-serif",
                                                fontWeight: 800,
                                                fontSize: "1.15rem",
                                                color: "#fff",
                                                margin: 0
                                            }}>{e.company}</h3>
                                            <div style={{
                                                fontFamily: "'DM Mono', monospace",
                                                fontSize: "0.72rem",
                                                color: CYAN,
                                                marginTop: 4,
                                                letterSpacing: "0.04em"
                                            }}>{e.role} — {e.sub}</div>
                                        </div>
                                        <div style={{
                                            fontFamily: "'DM Mono', monospace",
                                            fontSize: "0.65rem",
                                            color: "rgba(255,255,255,0.3)",
                                            background: "rgba(255,255,255,0.04)",
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            padding: "0.3rem 0.75rem",
                                            borderRadius: 20,
                                            letterSpacing: "0.06em",
                                            whiteSpace: "nowrap"
                                        }}>{e.period}</div>
                                    </div>
                                    <ul style={{
                                        margin: 0,
                                        paddingLeft: "1.1rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.6rem"
                                    }}>
                                        {e.bullets.map((b, bi) => <li key={bi} style={{
                                            fontFamily: "'DM Sans', sans-serif",
                                            fontSize: "0.88rem",
                                            color: "rgba(255,255,255,0.55)",
                                            lineHeight: 1.75
                                        }}>{b}</li>)}
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

/* ─────────────────────────────────────────
   RESEARCH
───────────────────────────────────────── */
function Research() {
    return (
        <section id="research" style={sec()}>
            <div style={wrap()}>
                <Reveal><SLabel>Academic Work</SLabel></Reveal>
                <Reveal delay={0.08}><STitle>Research</STitle></Reveal>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
                    gap: "1.1rem",
                    marginTop: "2.75rem"
                }}>
                    {data.research.map((r, i) => (
                        <Reveal key={i} delay={i * 0.09}>
                            <div style={{
                                background: "rgba(255,255,255,0.025)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: 12,
                                padding: "1.75rem",
                                height: "100%",
                                boxSizing: "border-box",
                                transition: "all 0.3s",
                                position: "relative",
                                overflow: "hidden"
                            }}
                                 onMouseEnter={e => {
                                     e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
                                     e.currentTarget.style.transform = "translateY(-3px)";
                                 }}
                                 onMouseLeave={e => {
                                     e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                                     e.currentTarget.style.transform = "none";
                                 }}
                            >
                                {/* number badge */}
                                <div style={{
                                    position: "absolute",
                                    top: "1.25rem",
                                    right: "1.25rem",
                                    fontFamily: "'Syne', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "2.5rem",
                                    color: "rgba(0,229,255,0.06)",
                                    lineHeight: 1
                                }}>
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <div style={{
                                    fontFamily: "'DM Mono', monospace",
                                    fontSize: "0.6rem",
                                    color: CYAN,
                                    letterSpacing: "0.15em",
                                    textTransform: "uppercase",
                                    marginBottom: "0.85rem",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.4rem",
                                    background: "rgba(0,229,255,0.07)",
                                    border: "1px solid rgba(0,229,255,0.15)",
                                    padding: "0.2rem 0.65rem",
                                    borderRadius: 100
                                }}>{r.type}</div>
                                <h3 style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontWeight: 700,
                                    fontSize: "0.98rem",
                                    color: "#fff",
                                    margin: "0 0 1rem",
                                    lineHeight: 1.5
                                }}>{r.title}</h3>
                                <div style={{height: 1, background: "rgba(255,255,255,0.05)", marginBottom: "1rem"}}/>
                                <ul style={{
                                    margin: 0,
                                    paddingLeft: "1rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem"
                                }}>
                                    {r.bullets.map((b, bi) => <li key={bi} style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.82rem",
                                        color: "rgba(255,255,255,0.5)",
                                        lineHeight: 1.7
                                    }}>{b}</li>)}
                                </ul>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   AWARDS
───────────────────────────────────────── */
function Awards() {
    return (
        <section id="awards" style={sec("rgba(0,229,255,0.015)")}>
            <div style={wrap()}>
                <Reveal><SLabel>Recognition</SLabel></Reveal>
                <Reveal delay={0.08}><STitle>Awards & Competitions</STitle></Reveal>

                <div className="awards-grid"
                     style={{display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginTop: "2.75rem"}}>
                    <div style={{display: "flex", flexDirection: "column", gap: "0.85rem"}}>
                        {data.awards.map((a, i) => (
                            <Reveal key={i} delay={i * 0.07}>
                                <div className="awards-row" style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "1rem",
                                    background: "rgba(255,255,255,0.025)",
                                    border: "1px solid rgba(255,255,255,0.07)",
                                    borderRadius: 10,
                                    padding: "1rem 1.25rem",
                                    transition: "all 0.25s",
                                    flexWrap: "wrap",
                                }}
                                     onMouseEnter={e => {
                                         e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
                                         e.currentTarget.style.transform = "translateX(4px)";
                                     }}
                                     onMouseLeave={e => {
                                         e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                                         e.currentTarget.style.transform = "none";
                                     }}
                                >
                                    {/* trophy icon */}
                                    <div style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 8,
                                        background: "rgba(0,229,255,0.08)",
                                        border: "1px solid rgba(0,229,255,0.15)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: "1rem"
                                    }}>
                                        {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "🏆"}
                                    </div>
                                    <div style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "0.65rem",
                                        color: "rgba(255,255,255,0.28)",
                                        flexShrink: 0,
                                    }}>{a.year}</div>
                                    <div className="award-rank" style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontWeight: 700,
                                        fontSize: "0.92rem",
                                        color: CYAN,
                                        flexShrink: 0,
                                    }}>{a.rank}</div>
                                    <div style={{
                                        fontFamily: "'DM Sans', sans-serif",
                                        fontSize: "0.85rem",
                                        color: "rgba(255,255,255,0.55)",
                                        minWidth: 0,
                                        flex: "1 1 180px",
                                        wordBreak: "break-word",
                                    }}>{a.event}</div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>
                        {[
                            {
                                val: "300+",
                                label: "LeetCode Problems",
                                href: data.links.leetcode,
                                sub: "Arrays · DP · Graphs"
                            },
                            {
                                val: "170+",
                                label: "Codeforces Problems",
                                href: data.links.codeforces,
                                sub: "Greedy · Binary Search"
                            },
                        ].map((s, i) => (
                            <Reveal key={s.label} delay={i * 0.1 + 0.1}>
                                <a href={s.href} target="_blank" rel="noreferrer" style={{
                                    textDecoration: "none",
                                    display: "block",
                                    background: "rgba(0,229,255,0.05)",
                                    border: "1px solid rgba(0,229,255,0.18)",
                                    borderRadius: 12,
                                    padding: "1.5rem",
                                    transition: "all 0.25s"
                                }}
                                   onMouseEnter={e => {
                                       e.currentTarget.style.background = "rgba(0,229,255,0.09)";
                                       e.currentTarget.style.transform = "translateY(-2px)";
                                   }}
                                   onMouseLeave={e => {
                                       e.currentTarget.style.background = "rgba(0,229,255,0.05)";
                                       e.currentTarget.style.transform = "none";
                                   }}
                                >
                                    <div style={{
                                        fontFamily: "'Syne', sans-serif",
                                        fontWeight: 800,
                                        fontSize: "2.4rem",
                                        color: CYAN,
                                        lineHeight: 1
                                    }}>{s.val}</div>
                                    <div style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "0.62rem",
                                        color: "rgba(255,255,255,0.4)",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.1em",
                                        marginTop: 6
                                    }}>{s.label}</div>
                                    <div style={{
                                        fontFamily: "'DM Mono', monospace",
                                        fontSize: "0.58rem",
                                        color: "rgba(0,229,255,0.45)",
                                        marginTop: 4
                                    }}>{s.sub}</div>
                                </a>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   CONTACT
───────────────────────────────────────── */
function Contact() {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(data.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section id="contact" style={sec()}>
            <div style={{...wrap(), textAlign: "center"}}>
                <Reveal><SLabel>Get in Touch</SLabel></Reveal>
                <Reveal delay={0.08}>
                    <h2 style={{
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: 800,
                        fontSize: "clamp(2.2rem, 5vw, 4rem)",
                        color: "#fff",
                        margin: "0.5rem 0 1.5rem",
                        lineHeight: 1.05,
                        letterSpacing: "-0.02em"
                    }}>
                        Let's build something<br/><span style={{color: CYAN}}>remarkable.</span>
                    </h2>
                </Reveal>
                <Reveal delay={0.15}>
                    <p style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "rgba(255,255,255,0.42)",
                        fontSize: "0.98rem",
                        maxWidth: 500,
                        margin: "0 auto 3rem",
                        lineHeight: 1.85
                    }}>
                        Open to full-time SWE roles, internships, and meaningful collaborations. I respond within 24
                        hours.
                    </p>
                </Reveal>
                <Reveal delay={0.22}>
                    <div style={{
                        display: "flex",
                        gap: "0.85rem",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        marginBottom: "3rem"
                    }}>
                        <button onClick={copy} style={{
                            ...btn("solid"),
                            cursor: "pointer",
                            background: copied ? "#00c97a" : CYAN,
                            borderColor: copied ? "#00c97a" : CYAN,
                            transition: "all 0.3s"
                        }}>
                            {copied ? "✓ Copied!" : `✉ ${data.email}`}
                        </button>
                        <a href={`tel:${data.phone}`} style={btn("outline")}>{data.phone}</a>
                    </div>
                </Reveal>
                <Reveal delay={0.3}>
                    <div style={{display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap"}}>
                        {Object.entries(data.links).map(([key, url]) => (
                            <a key={key} href={url} target="_blank" rel="noreferrer" style={{
                                fontFamily: "'DM Mono', monospace",
                                fontSize: "0.68rem",
                                color: "rgba(255,255,255,0.35)",
                                textDecoration: "none",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                padding: "0.55rem 1.1rem",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: 6,
                                transition: "all 0.2s"
                            }}
                               onMouseEnter={e => {
                                   e.currentTarget.style.color = CYAN;
                                   e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)";
                                   e.currentTarget.style.background = "rgba(0,229,255,0.05)";
                               }}
                               onMouseLeave={e => {
                                   e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                                   e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                   e.currentTarget.style.background = "transparent";
                               }}
                            >{key} ↗</a>
                        ))}
                    </div>
                </Reveal>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────
   SHARED
───────────────────────────────────────── */
const sec = (bg = "transparent") => ({padding: "7rem 1.5rem", background: bg, width: "100%", boxSizing: "border-box"});
const wrap = () => ({maxWidth: 1160, margin: "0 auto", width: "100%"});

const SLabel = ({children}) => (
    <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: "0.68rem",
        color: CYAN,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        marginBottom: "0.65rem",
        display: "flex",
        alignItems: "center",
        gap: "0.6rem"
    }}>
        <span style={{width: 20, height: 1, background: CYAN, display: "inline-block"}}/>
        {children}
    </div>
);

const STitle = ({children}) => (
    <h2 style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
        color: "#fff",
        margin: 0,
        lineHeight: 1.1,
        letterSpacing: "-0.02em"
    }}>{children}</h2>
);

/* ─────────────────────────────────────────
   APP
───────────────────────────────────────── */
export default function App() {
    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        html { overflow-x: hidden; max-width: 100%; }
        body { background: ${BG}; color: #fff; -webkit-font-smoothing: antialiased; overflow-x: hidden; max-width: 100%; position: relative; }
        @media (pointer: fine) { /* cursor:none applied dynamically on first mousemove */ }
        @keyframes trailFade { from { opacity: 0.6; transform: scale(1); } to { opacity: 0; transform: scale(0.2); } }
        ::selection { background: ${CYAN}; color: #000; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: ${BG}; }
        ::-webkit-scrollbar-thumb { background: ${CYAN}44; border-radius: 2px; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes scrollPulse { 0%,100%{opacity:0.4;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.15)} }
        @media (max-width: 960px) {
          .nav-links { display: none !important; }
          .hamburger { display: flex !important; }
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .awards-grid { grid-template-columns: 1fr !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .awards-row { padding: 0.85rem 1rem !important; gap: 0.65rem !important; }
          .award-rank { font-size: 0.82rem !important; }
        }
        @media (max-width: 640px) {
          html, body { max-width: 100%; overflow-x: hidden; }
          section { padding: 4rem 1.1rem !important; }
          #hero { padding-top: 90px !important; padding-left: 1rem !important; padding-right: 1rem !important; }
          .awards-row { flex-wrap: wrap !important; gap: 0.6rem !important; align-items: flex-start !important; }
          .awards-row .award-rank { font-size: 0.78rem !important; }
          footer { padding: 1.5rem 1.1rem !important; flex-direction: column !important; text-align: center !important; }
        }
      `}</style>
            <MouseTracker/>
            <Nav/>
            <main>
                <Hero/>
                <About/>
                <Skills/>
                <Projects/>
                <Experience/>
                <Research/>
                <Awards/>
                <Contact/>
            </main>
            <Chatbot/>
            <footer style={{
                borderTop: "1px solid rgba(255,255,255,0.05)",
                padding: "2rem 1.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
            }}>
                <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.1em"
                }}>© {new Date().getFullYear()} REDWAN AHMED UTSAB</span>
                <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.18)",
                    letterSpacing: "0.1em"
                }}>BUILT WITH REACT · DEPLOYED ON VERCEL</span>
            </footer>
        </>
    );
}
