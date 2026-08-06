import {createContext, useContext, useState, useEffect, useCallback, useMemo} from "react";
import {motion, AnimatePresence} from "framer-motion";

const CYAN = "#00e5ff";

/* ------------------------------------------------------------------ */
/* THEME                                                              */
/* ------------------------------------------------------------------ */
/*
 * Light mode is implemented with a single CSS `filter: invert(1) hue-rotate(180deg)`
 * applied to the whole app tree instead of a second hand-authored color palette.
 * Because every color in this file is already high-contrast (near-black bg / near-white
 * text, one cyan accent), inverting flips bg<->text cleanly to white-bg/dark-text, and
 * the hue-rotate brings the cyan accent back to ~its original hue (invert+180° hue-rotate
 * is a well-known trick for exactly this — it round-trips saturated accent colors while
 * flipping lightness). The `filter` property transitions smoothly, which is what gives us
 * the crossfade between themes instead of an abrupt flash.
 */
export const ThemeContext = createContext({theme: "dark", toggle: () => {}});
export const useTheme = () => useContext(ThemeContext);
/* Exported so fixed-position pieces (Nav, Chatbot) can apply the same filter directly on
   themselves rather than inheriting it — see the note in ThemeProvider below. */
export const themeFilter = (theme) => (theme === "light" ? "invert(1) hue-rotate(180deg)" : "none");

function ThemeProvider({children}) {
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") return "dark";
        return localStorage.getItem("theme") || "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", theme);
        document.documentElement.dataset.theme = theme;
    }, [theme]);

    const toggle = useCallback(() => setTheme(t => (t === "dark" ? "light" : "dark")), []);
    const value = useMemo(() => ({theme, toggle}), [theme, toggle]);

    /*
     * ThemeProvider only supplies context here — it deliberately does NOT wrap `children`
     * in a `filter`-styled div. CSS `filter` on an element makes it the containing block
     * for any `position: fixed` descendant (same effect as `transform`), so a single
     * filtered wrapper around the whole app would silently re-anchor every fixed element
     * (the navbar, the chat button) to the wrapper's box instead of the viewport — which
     * is exactly what made the chat button disappear in light mode. Instead, each
     * fixed-position piece (Nav, Chatbot) applies `themeFilter(theme)` to itself directly,
     * and the scrolling page content is wrapped separately in <ThemedContent>.
     */
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/* Wraps ordinary (non-fixed) page content in the invert filter. Safe to group here since
   nothing inside main/footer uses position:fixed. */
function ThemedContent({children}) {
    const {theme} = useTheme();
    return (
        <div style={{filter: themeFilter(theme), transition: "filter 0.6s cubic-bezier(.16,1,.3,1)"}}>
            {children}
        </div>
    );
}

function ThemeToggle() {
    const {theme, toggle} = useTheme();
    const isLight = theme === "light";
    return (
        <button
            onClick={toggle}
            data-magnetic
            aria-label="Toggle light and dark theme"
            style={{
                position: "relative",
                width: 38,
                height: 38,
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.03)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "border-color 0.25s, background 0.25s",
                color: CYAN,
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(0,229,255,0.35)";
                e.currentTarget.style.background = "rgba(0,229,255,0.06)";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            }}
        >
            <AnimatePresence mode="wait" initial={false}>
                {isLight ? (
                    <motion.svg key="sun" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 initial={{rotate: -90, opacity: 0, scale: 0.5}}
                                 animate={{rotate: 0, opacity: 1, scale: 1}}
                                 exit={{rotate: 90, opacity: 0, scale: 0.5}}
                                 transition={{duration: 0.3, ease: [.16, 1, .3, 1]}}>
                        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.8"/>
                        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
                            <line key={deg} x1="12" y1="2.2" x2="12" y2="4.6" stroke="currentColor"
                                  strokeWidth="1.8" strokeLinecap="round"
                                  transform={`rotate(${deg} 12 12)`}/>
                        ))}
                    </motion.svg>
                ) : (
                    <motion.svg key="moon" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                 initial={{rotate: 90, opacity: 0, scale: 0.5}}
                                 animate={{rotate: 0, opacity: 1, scale: 1}}
                                 exit={{rotate: -90, opacity: 0, scale: 0.5}}
                                 transition={{duration: 0.3, ease: [.16, 1, .3, 1]}}>
                        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.7 6.7 0 0 0 10.5 10.5z"
                              stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                    </motion.svg>
                )}
            </AnimatePresence>
        </button>
    );
}

export {ThemeProvider, ThemedContent, ThemeToggle};
