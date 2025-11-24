"use client";

import React, { useState } from "react";

const navLinks = [
    { name: "Home", href: "#" },
    { name: "Projects", href: "#" },
    { name: "About", href: "#" },
    { name: "Services", href: "#" },
    { name: "Contact", href: "#" },
];

export default function NavBar() {
    const [active, setActive] = useState(0);

    return (
        <nav
            style={{
            width: "50%",
            left: "25%",
            marginTop: "40px",
            borderRadius: "2.5rem",
            background: "none",
            boxShadow: "none",
            backdropFilter: "blur(10px) grayscale(0.15)",
            border: "1px solid rgba(120,130,140,0.10)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            overflow: "hidden",
            minHeight: "70px",
            animation: "navbarFadeIn 1.2s cubic-bezier(.77,0,.18,1) both",
            zIndex: 100,
            WebkitBackdropFilter: "blur(10px) grayscale(0.15)",
            }}
        >
            <ul
                style={{
                    display: "flex",
                    gap: "2.5rem",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    position: "relative",
                }}
            >
                {navLinks.map((link, idx) => (
                    <li
                        key={link.name}
                        style={{
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <button
                            onClick={() => setActive(idx)}
                            style={{
                                background: "none",
                                border: "none",
                                color: active === idx ? "#232b2b" : "#7a8686",
                                fontWeight: 600,
                                fontSize: "1.1rem",
                                letterSpacing: "0.04em",
                                padding: "0.7rem 1.6rem",
                                borderRadius: "2rem",
                                cursor: "pointer",
                                transition: "color 0.3s cubic-bezier(.77,0,.18,1)",
                                position: "relative",
                                zIndex: 2,
                                outline: "none",
                            }}
                        >
                            {link.name}
                            {active === idx && (
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "2rem",
                                        background:
                                            "rgba(180, 180, 180, 0.10)", // subtle overlay
                                        boxShadow: "0 2px 12px 0 rgba(80, 80, 80, 0.06)",
                                        zIndex: -1,
                                        animation: "navActiveBg 0.5s cubic-bezier(.77,0,.18,1)",
                                        border: "1px solid rgba(120,130,140,0.12)",
                                    }}
                                />
                            )}
                        </button>
                    </li>
                ))}
            </ul>
            <style>{`
                @keyframes navbarFadeIn {
                    0% { opacity: 0; transform: translateY(-30px) scale(0.95);}
                    100% { opacity: 1; transform: translateY(0) scale(1);}
                }
                @keyframes navActiveBg {
                    0% { opacity: 0; transform: scaleX(0.7);}
                    100% { opacity: 1; transform: scaleX(1);}
                }
                nav:hover {
                    box-shadow: 0 8px 24px 0 rgba(60,70,80,0.10);
                }
                nav ul li button:hover:not(:disabled):not([aria-current]) {
                    color: #232b2b;
                }
            `}</style>
        </nav>
    );
}